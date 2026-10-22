import { progress } from './progress';
import { cache, type CacheInstance } from '../../connection/cache';
import type { CacheRunItem } from '../../types';

export const image = (() => {
    let images: NodeListOf<HTMLImageElement> | null = null;
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
            el.classList.remove('opacity-0');
            el.src = img.src;
            img.remove();

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

    const hasDataSrc = (): boolean =>
        images ? Array.from(images).some((i) => i.hasAttribute('data-src')) : false;

    const load = async (): Promise<void> => {
        if (!images || !c) {
            return;
        }
        const imgs = Array.from(images);

        const runGroup = async (filter: (el: HTMLImageElement) => boolean): Promise<void> => {
            urlCache.length = 0;
            imgs.filter(filter).forEach((el) => (el.hasAttribute('data-src') ? getByFetch(el) : getByDefault(el)));
            await c!.run(urlCache, progress.getAbort());
        };

        await runGroup((el) => el.hasAttribute('fetchpriority'));
        await runGroup((el) => !el.hasAttribute('fetchpriority'));
    };

    const download = (blobUrl: string): void => {
        void c?.download(blobUrl, `${window.location.hostname}_image_${Date.now()}`);
    };

    const init = () => {
        c = cache('image').withForceCache();
        images = document.querySelectorAll('img');
        images.forEach(progress.add);

        return {
            load,
            download,
            hasDataSrc,
        };
    };

    return {
        init,
    };
})();
