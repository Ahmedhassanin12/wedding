import { cache, type CacheInstance } from '../connection/cache';
import type { LoaderOptions } from '../types';

const loadAOS = (c: CacheInstance): Promise<void> => {
    const urlCss = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
    const urlJs = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';

    const loadCss = (): Promise<void> =>
        c.get(urlCss).then(
            (uri) =>
                new Promise<void>((res, rej) => {
                    const link = document.createElement('link');
                    link.onload = () => res();
                    link.onerror = rej;

                    link.rel = 'stylesheet';
                    link.href = uri;
                    document.head.appendChild(link);
                }),
        );

    const loadJs = (): Promise<void> =>
        c.get(urlJs).then(
            (uri) =>
                new Promise<void>((res, rej) => {
                    const sc = document.createElement('script');
                    sc.onload = () => res();
                    sc.onerror = rej;

                    sc.src = uri;
                    document.head.appendChild(sc);
                }),
        );

    return Promise.all([loadCss(), loadJs()]).then(() => {
        if (typeof window.AOS === 'undefined') {
            throw new Error('AOS library failed to load');
        }

        window.AOS.init();
    });
};

const loadConfetti = (c: CacheInstance): Promise<void> => {
    const url = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.js';

    return c.get(url).then(
        (uri) =>
            new Promise<void>((res, rej) => {
                const sc = document.createElement('script');
                sc.onerror = rej;
                sc.onload = () => {
                    if (typeof window.confetti === 'undefined') {
                        rej(new Error('Confetti library failed to load'));
                    } else {
                        res();
                    }
                };

                sc.src = uri;
                document.head.appendChild(sc);
            }),
    );
};

const loadAdditionalFont = (c: CacheInstance): Promise<void> => {
    const fonts: ReadonlyArray<{ css: string; family: string }> = [
        { css: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap', family: 'Sacramento' },
        { css: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap', family: 'Noto Naskh Arabic' },
    ];

    const loadFont = ({ css, family }: { css: string; family: string }): Promise<FontFace[]> =>
        c
            .get(css)
            .then(
                (uri) =>
                    new Promise<void>((res, rej) => {
                        const link = document.createElement('link');
                        link.onload = () => res();
                        link.onerror = rej;

                        link.rel = 'stylesheet';
                        link.href = uri;
                        document.head.appendChild(link);
                    }),
            )
            .then(() => document.fonts.load(`1em "${family}"`));

    return Promise.all(fonts.map(loadFont)).then(() => undefined);
};

export const loader = (opt: LoaderOptions = {}): Promise<void> => {
    const promises: Promise<void>[] = [];
    const c = cache('libs').withForceCache();

    if (opt?.aos ?? true) {
        promises.push(loadAOS(c));
    }

    if (opt?.confetti ?? true) {
        promises.push(loadConfetti(c));
    }

    if (opt?.additionalFont ?? true) {
        promises.push(loadAdditionalFont(c));
    }

    return Promise.all(promises).then(() => undefined);
};
