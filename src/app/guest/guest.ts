import { video, type VideoLoadOptions } from './video';
import { image } from './image';
import { audio } from './audio';
import { progress } from './progress';
import { util } from '../../common/util';
import { bs } from '../../libs/bootstrap';
import { loader } from '../../libs/loader';
import { theme } from '../../common/theme';
import { lang } from '../../common/language';
import { storage } from '../../common/storage';
import { offline } from '../../common/offline';
import * as confetti from '../../libs/confetti';
import { pool } from '../../connection/request';
import type { LoaderOptions, StorageAdapter } from '../../types';

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
    let config: StorageAdapter<Record<string, any>> | null = null;
    let isOpened = false;
    let isBooted = false;
    let selectedImage: SelectedModalImage | null = null;
    let modalElementRef: HTMLElement | null = null;
    const listeners = new Set<() => void>();

    let currentSnapshot: GuestSnapshot = {
        isOpened: false,
        isBooted: false,
        selectedImage: null,
    };

    const emitChange = (): void => {
        currentSnapshot = {
            isOpened,
            isBooted,
            selectedImage,
        };
        listeners.forEach((listener) => listener());
    };

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const getSnapshot = (): GuestSnapshot => currentSnapshot;

    const ensureStores = (): StorageAdapter<Record<string, any>> => {
        if (!config) {
            config = storage('config');
        }
        return config;
    };

    const open = (button?: HTMLButtonElement | null): void => {
        if (button) {
            button.disabled = true;
        }
        isOpened = true;
        emitChange();

        document.body.scrollIntoView?.({ behavior: 'instant' });

        confetti.basicAnimation();
        util.timeOut(confetti.openAnimation, 1500);
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
        selectedImage = nextImage;
        emitChange();

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
        ensureStores();

        if (refs?.modalElement !== undefined) {
            modalElementRef = refs.modalElement;
        }

        const cleanupSections = refs?.sections ? theme.observeSections(refs.sections) : () => {};

        const vid = video.init();
        const img = image.init(refs?.images);
        const aud = audio.init();
        const lib = loaderLibs();

        const unsubscribeDone = progress.onDone(() => {
            isBooted = true;
            emitChange();
        });

        void vid.load(refs?.videoOptions);
        void img.load();
        void aud.load(refs?.audioUrl);
        lib.load({
            confetti:
                refs?.enableConfetti ??
                (typeof document !== 'undefined' && document.body.getAttribute('data-confetti') === 'true'),
        });

        return () => {
            unsubscribeDone();
            cleanupSections();
            cleanupOffline();
            vid.cleanup();
        };
    };

    const reset = (): void => {
        isOpened = false;
        isBooted = false;
        selectedImage = null;
        emitChange();
    };

    const init = (refs?: GuestMountRefs) => {
        reset();

        theme.init();

        let cleanupPage: (() => void) | null = null;

        const startPool = () => {
            pool.init(() => {
                cleanupPage = pageLoaded(refs);
            }, ['image', 'video', 'audio', 'libs']);
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
            progress,
            offline,
            cleanup: () => {
                cleanupPage?.();
            },
            guest: {
                open,
                modal,
                showStory,
                subscribe,
                getSnapshot,
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
        subscribe,
        getSnapshot,
        setModalElement,
    };
})();
