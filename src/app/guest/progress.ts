export const progress = (() => {
    let info: HTMLElement | null = null;
    let bar: HTMLElement | null = null;

    let total = 0;
    let loaded = 0;
    let valid = true;
    let cancelProgress: Promise<void> | null = null;

    const add = (): void => {
        total += 1;
    };

    const showInformation = (): string => {
        const pct = total > 0 ? Math.floor((loaded / total) * 100) : 0;
        return `(${loaded}/${total}) [${pct}%]`;
    };

    const complete = (type: string, skip = false): void => {
        if (!valid) {
            return;
        }

        loaded += 1;
        if (info) {
            info.innerText = `Loading ${type} ${skip ? 'skipped' : 'complete'} ${showInformation()}`;
        }
        if (bar) {
            bar.style.width = Math.min((loaded / total) * 100, 100).toString() + '%';
        }

        if (loaded === total) {
            valid = false;
            cancelProgress = null;
            document.dispatchEvent(new Event('undangan.progress.done'));
        }
    };

    const invalid = (type: string): void => {
        if (valid) {
            valid = false;
            if (bar) {
                bar.style.backgroundColor = 'red';
            }
            if (info) {
                info.innerText = `Error loading ${type} ${showInformation()}`;
            }
            document.dispatchEvent(new Event('undangan.progress.invalid'));
        }
    };

    const getAbort = (): Promise<void> | null => cancelProgress;

    const init = (): void => {
        total = 0;
        loaded = 0;
        valid = true;
        info = document.getElementById('progress-info');
        bar = document.getElementById('progress-bar');
        info?.classList.remove('d-none');
        cancelProgress = new Promise((res) =>
            document.addEventListener('undangan.progress.invalid', () => res(), { once: true }),
        );
    };

    return {
        init,
        add,
        invalid,
        complete,
        getAbort,
    };
})();
