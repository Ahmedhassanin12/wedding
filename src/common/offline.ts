import { util } from './util';

export interface OfflineSnapshot {
    isOnline: boolean;
    bannerState: 'hidden' | 'offline' | 'online-restored';
}

export const offline = (() => {
    let online = true;
    let bannerState: 'hidden' | 'offline' | 'online-restored' = 'hidden';
    let restoreTimerCancel: (() => void) | null = null;
    let initialized = false;
    const listeners = new Set<() => void>();

    let currentSnapshot: OfflineSnapshot = {
        isOnline: true,
        bannerState: 'hidden',
    };

    const emitChange = (): void => {
        currentSnapshot = {
            isOnline: online,
            bannerState,
        };
        listeners.forEach((listener) => listener());
    };

    const isOnline = (): boolean => online;

    const getSnapshot = (): OfflineSnapshot => currentSnapshot;

    const subscribe = (listener: () => void): (() => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const onOffline = (): void => {
        if (restoreTimerCancel) {
            restoreTimerCancel();
            restoreTimerCancel = null;
        }
        online = false;
        bannerState = 'offline';
        emitChange();
    };

    const onOnline = (): void => {
        if (restoreTimerCancel) {
            restoreTimerCancel();
            restoreTimerCancel = null;
        }
        online = true;
        bannerState = 'online-restored';
        emitChange();

        restoreTimerCancel = util.timeOut(() => {
            if (online) {
                bannerState = 'hidden';
                emitChange();
            }
        }, 3000);
    };

    const init = (): (() => void) => {
        if (!initialized) {
            online = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
            bannerState = online ? 'hidden' : 'offline';
            currentSnapshot = { isOnline: online, bannerState };
            window.addEventListener('online', onOnline);
            window.addEventListener('offline', onOffline);
            initialized = true;
        }

        return () => {
            if (initialized) {
                window.removeEventListener('online', onOnline);
                window.removeEventListener('offline', onOffline);
                if (restoreTimerCancel) {
                    restoreTimerCancel();
                    restoreTimerCancel = null;
                }
                initialized = false;
            }
        };
    };

    return {
        init,
        isOnline,
        subscribe,
        getSnapshot,
    };
})();
