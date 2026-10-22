import type { BootstrapModalInstance, BootstrapTabInstance } from '../types';

export const bs = (() => {
    /**
     * Integrates with the external Bootstrap 5 Modal instance using a React element ref.
     */
    const modal = (el: HTMLElement | null): BootstrapModalInstance => {
        if (!el || !window.bootstrap?.Modal) {
            return {
                show: () => {},
                hide: () => {},
            };
        }
        return window.bootstrap.Modal.getOrCreateInstance(el);
    };

    const tab = (el: HTMLElement | null): BootstrapTabInstance => {
        if (!el || !window.bootstrap?.Tab) {
            return {
                show: () => {},
            };
        }
        return window.bootstrap.Tab.getOrCreateInstance(el);
    };

    return {
        tab,
        modal,
    };
})();
