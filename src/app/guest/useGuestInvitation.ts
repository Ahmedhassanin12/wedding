import { useEffect, useState } from 'react';
import { guest, type GuestSnapshot } from './guest';
import { progress, type ProgressSnapshot } from './progress';
import { audio, type AudioSnapshot } from './audio';
import { video, type VideoSnapshot } from './video';
import { offline, type OfflineSnapshot } from '../../common/offline';
import { theme, type ThemeSnapshot } from '../../common/theme';
import { useStore } from '../../state/store';
import { invitationConfig, type EventConfig } from '../../config/invitationConfig';

export interface CountdownValues {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

const padTwoDigits = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

export const computeCountdown = (targetTime: string): CountdownValues => {
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

export const useDesktopSlideshow = (
    slideCount: number,
    isOpened: boolean,
    intervalMs = invitationConfig.get().presentation.slideshowIntervalMs,
): number => {
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

export const useGuestStore = (): GuestSnapshot => useStore(guest);

export const useProgressStore = (): ProgressSnapshot => useStore(progress);

export const useOfflineStore = (): OfflineSnapshot => useStore(offline);

export const useThemeStore = (): ThemeSnapshot => useStore(theme);

export const useAudioStore = (): AudioSnapshot => useStore(audio);

export const useVideoStore = (): VideoSnapshot => useStore(video);

export const buildGoogleCalendarUrl = (eventConfig: EventConfig = invitationConfig.get().event): string => {
    const formatDate = (d: string): string =>
        new Date(d.replace(' ', 'T') + ':00Z').toISOString().replace(/[-:]/g, '').split('.').shift() ?? '';

    const url = new URL('https://calendar.google.com/calendar/render');
    const data = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventConfig.calendarTitle,
        dates: `${formatDate(eventConfig.calendarStartTime)}/${formatDate(eventConfig.calendarEndTime)}`,
        details: eventConfig.calendarDescription,
        location: eventConfig.locationAddress,
        ctz: eventConfig.calendarTimeZone,
    });

    url.search = data.toString();
    return url.toString();
};
