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
    let total = 0;
    let loaded = 0;
    let valid = true;
    let isVisible = false;
    let isError = false;
    let isDone = false;
    let infoText = 'Booting application...';

    let cancelProgress: Promise<void> | null = null;
    let resolveCancel: (() => void) | null = null;
    const listeners = new Set<() => void>();
    const doneListeners = new Set<() => void>();

    let currentSnapshot: ProgressSnapshot = {
        total: 0,
        loaded: 0,
        percentage: 0,
        infoText: 'Booting application...',
        isVisible: false,
        isError: false,
        isDone: false,
    };

    const showInformation = (): string => {
        const pct = total > 0 ? Math.floor((loaded / total) * 100) : 0;
        return `(${loaded}/${total}) [${pct}%]`;
    };

    const emitChange = (): void => {
        const percentage = total > 0 ? Math.min((loaded / total) * 100, 100) : 0;
        currentSnapshot = {
            total,
            loaded,
            percentage,
            infoText,
            isVisible,
            isError,
            isDone,
        };
        listeners.forEach((listener) => listener());
    };

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const onDone = (listener: () => void): (() => void) => {
        doneListeners.add(listener);
        if (isDone) {
            listener();
        }
        return () => {
            doneListeners.delete(listener);
        };
    };

    const getSnapshot = (): ProgressSnapshot => currentSnapshot;

    const add = (): void => {
        total += 1;
        emitChange();
    };

    const complete = (type: string, skip = false): void => {
        if (!valid) {
            return;
        }

        loaded += 1;
        infoText = `Loading ${type} ${skip ? 'skipped' : 'complete'} ${showInformation()}`;

        if (loaded >= total) {
            valid = false;
            isDone = true;
            cancelProgress = null;
            resolveCancel = null;
            emitChange();
            doneListeners.forEach((fn) => fn());
            return;
        }

        emitChange();
    };

    const invalid = (type: string): void => {
        if (valid) {
            valid = false;
            isError = true;
            infoText = `Error loading ${type} ${showInformation()}`;
            if (resolveCancel) {
                resolveCancel();
                resolveCancel = null;
            }
            emitChange();
        }
    };

    const getAbort = (): Promise<void> | null => cancelProgress;

    const init = (): void => {
        total = 0;
        loaded = 0;
        valid = true;
        isVisible = true;
        isError = false;
        isDone = false;
        infoText = 'Booting application...';
        cancelProgress = new Promise<void>((res) => {
            resolveCancel = res;
        });
        emitChange();
    };

    return {
        init,
        add,
        invalid,
        complete,
        getAbort,
        subscribe,
        onDone,
        getSnapshot,
    };
})();
