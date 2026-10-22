import { progress } from './progress';
import { util } from '../../common/util';
import { cache } from '../../connection/cache';

export const audio = (() => {
    const statePlay = '<i class="fa-solid fa-circle-pause spin-button"></i>';
    const statePause = '<i class="fa-solid fa-circle-play"></i>';

    const load = async (playOnOpen = true): Promise<void> => {
        const url = document.body.getAttribute('data-audio');
        if (!url) {
            progress.complete('audio', true);
            return;
        }

        let audioEl: HTMLAudioElement | null = null;

        try {
            audioEl = new Audio(await cache('audio').withForceCache().get(url, progress.getAbort()));
            audioEl.loop = true;
            audioEl.muted = false;
            audioEl.autoplay = false;
            audioEl.controls = false;

            progress.complete('audio');
        } catch {
            progress.invalid('audio');
            return;
        }

        let isPlay = false;
        const music = document.getElementById('button-music') as HTMLButtonElement | null;

        const play = async (): Promise<void> => {
            if (!navigator.onLine || !music || !audioEl) {
                return;
            }

            music.disabled = true;
            try {
                await audioEl.play();
                isPlay = true;
                music.disabled = false;
                music.innerHTML = statePlay;
            } catch (err: unknown) {
                isPlay = false;
                util.notify(err).error();
            }
        };

        const pause = (): void => {
            isPlay = false;
            audioEl?.pause();
            if (music) {
                music.innerHTML = statePause;
            }
        };

        document.addEventListener('undangan.open', () => {
            music?.classList.remove('d-none');

            if (playOnOpen) {
                void play();
            }
        });

        music?.addEventListener('offline', pause);
        music?.addEventListener('click', () => (isPlay ? pause() : void play()));
    };

    const init = () => {
        progress.add();

        return {
            load,
        };
    };

    return {
        init,
    };
})();
