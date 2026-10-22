import { cache, type CacheInstance } from '../connection/cache';
import { invitationConfig } from '../config/invitationConfig';
import type { LoaderOptions } from '../types';

const loadAOS = (c: CacheInstance): Promise<void> => {
    const { aosCssUrl, aosJsUrl } = invitationConfig.get().network.cdnAssets;

    const loadCss = (): Promise<void> =>
        c.get(aosCssUrl).then(
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
        c.get(aosJsUrl).then(
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
    const { confettiJsUrl } = invitationConfig.get().network.cdnAssets;

    return c.get(confettiJsUrl).then(
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
    const { fonts } = invitationConfig.get().network.cdnAssets;

    const loadFont = ({ css, family }: { readonly css: string; readonly family: string }): Promise<FontFace[]> =>
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
    const { presentation } = invitationConfig.get();
    const promises: Promise<void>[] = [];
    const c = cache('libs').withForceCache();

    if (opt.aos ?? presentation.enableAos) {
        promises.push(loadAOS(c));
    }

    if (opt.confetti ?? presentation.enableConfetti) {
        promises.push(loadConfetti(c));
    }

    if (opt.additionalFont ?? presentation.enableAdditionalFonts) {
        promises.push(loadAdditionalFont(c));
    }

    return Promise.all(promises).then(() => undefined);
};
