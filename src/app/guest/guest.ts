import { video } from './video';
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

export const guest = (() => {
    let config: StorageAdapter<Record<string, any>> | null = null;

    const ensureStores = () => {
        if (!config) {
            config = storage('config');
        }
    };

    const countDownDate = (): void => {
        const rawTime = document.body.getAttribute('data-time') ?? '2024-01-01 09:30:00';
        const count = new Date(rawTime.replace(' ', 'T')).getTime();

        const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

        const day = document.getElementById('day');
        const hour = document.getElementById('hour');
        const minute = document.getElementById('minute');
        const second = document.getElementById('second');

        const updateCountdown = (): void => {
            const distance = Math.abs(count - Date.now());

            if (day) {
                day.textContent = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
            }
            if (hour) {
                hour.textContent = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            }
            if (minute) {
                minute.textContent = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
            }
            if (second) {
                second.textContent = pad(Math.floor((distance % (1000 * 60)) / 1000));
            }

            util.timeOut(updateCountdown, 1000 - (Date.now() % 1000));
        };

        util.timeOut(updateCountdown);
    };

    const showGuestName = (): void => {
        const raw = window.location.search.split('to=');
        let name: string | null = null;

        if (raw.length > 1 && raw[1].length >= 1) {
            name = window.decodeURIComponent(raw[1]);
        }

        if (name) {
            const guestName = document.getElementById('guest-name');
            if (guestName) {
                guestName.replaceChildren();
                const div = document.createElement('div');
                div.classList.add('m-2');

                const template = `<small class="mt-0 mb-1 mx-0 p-0">${util.escapeHtml(guestName.getAttribute('data-message'))}</small><p class="m-0 p-0" style="font-size: 1.25rem">${util.escapeHtml(name)}</p>`;
                util.safeInnerHTML(div, template);

                guestName.appendChild(div);
            }
        }
    };

    const slide = async (): Promise<void> => {
        const interval = 6000;
        const slides = document.querySelectorAll<HTMLElement>('.slide-desktop');

        if (!slides || slides.length === 0) {
            return;
        }

        const desktopEl = document.getElementById('root')?.querySelector<HTMLElement>('.d-sm-block');
        if (!desktopEl) {
            return;
        }

        desktopEl.dispatchEvent(new Event('undangan.slide.stop'));

        if (window.getComputedStyle(desktopEl).display === 'none') {
            return;
        }

        if (slides.length === 1) {
            await util.changeOpacity(slides[0], true);
            return;
        }

        let index = 0;
        for (const [i, s] of slides.entries()) {
            if (i === index) {
                s.classList.add('slide-desktop-active');
                await util.changeOpacity(s, true);
                break;
            }
        }

        let run = true;
        const nextSlide = async (): Promise<boolean> => {
            await util.changeOpacity(slides[index], false);
            slides[index].classList.remove('slide-desktop-active');

            index = (index + 1) % slides.length;

            if (run) {
                slides[index].classList.add('slide-desktop-active');
                await util.changeOpacity(slides[index], true);
            }

            return run;
        };

        desktopEl.addEventListener('undangan.slide.stop', () => {
            run = false;
        });

        const loop = async (): Promise<void> => {
            if (await nextSlide()) {
                util.timeOut(() => {
                    void loop();
                }, interval);
            }
        };

        util.timeOut(() => {
            void loop();
        }, interval);
    };

    const open = (button: HTMLButtonElement): void => {
        button.disabled = true;
        document.body.scrollIntoView?.({ behavior: 'instant' });
        document.getElementById('root')?.classList.remove('opacity-0');

        if (theme.isAutoMode()) {
            document.getElementById('button-theme')?.classList.remove('d-none');
        }

        void slide();
        theme.spyTop();

        confetti.basicAnimation();
        util.timeOut(confetti.openAnimation, 1500);

        document.dispatchEvent(new Event('undangan.open'));
        const welcomeEl = document.getElementById('welcome');
        if (welcomeEl) {
            void util.changeOpacity(welcomeEl, false).then((el) => el.remove());
        }
    };

    const modal = (img: HTMLImageElement): void => {
        document.getElementById('button-modal-click')?.setAttribute('href', img.src);
        document.getElementById('button-modal-download')?.setAttribute('data-src', img.src);

        const i = document.getElementById('show-modal-image') as HTMLImageElement | null;
        if (i) {
            i.src = img.src;
            i.width = img.width;
            i.height = img.height;
        }
        bs.modal('modal-image').show();
    };

    const modalImageClick = (): void => {
        document.getElementById('show-modal-image')?.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const abs = target.parentNode?.querySelector<HTMLElement>('.position-absolute');
            if (!abs) {
                return;
            }

            if (abs.classList.contains('d-none')) {
                abs.classList.replace('d-none', 'd-flex');
            } else {
                abs.classList.replace('d-flex', 'd-none');
            }
        });
    };

    const showStory = (div: HTMLDivElement): void => {
        if (navigator.vibrate) {
            navigator.vibrate(500);
        }

        confetti.tapTapAnimation(div, 100);
        void util.changeOpacity(div, false).then((e) => e.remove());
    };

    const normalizeArabicFont = (): void => {
        document.querySelectorAll('.font-arabic').forEach((el) => {
            el.innerHTML = String(el.innerHTML).normalize('NFC');
        });
    };

    const animateSvg = (): void => {
        document.querySelectorAll('svg').forEach((el) => {
            if (el.hasAttribute('data-class')) {
                const cls = el.getAttribute('data-class') ?? '';
                const time = parseInt(el.getAttribute('data-time') ?? '0', 10);
                util.timeOut(() => el.classList.add(cls), time);
            }
        });
    };

    const buildGoogleCalendar = (): void => {
        ensureStores();
        const formatDate = (d: string): string =>
            new Date(d.replace(' ', 'T') + ':00Z').toISOString().replace(/[-:]/g, '').split('.').shift() ?? '';

        const url = new URL('https://calendar.google.com/calendar/render');
        const data = new URLSearchParams({
            action: 'TEMPLATE',
            text: 'The Wedding of Wahyu and Riski',
            dates: `${formatDate('2023-03-15 10:00')}/${formatDate('2023-03-15 11:00')}`,
            details:
                'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami. Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.',
            location: 'RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.',
            ctz: String(config!.get('tz') ?? 'Asia/Jakarta'),
        });

        url.search = data.toString();
        document.querySelector('#home button')?.addEventListener('click', () => window.open(url, '_blank'));
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

    const booting = async (): Promise<void> => {
        ensureStores();
        animateSvg();
        countDownDate();
        showGuestName();
        modalImageClick();
        normalizeArabicFont();
        buildGoogleCalendar();

        const welcomeEl = document.getElementById('welcome');
        if (welcomeEl) {
            await util.changeOpacity(welcomeEl, true);
        }

        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            await util.changeOpacity(loadingEl, false).then((el) => el.remove());
        }
    };

    const pageLoaded = (): void => {
        lang.init();
        offline.init();
        progress.init();

        config = storage('config');

        const vid = video.init();
        const img = image.init();
        const aud = audio.init();
        const lib = loaderLibs();

        window.addEventListener('resize', util.debounce(slide));
        document.addEventListener('undangan.progress.done', () => {
            void booting();
        });
        document.addEventListener('hide.bs.modal', () => {
            (document.activeElement as HTMLElement | null)?.blur();
        });
        document.getElementById('button-modal-download')?.addEventListener('click', (e) => {
            const src = (e.currentTarget as HTMLElement).getAttribute('data-src');
            if (src) {
                img.download(src);
            }
        });

        void vid.load();
        void img.load();
        void aud.load();
        lib.load({ confetti: document.body.getAttribute('data-confetti') === 'true' });
    };

    const init = () => {
        theme.init();

        const startPool = () => {
            pool.init(pageLoaded, ['image', 'video', 'audio', 'libs']);
        };

        if (document.readyState === 'complete') {
            startPool();
        } else {
            window.addEventListener('load', startPool, { once: true });
        }

        return {
            util,
            theme,
            guest: {
                open,
                modal,
                showStory,
            },
        };
    };

    return {
        init,
        pageLoaded,
        open,
        modal,
        showStory,
    };
})();
