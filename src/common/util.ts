import type { DisableRestoreHandle, NotifyActions } from '../types';

export const util = (() => {
    const loader = '<span class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem;"></span>';

    const listsMarkDown: ReadonlyArray< readonly [string, string]> = [
        ['*', '<strong class="text-theme-auto">$1</strong>'],
        ['_', '<em class="text-theme-auto">$1</em>'],
        ['~', '<del class="text-theme-auto">$1</del>'],
        ['```', '<code class="font-monospace text-theme-auto">$1</code>'],
    ];

    const deviceTypes: ReadonlyArray<{ type: string; regex: RegExp }> = [
        { type: 'Mobile', regex: /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i },
        { type: 'Tablet', regex: /iPad|Android(?!.*Mobile)|Tablet/i },
        { type: 'Desktop', regex: /Windows NT|Macintosh|Linux/i },
    ];

    const browsers: ReadonlyArray<{ name: string; regex: RegExp }> = [
        { name: 'Chrome', regex: /Chrome|CriOS/i },
        { name: 'Safari', regex: /Safari/i },
        { name: 'Edge', regex: /Edg|Edge/i },
        { name: 'Firefox', regex: /Firefox|FxiOS/i },
        { name: 'Opera', regex: /Opera|OPR/i },
        { name: 'Internet Explorer', regex: /MSIE|Trident/i },
        { name: 'Samsung Browser', regex: /SamsungBrowser/i },
    ];

    const operatingSystems: ReadonlyArray<{ name: string; regex: RegExp }> = [
        { name: 'Windows', regex: /Windows NT ([\d.]+)/i },
        { name: 'MacOS', regex: /Mac OS X ([\d_.]+)/i },
        { name: 'Android', regex: /Android ([\d.]+)/i },
        { name: 'iOS', regex: /OS ([\d_]+) like Mac OS X/i },
        { name: 'Linux', regex: /Linux/i },
        { name: 'Ubuntu', regex: /Ubuntu/i },
        { name: 'Chrome OS', regex: /CrOS/i },
    ];

    const escapeHtml = (unsafe: unknown): string => {
        return String(unsafe ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const notify = (message: unknown): NotifyActions => {
        const exec = (emoji: string): void => {
            window.alert(`${emoji} ${String(message)}`);
        };

        return {
            success: () => exec('🟩'),
            error: () => exec('🟥'),
            warning: () => exec('🟨'),
            info: () => exec('🟦'),
            custom: (emoji: string) => exec(emoji),
        };
    };

    const ask = (message: string): boolean => window.confirm(`🟦 ${message}`);

    const safeInnerHTML = <T extends HTMLElement>(el: T, html: string): T => {
        el.replaceChildren(document.createRange().createContextualFragment(html));
        return el;
    };

    const changeOpacity = (el: HTMLElement, isUp: boolean, step = 0.05): Promise<HTMLElement> =>
        new Promise((res) => {
            let op = parseFloat(el.style.opacity || (isUp ? '0' : '1'));
            if (Number.isNaN(op)) {
                op = isUp ? 0 : 1;
            }
            const target = isUp ? 1 : 0;

            const animate = (): void => {
                op += isUp ? step : -step;
                op = Math.max(0, Math.min(1, op));
                el.style.opacity = op.toFixed(2);

                if ((isUp && op >= target) || (!isUp && op <= target)) {
                    el.style.opacity = target.toString();
                    res(el);
                } else {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });

    const timeOut = (callback: () => void, delay = 0): void => {
        let clear: ReturnType<typeof setTimeout> | null = null;
        const c = (): void => {
            callback();
            if (clear !== null) {
                clearTimeout(clear);
                clear = null;
            }
        };

        clear = setTimeout(c, delay);
    };

    const debounce = <T extends (...args: any[]) => void>(callback: T, delay = 100): ((...args: Parameters<T>) => void) => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        return (...args: Parameters<T>): void => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => callback(...args), delay);
        };
    };

    const disableButton = (
        button: HTMLButtonElement | HTMLElement,
        message = 'Loading',
        replace = false,
    ): DisableRestoreHandle => {
        if ('disabled' in button) {
            button.disabled = true;
        }

        const tmp = button.innerHTML;
        safeInnerHTML(button, replace ? message : loader + message);

        return {
            restore: (disabled = false): void => {
                button.innerHTML = tmp;
                if ('disabled' in button) {
                    button.disabled = disabled;
                }
            },
        };
    };

    const disableCheckbox = (checkbox: HTMLInputElement | HTMLElement): DisableRestoreHandle => {
        if ('disabled' in checkbox) {
            checkbox.disabled = true;
        }

        const label = document.querySelector<HTMLElement>(`label[for="${checkbox.id}"]`);
        const tmp = label ? label.innerHTML : '';
        if (label) {
            safeInnerHTML(label, loader + tmp);
        }

        return {
            restore: (): void => {
                if (label) {
                    label.innerHTML = tmp;
                }
                if ('disabled' in checkbox) {
                    checkbox.disabled = false;
                }
            },
        };
    };

    const copy = async (
        button: HTMLButtonElement | HTMLElement,
        message: string | null = null,
        timeout = 1500,
    ): Promise<void> => {
        const data = button.getAttribute('data-copy');

        if (!data || data.length === 0) {
            notify('Nothing to copy').warning();
            return;
        }

        if ('disabled' in button) {
            button.disabled = true;
        }

        try {
            await navigator.clipboard.writeText(data);
        } catch {
            if ('disabled' in button) {
                button.disabled = false;
            }
            notify('Failed to copy').error();
            return;
        }

        const tmp = button.innerHTML;
        safeInnerHTML(button, message ? message : '<i class="fa-solid fa-check"></i>');

        timeOut(() => {
            if ('disabled' in button) {
                button.disabled = false;
            }
            button.innerHTML = tmp;
        }, timeout);
    };

    const base64Encode = (str: string): string => {
        const encoder = new TextEncoder();
        const encodedBytes = encoder.encode(str);
        return window.btoa(String.fromCharCode(...encodedBytes));
    };

    const base64Decode = (str: string): string => {
        const decoder = new TextDecoder();
        const decodedBytes = Uint8Array.from(window.atob(str), (c) => c.charCodeAt(0));
        return decoder.decode(decodedBytes);
    };

    const parseUserAgent = (userAgent: string): string => {
        if (!userAgent || typeof userAgent !== 'string') {
            return 'Unknown';
        }

        const deviceType = deviceTypes.find((i) => i.regex.test(userAgent))?.type ?? 'Unknown';
        const browser = browsers.find((i) => i.regex.test(userAgent))?.name ?? 'Unknown';
        const osMatch = operatingSystems.find((i) => i.regex.test(userAgent));

        const osName = osMatch ? osMatch.name : 'Unknown';
        const osVersion = osMatch ? (userAgent.match(osMatch.regex)?.[1]?.replace(/_/g, '.') ?? null) : null;

        return `${browser} ${deviceType} ${osVersion ? `${osName} ${osVersion}` : osName}`;
    };

    const getGMTOffset = (tz: string): string => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hourCycle: 'h23',
            hour: 'numeric',
        });

        let offset = (parseInt(formatter.format(now), 10) - now.getUTCHours() + 24) % 24;
        if (offset > 12) {
            offset -= 24;
        }

        return `GMT${offset >= 0 ? '+' : ''}${offset}`;
    };

    const convertMarkdownToHTML = (str: string): string => {
        let result = str;
        listsMarkDown.forEach(([k, v]) => {
            result = result.replace(new RegExp(`\\${k}(\\S(?:[\\s\\S]*?\\S)?)\\${k}`, 'g'), v);
        });

        return result;
    };

    return {
        loader,
        ask,
        copy,
        notify,
        timeOut,
        debounce,
        escapeHtml,
        base64Encode,
        base64Decode,
        disableButton,
        disableCheckbox,
        safeInnerHTML,
        parseUserAgent,
        changeOpacity,
        getGMTOffset,
        convertMarkdownToHTML,
    };
})();
