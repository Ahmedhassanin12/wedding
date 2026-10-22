import { progress } from './progress';
import { cache, type CacheInstance } from '../../connection/cache';
import type { CacheRunItem } from '../../types';

export const image = (() => {
    let images: HTMLImageElement[] = [];
    let c: CacheInstance | null = null;

    const urlCache: CacheRunItem[] = [];

    const loadedImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = rej;
            i.src = src;
        });

    const appendImage = (el: HTMLImageElement, src: string): Promise<void> =>
        loadedImage(src).then((img) => {
            el.width = img.naturalWidth;
            el.height = img.naturalHeight;
            el.src = img.src;
            el.dataset.loaded = 'true';

            progress.complete('image');
        });

    const getByFetch = (el: HTMLImageElement): void => {
        urlCache.push({
            url: el.getAttribute('data-src') ?? '',
            res: (url: string) => appendImage(el, url),
            rej: (err: unknown) => {
                console.error(err);
                progress.invalid('image');
            },
        });
    };

    const getByDefault = (el: HTMLImageElement): void => {
        el.onerror = () => progress.invalid('image');
        el.onload = () => {
            el.width = el.naturalWidth;
            el.height = el.naturalHeight;
            progress.complete('image');
        };

        if (el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0) {
            progress.complete('image');
        } else if (el.complete) {
            progress.invalid('image');
        }
    };

    const hasDataSrc = (): boolean => images.some((i) => i.hasAttribute('data-src'));

    const load = async (): Promise<void> => {
        if (images.length === 0 || !c) {
            return;
        }

        const runGroup = async (filter: (el: HTMLImageElement) => boolean): Promise<void> => {
            urlCache.length = 0;
            images.filter(filter).forEach((el) => (el.hasAttribute('data-src') ? getByFetch(el) : getByDefault(el)));
            await c!.run(urlCache, progress.getAbort());
        };

        await runGroup((el) => el.hasAttribute('fetchpriority'));
        await runGroup((el) => !el.hasAttribute('fetchpriority'));
    };

    const download = (blobUrl: string): void => {
        if (!c) {
            c = cache('image').withForceCache();
        }
        void c.download(blobUrl, `${window.location.hostname}_image_${Date.now()}`);
    };

    /**
     * Initializes the image preloader and Cache API pipeline for the provided image elements.
     */
    const init = (elements?: Iterable<HTMLImageElement> | null) => {
        c = cache('image').withForceCache();
        images = elements ? Array.from(elements) : [];
        images.forEach(() => progress.add());

        return {
            load,
            download,
            hasDataSrc,
        };
    };

    return {
        init,
        download,
    };
})();
