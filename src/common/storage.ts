import type { StorageAdapter } from '../types';

export const storage = <T extends Record<string, any> = Record<string, any>>(table: string): StorageAdapter<T> => {
    const get = <K extends keyof T & string>(key: K | null = null): any => {
        const raw = localStorage.getItem(table);
        const data: Record<string, unknown> = raw ? JSON.parse(raw) : {};
        return key ? data[String(key)] : data;
    };

    const set = <K extends keyof T & string>(key: K, value: T[K]): void => {
        const data = get() as Record<string, unknown>;
        data[String(key)] = value;
        localStorage.setItem(table, JSON.stringify(data));
    };

    const has = (key: string): boolean => Object.keys(get() as Record<string, unknown>).includes(String(key));

    const unset = (key: string): void => {
        if (!has(key)) {
            return;
        }

        const data = get() as Record<string, unknown>;
        delete data[String(key)];
        localStorage.setItem(table, JSON.stringify(data));
    };

    const clear = (): void => localStorage.setItem(table, '{}');

    if (!localStorage.getItem(table)) {
        clear();
    }

    return {
        set,
        get,
        has,
        clear,
        unset,
    };
};
