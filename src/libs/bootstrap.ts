import type { BootstrapModalInstance, BootstrapTabInstance } from '../types';

export const bs = (() => {
    const modal = (id: string): BootstrapModalInstance => {
        const el = document.getElementById(id);
        if (!el || !window.bootstrap?.Modal) {
            return {
                show: () => {},
                hide: () => {},
            };
        }
        return window.bootstrap.Modal.getOrCreateInstance(el);
    };

    const tab = (id: string): BootstrapTabInstance => {
        const el = document.getElementById(id);
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
