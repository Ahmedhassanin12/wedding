import { createStore } from '../../state/store';

export interface ProgressSnapshot {
    total: number;
    loaded: number;
    percentage: number;
    infoText: string;
    isVisible: boolean;
    isError: boolean;
    isDone: boolean;
}

export const progress = (() => {
    const store = createStore<ProgressSnapshot>({
        total: 0,
        loaded: 0,
        percentage: 0,
        infoText: 'Booting application...',
        isVisible: false,
        isError: false,
        isDone: false,
    });

    let valid = true;
    let cancelProgress: Promise<void> | null = null;
    let resolveCancel: (() => void) | null = null;
    const doneListeners = new Set<() => void>();

    const formatProgressRatio = (loaded: number, total: number): string => {
        const pct = total > 0 ? Math.floor((loaded / total) * 100) : 0;
        return `(${loaded}/${total}) [${pct}%]`;
    };

    const onDone = (listener: () => void): (() => void) => {
        doneListeners.add(listener);
        if (store.getSnapshot().isDone) {
            listener();
        }
        return () => {
            doneListeners.delete(listener);
        };
    };

    const add = (): void => {
        store.setState((prev) => {
            const total = prev.total + 1;
            const percentage = total > 0 ? Math.min((prev.loaded / total) * 100, 100) : 0;
            return {
                ...prev,
                total,
                percentage,
            };
        });
    };

    const complete = (type: string, skip = false): void => {
        if (!valid) {
            return;
        }

        const prev = store.getSnapshot();
        const loaded = prev.loaded + 1;
        const total = prev.total;
        const percentage = total > 0 ? Math.min((loaded / total) * 100, 100) : 0;
        const infoText = `Loading ${type} ${skip ? 'skipped' : 'complete'} ${formatProgressRatio(loaded, total)}`;

        if (loaded >= total) {
            valid = false;
            cancelProgress = null;
            resolveCancel = null;
            store.setState({
                ...prev,
                loaded,
                percentage,
                infoText,
                isDone: true,
            });
            doneListeners.forEach((fn) => fn());
            return;
        }

        store.setState({
            ...prev,
            loaded,
            percentage,
            infoText,
        });
    };

    const invalid = (type: string): void => {
        if (valid) {
            valid = false;
            const prev = store.getSnapshot();
            const infoText = `Error loading ${type} ${formatProgressRatio(prev.loaded, prev.total)}`;
            if (resolveCancel) {
                resolveCancel();
                resolveCancel = null;
            }
            store.setState({
                ...prev,
                isError: true,
                infoText,
            });
        }
    };

    const getAbort = (): Promise<void> | null => cancelProgress;

    const init = (): void => {
        valid = true;
        cancelProgress = new Promise<void>((res) => {
            resolveCancel = res;
        });
        store.setState({
            total: 0,
            loaded: 0,
            percentage: 0,
            infoText: 'Booting application...',
            isVisible: true,
            isError: false,
            isDone: false,
        });
    };

    return {
        init,
        add,
        invalid,
        complete,
        getAbort,
        onDone,
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
    };
})();
