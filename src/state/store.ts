import { useSyncExternalStore } from 'react';

export interface ReadableStore<TState> {
    getSnapshot: () => TState;
    subscribe: (listener: () => void) => () => void;
}

export interface Store<TState> extends ReadableStore<TState> {
    setState: (updater: Partial<TState> | ((prev: TState) => TState)) => void;
    reset: () => void;
}

/**
 * Lightweight, strictly-typed reactive store compatible with React 19 `useSyncExternalStore`.
 * Eliminates ad-hoc listener Set boilerplate across application domains.
 */
export const createStore = <TState extends object>(initialState: TState): Store<TState> => {
    let state: TState = { ...initialState };
    const listeners = new Set<() => void>();

    const getSnapshot = (): TState => state;

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const setState = (updater: Partial<TState> | ((prev: TState) => TState)): void => {
        const nextState = typeof updater === 'function' ? updater(state) : { ...state, ...updater };

        const hasChanged = (Object.keys(nextState) as Array<keyof TState>).some(
            (key) => !Object.is(state[key], nextState[key]),
        );

        if (!hasChanged) {
            return;
        }

        state = nextState;
        listeners.forEach((listener) => listener());
    };

    const reset = (): void => {
        state = { ...initialState };
        listeners.forEach((listener) => listener());
    };

    return {
        getSnapshot,
        subscribe,
        setState,
        reset,
    };
};

export function useStore<TState>(store: ReadableStore<TState>): TState;
export function useStore<TState, TSelected>(
    store: ReadableStore<TState>,
    selector: (state: TState) => TSelected,
): TSelected;
export function useStore<TState, TSelected = TState>(
    store: ReadableStore<TState>,
    selector?: (state: TState) => TSelected,
): TState | TSelected {
    return useSyncExternalStore(store.subscribe, () => {
        const snap = store.getSnapshot();
        return selector ? selector(snap) : snap;
    });
}
