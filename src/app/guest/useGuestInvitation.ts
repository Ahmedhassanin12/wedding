import { useEffect, useState, useSyncExternalStore } from 'react';
import { progress, type ProgressSnapshot } from './progress';
import { audio, type AudioSnapshot } from './audio';
import { offline, type OfflineSnapshot } from '../../common/offline';
import { theme, type ThemeSnapshot } from '../../common/theme';

export interface CountdownValues {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

const padTwoDigits = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const computeCountdown = (targetTime: string): CountdownValues => {
    const targetMs = new Date(targetTime.replace(' ', 'T')).getTime();
    const distance = Math.abs((Number.isNaN(targetMs) ? Date.now() : targetMs) - Date.now());

    return {
        days: padTwoDigits(Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: padTwoDigits(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: padTwoDigits(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: padTwoDigits(Math.floor((distance % (1000 * 60)) / 1000)),
    };
};

export const useCountdown = (targetTime: string): CountdownValues => {
    const [values, setValues] = useState<CountdownValues>(() => computeCountdown(targetTime));

    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout> | null = null;

        const tick = (): void => {
            setValues(computeCountdown(targetTime));
            const delay = 1000 - (Date.now() % 1000);
            timerId = setTimeout(tick, delay);
        };

        tick();

        return () => {
            if (timerId !== null) {
                clearTimeout(timerId);
            }
        };
    }, [targetTime]);

    return values;
};

export const useDesktopSlideshow = (slideCount: number, isOpened: boolean, intervalMs = 6000): number => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!isOpened || slideCount <= 1) {
            return;
        }

        const mediaQuery =
            typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 576px)') : null;

        let timerId: ReturnType<typeof setInterval> | null = null;

        const startOrStop = (): void => {
            if (timerId !== null) {
                clearInterval(timerId);
                timerId = null;
            }

            if (!mediaQuery || mediaQuery.matches) {
                timerId = setInterval(() => {
                    setActiveIndex((prev) => (prev + 1) % slideCount);
                }, intervalMs);
            }
        };

        startOrStop();
        mediaQuery?.addEventListener?.('change', startOrStop);

        return () => {
            if (timerId !== null) {
                clearInterval(timerId);
            }
            mediaQuery?.removeEventListener?.('change', startOrStop);
        };
    }, [slideCount, isOpened, intervalMs]);

    return activeIndex;
};

const parseGuestNameFromSearch = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    const raw = window.location.search.split('to=');
    if (raw.length > 1 && raw[1].length >= 1) {
        try {
            return window.decodeURIComponent(raw[1].split('&')[0]);
        } catch {
            return raw[1];
        }
    }
    return null;
};

export const useGuestQueryName = (): string | null => {
    const [guestName, setGuestName] = useState<string | null>(() => parseGuestNameFromSearch());

    useEffect(() => {
        const handlePopState = (): void => {
            setGuestName(parseGuestNameFromSearch());
        };
        handlePopState();
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return guestName;
};

export const useProgressStore = (): ProgressSnapshot =>
    useSyncExternalStore(progress.subscribe, progress.getSnapshot);

export const useOfflineStore = (): OfflineSnapshot =>
    useSyncExternalStore(offline.subscribe, offline.getSnapshot);

export const useThemeStore = (): ThemeSnapshot =>
    useSyncExternalStore(theme.subscribe, theme.getSnapshot);

export const useAudioStore = (): AudioSnapshot =>
    useSyncExternalStore(audio.subscribe, audio.getSnapshot);

export const buildGoogleCalendarUrl = (timeZone = 'Asia/Jakarta'): string => {
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
        ctz: timeZone,
    });

    url.search = data.toString();
    return url.toString();
};
