import type { StorageAdapter } from '../types';

export const storage = <T extends Record<string, unknown> = Record<string, unknown>>(
    table: string,
): StorageAdapter<T> => {
    const readTable = (): T => {
        const raw = localStorage.getItem(table);
        return (raw ? JSON.parse(raw) : {}) as T;
    };

    function get(): T;
    function get<K extends keyof T & string>(key: K): T[K] | undefined;
    function get<K extends keyof T & string>(key?: K): T | T[K] | undefined {
        const data = readTable();
        if (key !== undefined) {
            return data[key];
        }
        return data;
    }

    const set = <K extends keyof T & string>(key: K, value: T[K]): void => {
        const data = { ...readTable(), [key]: value };
        localStorage.setItem(table, JSON.stringify(data));
    };

    const has = (key: string): boolean => Object.prototype.hasOwnProperty.call(readTable(), key);

    const unset = (key: string): void => {
        if (!has(key)) {
            return;
        }

        const data = { ...readTable() } as Record<string, unknown>;
        delete data[key];
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
