import { progress } from './progress';
import { util } from '../../common/util';
import { cache, type CacheInstance } from '../../connection/cache';
import { HTTP_GET, request, HTTP_STATUS_OK, HTTP_STATUS_PARTIAL_CONTENT } from '../../connection/request';

export const video = (() => {
    let c: CacheInstance | null = null;

    const load = (): Promise<void> => {
        const wrap = document.getElementById('video-love-stroy');
        if (!wrap || !wrap.hasAttribute('data-src')) {
            wrap?.remove();
            progress.complete('video', true);
            return Promise.resolve();
        }

        const src = wrap.getAttribute('data-src');
        if (!src) {
            progress.complete('video', true);
            return Promise.resolve();
        }

        const vid = document.createElement('video');
        vid.className = wrap.getAttribute('data-vid-class') ?? '';
        vid.loop = true;
        vid.muted = true;
        vid.controls = false;
        vid.autoplay = false;
        vid.playsInline = true;
        vid.preload = 'metadata';

        const observer =
            typeof IntersectionObserver !== 'undefined'
                ? new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? void vid.play() : vid.pause())))
                : null;

        const prepareVideo = (b: Blob): void => {
            vid.preload = 'auto';
            vid.controls = true;
            vid.disableRemotePlayback = true;
            vid.disablePictureInPicture = true;
            vid.setAttribute('controlsList', 'noremoteplayback nodownload noplaybackrate');
            vid.src = URL.createObjectURL(b);
        };

        const fetchBasic = (): Promise<Response | void> => {
            const bar = document.getElementById('progress-bar-video-love-stroy');
            const inf = document.getElementById('progress-info-video-love-stroy');

            return request(HTTP_GET, src)
                .withNoBody()
                .default({ Range: 'bytes=0-1' })
                .then((res) => {
                    if (res.status === HTTP_STATUS_OK) {
                        vid.preload = 'none';
                        vid.src = util.escapeHtml(src);
                        wrap.appendChild(vid);

                        return Promise.resolve();
                    }

                    if (res.status !== HTTP_STATUS_PARTIAL_CONTENT) {
                        throw new Error('failed to fetch video');
                    }

                    vid.addEventListener('error', () => progress.invalid('video'));
                    const loaded = new Promise((r) => vid.addEventListener('loadedmetadata', r, { once: true }));

                    vid.src = util.escapeHtml(src);
                    wrap.appendChild(vid);

                    return loaded;
                })
                .then(() => {
                    vid.pause();
                    vid.currentTime = 0;
                    progress.complete('video');

                    const height = vid.getBoundingClientRect().width * (vid.videoHeight / vid.videoWidth);
                    vid.style.height = `${height}px`;
                    wrap.style.height = `${height}px`;

                    return request(HTTP_GET, src)
                        .withRetry()
                        .withProgressFunc((a, b) => {
                            const result = Number((a / b) * 100).toFixed(0) + '%';

                            if (bar) {
                                bar.style.width = result;
                            }
                            if (inf) {
                                inf.innerText = result;
                            }
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
                    if (bar) {
                        bar.style.backgroundColor = 'red';
                    }
                    if (inf) {
                        inf.innerText = 'Error loading video';
                    }
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
                wrap.appendChild(vid);
                await loaded;
                progress.complete('video');
            })
            .then(() => {
                observer?.observe(vid);
                vid.style.removeProperty('height');
                wrap.style.removeProperty('height');
                document.getElementById('video-love-stroy-loading')?.remove();
            });
    };

    const init = () => {
        progress.add();
        c = cache('video').withForceCache();

        return {
            load,
        };
    };

    return {
        init,
    };
})();
