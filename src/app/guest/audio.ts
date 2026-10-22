import { progress } from './progress';
import { util } from '../../common/util';
import { cache } from '../../connection/cache';

export interface AudioSnapshot {
    isReady: boolean;
    isPlaying: boolean;
    isLoading: boolean;
}

export const audio = (() => {
    let audioEl: HTMLAudioElement | null = null;
    let isReady = false;
    let isPlaying = false;
    let isLoading = false;
    const listeners = new Set<() => void>();

    let currentSnapshot: AudioSnapshot = {
        isReady: false,
        isPlaying: false,
        isLoading: false,
    };

    const emitChange = (): void => {
        currentSnapshot = {
            isReady,
            isPlaying,
            isLoading,
        };
        listeners.forEach((listener) => listener());
    };

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const getSnapshot = (): AudioSnapshot => currentSnapshot;

    const play = async (): Promise<void> => {
        if (!navigator.onLine || !audioEl) {
            return;
        }

        isLoading = true;
        emitChange();

        try {
            await audioEl.play();
            isPlaying = true;
            isLoading = false;
            emitChange();
        } catch (err: unknown) {
            isPlaying = false;
            isLoading = false;
            emitChange();
            util.notify(err).error();
        }
    };

    const pause = (): void => {
        isPlaying = false;
        isLoading = false;
        audioEl?.pause();
        emitChange();
    };

    const toggle = async (): Promise<void> => {
        if (isPlaying) {
            pause();
        } else {
            await play();
        }
    };

    /**
     * Loads and caches the audio source into an HTMLAudioElement instance.
     */
    const load = async (audioUrl?: string | null): Promise<void> => {
        const url = audioUrl ?? document.body.getAttribute('data-audio');
        if (!url) {
            progress.complete('audio', true);
            return;
        }

        try {
            audioEl = new Audio(await cache('audio').withForceCache().get(url, progress.getAbort()));
            audioEl.loop = true;
            audioEl.muted = false;
            audioEl.autoplay = false;
            audioEl.controls = false;
            isReady = true;
            emitChange();

            progress.complete('audio');
        } catch {
            progress.invalid('audio');
        }
    };

    const init = () => {
        progress.add();
        isReady = false;
        isPlaying = false;
        isLoading = false;
        emitChange();

        return {
            load,
            play,
            pause,
            toggle,
        };
    };

    return {
        init,
        play,
        pause,
        toggle,
        subscribe,
        getSnapshot,
    };
})();
