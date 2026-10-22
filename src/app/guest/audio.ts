import { progress } from './progress';
import { util } from '../../common/util';
import { cache } from '../../connection/cache';
import { createStore } from '../../state/store';
import { invitationConfig } from '../../config/invitationConfig';

export interface AudioSnapshot {
    isReady: boolean;
    isPlaying: boolean;
    isLoading: boolean;
}

export const audio = (() => {
    const store = createStore<AudioSnapshot>({
        isReady: false,
        isPlaying: false,
        isLoading: false,
    });

    let audioEl: HTMLAudioElement | null = null;

    const play = async (): Promise<void> => {
        if (!navigator.onLine || !audioEl) {
            return;
        }

        store.setState({ isLoading: true });

        try {
            await audioEl.play();
            store.setState({
                isPlaying: true,
                isLoading: false,
            });
        } catch (err: unknown) {
            store.setState({
                isPlaying: false,
                isLoading: false,
            });
            util.notify(err).error();
        }
    };

    const pause = (): void => {
        audioEl?.pause();
        store.setState({
            isPlaying: false,
            isLoading: false,
        });
    };

    const toggle = async (): Promise<void> => {
        if (store.getSnapshot().isPlaying) {
            pause();
        } else {
            await play();
        }
    };

    /**
     * Loads and caches the audio source into an HTMLAudioElement instance.
     */
    const load = async (audioUrl?: string | null): Promise<void> => {
        const url = audioUrl ?? invitationConfig.get().media.audioSrc;
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
            store.setState({ isReady: true });

            progress.complete('audio');
        } catch {
            progress.invalid('audio');
        }
    };

    const init = () => {
        progress.add();
        store.reset();

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
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
    };
})();
