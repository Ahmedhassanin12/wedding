import { video, type VideoLoadOptions } from './video';
import { image } from './image';
import { audio } from './audio';
import { progress } from './progress';
import { util } from '../../common/util';
import { bs } from '../../libs/bootstrap';
import { loader } from '../../libs/loader';
import { theme } from '../../common/theme';
import { lang } from '../../common/language';
import { offline } from '../../common/offline';
import * as confetti from '../../libs/confetti';
import { pool } from '../../connection/request';
import { createStore } from '../../state/store';
import { invitationConfig } from '../../config/invitationConfig';
import type { LoaderOptions } from '../../types';

export interface SelectedModalImage {
    src: string;
    width?: number;
    height?: number;
}

export interface GuestSnapshot {
    isOpened: boolean;
    isBooted: boolean;
    selectedImage: SelectedModalImage | null;
}

export interface GuestMountRefs {
    images?: Iterable<HTMLImageElement> | null;
    sections?: Iterable<HTMLElement> | null;
    modalElement?: HTMLElement | null;
    videoOptions?: VideoLoadOptions;
    audioUrl?: string | null;
    enableConfetti?: boolean;
}

export const guest = (() => {
    const store = createStore<GuestSnapshot>({
        isOpened: false,
        isBooted: false,
        selectedImage: null,
    });

    let modalElementRef: HTMLElement | null = null;

    const open = (button?: HTMLButtonElement | null): void => {
        if (button) {
            button.disabled = true;
        }
        store.setState({ isOpened: true });

        document.body.scrollIntoView?.({ behavior: 'instant' });

        confetti.basicAnimation();
        util.timeOut(confetti.openAnimation, invitationConfig.get().presentation.confettiOpenDelayMs);
        void audio.play();
    };

    const setModalElement = (el: HTMLElement | null): void => {
        modalElementRef = el;
    };

    const modal = (img: HTMLImageElement | SelectedModalImage): void => {
        const nextImage: SelectedModalImage = {
            src: img.src,
            width: img.width || undefined,
            height: img.height || undefined,
        };
        store.setState({ selectedImage: nextImage });

        if (modalElementRef) {
            bs.modal(modalElementRef).show();
        }
    };

    const showStory = (div: HTMLDivElement): void => {
        if (navigator.vibrate) {
            navigator.vibrate(500);
        }

        confetti.tapTapAnimation(div, 100);
    };

    const loaderLibs = () => {
        progress.add();

        const load = (opt: LoaderOptions): void => {
            loader(opt)
                .then(() => progress.complete('libs'))
                .catch(() => progress.invalid('libs'));
        };

        return {
            load,
        };
    };

    const pageLoaded = (refs?: GuestMountRefs): (() => void) => {
        lang.init();
        const cleanupOffline = offline.init();
        progress.init();

        if (refs?.modalElement !== undefined) {
            modalElementRef = refs.modalElement;
        }

        const cleanupSections = refs?.sections ? theme.observeSections(refs.sections) : () => {};

        const vid = video.init();
        const img = image.init(refs?.images);
        const aud = audio.init();
        const lib = loaderLibs();

        const unsubscribeDone = progress.onDone(() => {
            store.setState({ isBooted: true });
        });

        const cfg = invitationConfig.get();
        void vid.load(refs?.videoOptions);
        void img.load();
        void aud.load(refs?.audioUrl ?? cfg.media.audioSrc);
        lib.load({
            confetti: refs?.enableConfetti ?? cfg.presentation.enableConfetti,
        });

        return () => {
            unsubscribeDone();
            cleanupSections();
            cleanupOffline();
            vid.cleanup();
        };
    };

    const reset = (): void => {
        store.reset();
    };

    const init = (refs?: GuestMountRefs) => {
        reset();
        invitationConfig.syncFromDom();
        theme.init();

        let cleanupPage: (() => void) | null = null;
        const { cacheBuckets } = invitationConfig.get().network;

        const startPool = () => {
            pool.init(() => {
                cleanupPage = pageLoaded(refs);
            }, cacheBuckets);
        };

        if (typeof document !== 'undefined') {
            if (document.readyState === 'complete') {
                startPool();
            } else {
                window.addEventListener('load', startPool, { once: true });
            }
        }

        return {
            util,
            theme,
            audio,
            video,
            progress,
            offline,
            config: invitationConfig,
            cleanup: () => {
                cleanupPage?.();
            },
            guest: {
                open,
                modal,
                showStory,
                reset,
                subscribe: store.subscribe,
                getSnapshot: store.getSnapshot,
                setModalElement,
            },
        };
    };

    return {
        init,
        reset,
        pageLoaded,
        open,
        modal,
        showStory,
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
        setModalElement,
    };
})();
