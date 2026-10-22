import { util } from './util';
import { createStore } from '../state/store';
import { invitationConfig } from '../config/invitationConfig';

export interface OfflineSnapshot {
    isOnline: boolean;
    bannerState: 'hidden' | 'offline' | 'online-restored';
}

export const offline = (() => {
    const store = createStore<OfflineSnapshot>({
        isOnline: true,
        bannerState: 'hidden',
    });

    let restoreTimerCancel: (() => void) | null = null;
    let initialized = false;

    const isOnline = (): boolean => store.getSnapshot().isOnline;

    const onOffline = (): void => {
        if (restoreTimerCancel) {
            restoreTimerCancel();
            restoreTimerCancel = null;
        }
        store.setState({
            isOnline: false,
            bannerState: 'offline',
        });
    };

    const onOnline = (): void => {
        if (restoreTimerCancel) {
            restoreTimerCancel();
            restoreTimerCancel = null;
        }
        store.setState({
            isOnline: true,
            bannerState: 'online-restored',
        });

        const durationMs = invitationConfig.get().presentation.offlineRestoreBannerDurationMs;
        restoreTimerCancel = util.timeOut(() => {
            if (store.getSnapshot().isOnline) {
                store.setState({ bannerState: 'hidden' });
            }
        }, durationMs);
    };

    const init = (): (() => void) => {
        if (!initialized) {
            const online = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
            store.setState({
                isOnline: online,
                bannerState: online ? 'hidden' : 'offline',
            });
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
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
    };
})();
