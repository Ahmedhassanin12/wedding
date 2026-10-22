import { storage } from './storage';
import type { StorageAdapter } from '../types';

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

    const ensureThemes = (): StorageAdapter<{ active: string }> => {
        if (!themes) {
            themes = storage<{ active: string }>('theme');
        }
        return themes;
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
    };

    const onDark = (): void => {
        setDark();
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        setMetaTheme(themeLight);
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

    const spyTop = (): void => {
        if (typeof IntersectionObserver === 'undefined') {
            return;
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
        document.querySelectorAll('section').forEach((e) => observerTop.observe(e));
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
                break;
            case 'light':
                setLight();
                break;
            default:
                isAuto = true;
        }

        if (isDarkMode()) {
            onDark();
        } else {
            onLight();
        }
    };

    return {
        init,
        spyTop,
        change,
        isDarkMode,
        isAutoMode,
    };
})();
