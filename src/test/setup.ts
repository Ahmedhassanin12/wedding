import '@testing-library/jest-dom';
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'isSecureContext', {
        writable: true,
        value: true,
    });

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });

    if (!Element.prototype.scrollIntoView) {
        Element.prototype.scrollIntoView = () => {};
    }

    window.alert = () => {};
    window.confirm = () => true;

    if (!window.URL.createObjectURL) {
        window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-blob');
    }
    if (!window.URL.revokeObjectURL) {
        window.URL.revokeObjectURL = vi.fn();
    }
}
