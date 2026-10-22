import { util } from './util';

export const offline = (() => {
    let alertEl: HTMLElement | null = null;
    let online = true;

    const classes = [
        'input[data-offline-disabled]',
        'button[data-offline-disabled]',
        'select[data-offline-disabled]',
        'textarea[data-offline-disabled]',
    ];

    const isOnline = (): boolean => online;

    const setOffline = (): void => {
        const el = alertEl?.firstElementChild?.firstElementChild;
        if (!el) {
            return;
        }
        el.classList.remove('bg-success');
        el.classList.add('bg-danger');
        if (el.firstElementChild) {
            el.firstElementChild.innerHTML = '<i class="fa-solid fa-ban me-2"></i>Koneksi tidak tersedia';
        }
    };

    const setOnline = (): void => {
        const el = alertEl?.firstElementChild?.firstElementChild;
        if (!el) {
            return;
        }
        el.classList.remove('bg-danger');
        el.classList.add('bg-success');
        if (el.firstElementChild) {
            el.firstElementChild.innerHTML = '<i class="fa-solid fa-cloud me-2"></i>Koneksi tersedia kembali';
        }
    };

    const setDefaultState = async (): Promise<void> => {
        if (!online || !alertEl) {
            return;
        }

        await util.changeOpacity(alertEl, false);
        setOffline();
    };

    const changeState = (): void => {
        document.querySelectorAll<HTMLElement>(classes.join(', ')).forEach((e) => {
            e.dispatchEvent(new Event(isOnline() ? 'online' : 'offline'));
            e.setAttribute('data-offline-disabled', isOnline() ? 'false' : 'true');

            if (e.tagName === 'BUTTON') {
                if (isOnline()) {
                    e.classList.remove('disabled');
                } else {
                    e.classList.add('disabled');
                }
            } else if (isOnline()) {
                e.removeAttribute('disabled');
            } else {
                e.setAttribute('disabled', 'true');
            }
        });
    };

    const onOffline = (): void => {
        online = false;

        setOffline();
        if (alertEl) {
            util.changeOpacity(alertEl, true);
        }
        changeState();
    };

    const onOnline = (): void => {
        online = true;

        setOnline();
        util.timeOut(setDefaultState, 3000);
        changeState();
    };

    const init = (): void => {
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);

        if (alertEl && document.body.contains(alertEl)) {
            return;
        }

        alertEl = document.createElement('div');
        alertEl.classList.add('fixed-top', 'pe-none');
        alertEl.style.cssText = 'opacity: 0; z-index: 1057;';
        alertEl.innerHTML = `
        <div class="d-flex justify-content-center mx-auto">
            <div class="d-flex justify-content-center align-items-center rounded-pill my-2 bg-danger shadow">
                <small class="text-center py-1 px-2 mx-1 mt-1 mb-0 text-white" style="font-size: 0.8rem;"></small>
            </div>
        </div>`;

        document.body.insertBefore(alertEl, document.body.lastChild);
    };

    return {
        init,
        isOnline,
    };
})();
