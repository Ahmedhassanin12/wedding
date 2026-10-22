import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../common/storage';
import { lang } from '../common/language';
import { theme } from '../common/theme';

describe('storage, language, and theme modules', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.setAttribute('data-bs-theme', 'auto');
        document.head.innerHTML = '<meta name="theme-color" content="#000000">';
    });

    it('stores, checks, retrieves, unsets, and clears values in localStorage', () => {
        const store = storage<{ foo: string; count: number }>('test_table');
        expect(store.has('foo')).toBe(false);

        store.set('foo', 'bar');
        store.set('count', 42);

        expect(store.has('foo')).toBe(true);
        expect(store.get('foo')).toBe('bar');
        expect(store.get('count')).toBe(42);

        store.unset('foo');
        expect(store.has('foo')).toBe(false);

        store.clear();
        expect(store.get()).toEqual({});
    });

    it('maps languages and locales accurately', () => {
        lang.init();
        lang.setDefault('id');
        expect(lang.getLanguage()).toBe('id');
        expect(lang.getCountry()).toBe('ID');
        expect(lang.getLocale()).toBe('id_ID');

        const msg = lang.on('id', 'Halo').on('en', 'Hello').get();
        expect(msg).toBe('Halo');

        lang.setDefault('en');
        const msgEn = lang.on('id', 'Halo').on('en', 'Hello').get();
        expect(msgEn).toBe('Hello');
    });

    it('toggles light and dark themes and updates document attributes', () => {
        theme.init();
        const initialDark = theme.isDarkMode();
        expect(typeof initialDark).toBe('boolean');

        theme.change();
        expect(theme.isDarkMode()).toBe(!initialDark);
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe(!initialDark ? 'dark' : 'light');
    });
});
