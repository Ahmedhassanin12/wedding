import { storage } from './storage';
import type { StorageAdapter } from '../types';

export interface ThemeSnapshot {
    isDark: boolean;
    isAuto: boolean;
}

export const theme = (() => {
    const themeColors: Readonly<Record<string, string>> = {
        '#000000': '#ffffff',
        '#ffffff': '#000000',
        '#212529': '#f8f9fa',
        '#f8f9fa': '#212529',
    };
    const themeLight = ['#ffffff', '#f8f9fa'];
    const themeDark = ['#000000', '#212529'];

    let isAuto = false;
    let themes: StorageAdapter<{ active: string }> | null = null;
    let metaTheme: HTMLElement | null = null;
    const listeners = new Set<() => void>();

    let currentSnapshot: ThemeSnapshot = {
        isDark: false,
        isAuto: false,
    };

    const ensureThemes = (): StorageAdapter<{ active: string }> => {
        if (!themes) {
            themes = storage<{ active: string }>('theme');
        }
        return themes;
    };

    const emitChange = (): void => {
        currentSnapshot = {
            isDark: ensureThemes().get('active') === 'dark',
            isAuto,
        };
        listeners.forEach((listener) => listener());
    };

    const setLight = (): void => ensureThemes().set('active', 'light');

    const setDark = (): void => ensureThemes().set('active', 'dark');

    const setMetaTheme = (listTheme: string[]): void => {
        if (!metaTheme) {
            metaTheme = document.querySelector('meta[name="theme-color"]');
        }
        if (!metaTheme) {
            return;
        }
        const now = metaTheme.getAttribute('content') ?? '';
        metaTheme.setAttribute('content', listTheme.some((i) => i === now) ? themeColors[now] : now);
    };

    const onLight = (): void => {
        setLight();
        document.documentElement.setAttribute('data-bs-theme', 'light');
        setMetaTheme(themeDark);
        emitChange();
    };

    const onDark = (): void => {
        setDark();
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        setMetaTheme(themeLight);
        emitChange();
    };

    function isDarkMode(): boolean;
    function isDarkMode(dark: string, light: string): string;
    function isDarkMode(dark: string | null = null, light: string | null = null): boolean | string {
        const status = ensureThemes().get('active') === 'dark';

        if (dark && light) {
            return status ? dark : light;
        }

        return status;
    }

    const change = (): void => (isDarkMode() ? onLight() : onDark());

    const isAutoMode = (): boolean => isAuto;

    const getSnapshot = (): ThemeSnapshot => currentSnapshot;

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    /**
     * Observes section elements via IntersectionObserver to synchronize mobile browser
     * `<meta name="theme-color">` with the currently visible section background.
     */
    const observeSections = (sections?: Iterable<Element> | null): (() => void) => {
        if (typeof IntersectionObserver === 'undefined') {
            return () => {};
        }

        const callback: IntersectionObserverCallback = (es) =>
            es
                .filter((e) => e.isIntersecting)
                .forEach((e) => {
                    const themeColor = e.target.classList.contains('bg-white-black')
                        ? isDarkMode(themeDark[0], themeLight[0])
                        : isDarkMode(themeDark[1], themeLight[1]);

                    metaTheme?.setAttribute('content', themeColor);
                });

        const observerTop = new IntersectionObserver(callback, { rootMargin: '0% 0% -95% 0%' });
        const targets = sections ? Array.from(sections) : [];
        targets.forEach((e) => observerTop.observe(e));

        return () => {
            observerTop.disconnect();
        };
    };

    const init = (): void => {
        themes = storage('theme');
        metaTheme = document.querySelector('meta[name="theme-color"]');

        if (!themes.has('active')) {
            const prefersDark =
                typeof window.matchMedia === 'function' &&
                Boolean(window.matchMedia('(prefers-color-scheme: dark)')?.matches);
            if (prefersDark) {
                setDark();
            } else {
                setLight();
            }
        }

        switch (document.documentElement.getAttribute('data-bs-theme')) {
            case 'dark':
                setDark();
                isAuto = false;
                break;
            case 'light':
                setLight();
                isAuto = false;
                break;
            default:
                isAuto = true;
                break;
        }

        if (isDarkMode()) {
            onDark();
        } else {
            onLight();
        }
    };

    return {
        init,
        observeSections,
        change,
        isDarkMode,
        isAutoMode,
        subscribe,
        getSnapshot,
    };
})();
