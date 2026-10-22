import type { NotifyActions } from '../types';

export const util = (() => {
    const listsMarkDown: ReadonlyArray<readonly [string, string]> = [
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

    const timeOut = (callback: () => void, delay = 0): (() => void) => {
        let clear: ReturnType<typeof setTimeout> | null = setTimeout(() => {
            callback();
            if (clear !== null) {
                clearTimeout(clear);
                clear = null;
            }
        }, delay);

        return (): void => {
            if (clear !== null) {
                clearTimeout(clear);
                clear = null;
            }
        };
    };

    const debounce = <T extends (...args: any[]) => void>(
        callback: T,
        delay = 100,
    ): ((...args: Parameters<T>) => void) => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        return (...args: Parameters<T>): void => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => callback(...args), delay);
        };
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
        ask,
        notify,
        timeOut,
        debounce,
        escapeHtml,
        base64Encode,
        base64Decode,
        parseUserAgent,
        getGMTOffset,
        convertMarkdownToHTML,
    };
})();
