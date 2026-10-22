import { storage } from './storage';
import { createStore } from '../state/store';
import { invitationConfig } from '../config/invitationConfig';
import type { StorageAdapter } from '../types';

export interface ThemeSnapshot {
    isDark: boolean;
    isAuto: boolean;
}

export const theme = (() => {
    const store = createStore<ThemeSnapshot>({
        isDark: false,
        isAuto: false,
    });

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

    const setMetaTheme = (listTheme: ReadonlyArray<string>): void => {
        if (!metaTheme) {
            metaTheme = document.querySelector('meta[name="theme-color"]');
        }
        if (!metaTheme) {
            return;
        }
        const { swapMap } = invitationConfig.get().presentation.themePalette;
        const now = metaTheme.getAttribute('content') ?? '';
        metaTheme.setAttribute('content', listTheme.some((i) => i === now) ? swapMap[now] : now);
    };

    const onLight = (): void => {
        const { darkColors } = invitationConfig.get().presentation.themePalette;
        setLight();
        document.documentElement.setAttribute('data-bs-theme', 'light');
        setMetaTheme(darkColors);
        store.setState({ isDark: false });
    };

    const onDark = (): void => {
        const { lightColors } = invitationConfig.get().presentation.themePalette;
        setDark();
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        setMetaTheme(lightColors);
        store.setState({ isDark: true });
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

    const isAutoMode = (): boolean => store.getSnapshot().isAuto;

    /**
     * Observes section elements via IntersectionObserver to synchronize mobile browser
     * `<meta name="theme-color">` with the currently visible section background.
     */
    const observeSections = (sections?: Iterable<Element> | null): (() => void) => {
        if (typeof IntersectionObserver === 'undefined') {
            return () => {};
        }

        const callback: IntersectionObserverCallback = (es) => {
            const { darkColors, lightColors } = invitationConfig.get().presentation.themePalette;
            es.filter((e) => e.isIntersecting).forEach((e) => {
                const themeColor = e.target.classList.contains('bg-white-black')
                    ? isDarkMode(darkColors[0], lightColors[0])
                    : isDarkMode(darkColors[1], lightColors[1]);

                metaTheme?.setAttribute('content', themeColor);
            });
        };

        const observerTop = new IntersectionObserver(callback, { rootMargin: '0% 0% -95% 0%' });
        const targets = sections ? Array.from(sections) : [];
        targets.forEach((e) => observerTop.observe(e));

        return () => {
            observerTop.disconnect();
        };
    };

    const init = (): void => {
        themes = storage<{ active: string }>('theme');
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

        let isAuto = false;
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

        store.setState({ isAuto });

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
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
    };
})();
