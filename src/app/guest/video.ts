import { progress } from './progress';
import { util } from '../../common/util';
import { cache, type CacheInstance } from '../../connection/cache';
import { HTTP_GET, request, HTTP_STATUS_OK, HTTP_STATUS_PARTIAL_CONTENT } from '../../connection/request';

export interface VideoLoadOptions {
    videoEl: HTMLVideoElement | null;
    src?: string | null;
    onProgress?: (percent: number, label: string) => void;
    onReady?: () => void;
    onError?: (message: string) => void;
}

export const video = (() => {
    let c: CacheInstance | null = null;
    let activeCleanup: (() => void) | null = null;

    /**
     * Loads, caches, and attaches an IntersectionObserver to the React-managed `<video>` element ref.
     * Reports loading progress and state transitions via callbacks so React renders the overlay declaratively.
     */
    const load = (options?: VideoLoadOptions): Promise<void> => {
        if (activeCleanup) {
            activeCleanup();
            activeCleanup = null;
        }

        const vid = options?.videoEl ?? null;
        const src = options?.src ?? vid?.getAttribute('data-src') ?? null;

        if (!vid || !src) {
            options?.onReady?.();
            progress.complete('video', true);
            return Promise.resolve();
        }

        vid.loop = true;
        vid.muted = true;
        vid.controls = false;
        vid.autoplay = false;
        vid.playsInline = true;
        vid.preload = 'metadata';

        const observer =
            typeof IntersectionObserver !== 'undefined'
                ? new IntersectionObserver((es) =>
                      es.forEach((e) => (e.isIntersecting ? void vid.play() : vid.pause())),
                  )
                : null;

        let blobObjectUrl: string | null = null;

        activeCleanup = () => {
            observer?.disconnect();
            if (blobObjectUrl) {
                URL.revokeObjectURL(blobObjectUrl);
                blobObjectUrl = null;
            }
        };

        const prepareVideo = (b: Blob): void => {
            vid.preload = 'auto';
            vid.controls = true;
            vid.disableRemotePlayback = true;
            vid.disablePictureInPicture = true;
            vid.setAttribute('controlsList', 'noremoteplayback nodownload noplaybackrate');
            if (blobObjectUrl) {
                URL.revokeObjectURL(blobObjectUrl);
            }
            blobObjectUrl = URL.createObjectURL(b);
            vid.src = blobObjectUrl;
        };

        const fetchBasic = (): Promise<Response | void> => {
            return request(HTTP_GET, src)
                .withNoBody()
                .default({ Range: 'bytes=0-1' })
                .then((res) => {
                    if (res.status === HTTP_STATUS_OK) {
                        vid.preload = 'none';
                        vid.src = util.escapeHtml(src);

                        return Promise.resolve();
                    }

                    if (res.status !== HTTP_STATUS_PARTIAL_CONTENT) {
                        throw new Error('failed to fetch video');
                    }

                    vid.addEventListener('error', () => progress.invalid('video'), { once: true });
                    const loaded = new Promise((r) => vid.addEventListener('loadedmetadata', r, { once: true }));

                    vid.src = util.escapeHtml(src);

                    return loaded;
                })
                .then(() => {
                    vid.pause();
                    vid.currentTime = 0;
                    progress.complete('video');

                    return request(HTTP_GET, src)
                        .withRetry()
                        .withProgressFunc((a, b) => {
                            const pct = Number(((a / b) * 100).toFixed(0));
                            const result = `${pct}%`;
                            options?.onProgress?.(pct, result);
                        })
                        .default();
                })
                .then((res) =>
                    res
                        .clone()
                        .blob()
                        .then((b) => {
                            const loaded = new Promise((r) => vid.addEventListener('loadedmetadata', r, { once: true }));
                            prepareVideo(b);
                            vid.load();
                            return loaded.then(() => res);
                        }),
                )
                .catch((err: unknown) => {
                    options?.onError?.('Error loading video');
                    console.error(err);
                });
        };

        if (!c) {
            c = cache('video').withForceCache();
        }

        return c
            .has(src)
            .then(async (res) => {
                if (!res) {
                    const r = await c!.del(src).then(fetchBasic);
                    if (r) {
                        await c!.set(src, r);
                    }
                    return;
                }

                const b = await res.blob();
                const loaded = new Promise((r) => vid.addEventListener('loadedmetadata', r, { once: true }));
                prepareVideo(b);
                await loaded;
                progress.complete('video');
            })
            .then(() => {
                observer?.observe(vid);
                options?.onReady?.();
            });
    };

    const cleanup = (): void => {
        if (activeCleanup) {
            activeCleanup();
            activeCleanup = null;
        }
    };

    const init = () => {
        progress.add();
        c = cache('video').withForceCache();

        return {
            load,
            cleanup,
        };
    };

    return {
        init,
        cleanup,
    };
})();
