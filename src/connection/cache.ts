import { request, cacheWrapper, HTTP_GET } from './request';
import type { CacheRunItem } from '../types';

export const cache = (cacheName: string) => {
    const objectUrls = new Map<string, string>();
    const inFlightRequests = new Map<string, Promise<string>>();
    const cw = cacheWrapper(cacheName);

    let ttl = 1000 * 60 * 60 * 6;
    let forceCache = false;

    const set = (input: string | URL, res: Response): Promise<Response> => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return cw.set(input, res, forceCache, ttl);
    };

    const has = (input: string | URL): Promise<Response | null> => cw.has(input);

    const del = (input: string | URL): Promise<boolean> => cw.del(input);

    const get = (input: string, cancel: Promise<unknown> | null = null): Promise<string> => {
        if (objectUrls.has(input)) {
            return Promise.resolve(objectUrls.get(input)!);
        }

        if (inFlightRequests.has(input)) {
            return inFlightRequests.get(input)!;
        }

        const fetchPut = (): Promise<Response> => request(HTTP_GET, input).withCancel(cancel).withRetry().default();

        const inflightPromise = has(input)
            .then((res) => (res ? Promise.resolve(res) : del(input).then(fetchPut).then((r) => set(input, r))))
            .then((r) => r.blob())
            .then((b) => objectUrls.set(input, URL.createObjectURL(b)))
            .then(() => objectUrls.get(input)!)
            .finally(() => inFlightRequests.delete(input));

        inFlightRequests.set(input, inflightPromise);
        return inflightPromise;
    };

    const run = (items: Array<CacheRunItem | null>, cancel: Promise<unknown> | null = null): Promise<unknown> => {
        const uniq = new Map<string, Array<[(blobUrl: string) => void | Promise<void>, ((err: unknown) => void) | undefined]>>();

        if (items.length === 0) {
            return Promise.resolve();
        }

        items
            .filter((val): val is CacheRunItem => val !== null)
            .forEach((val) => {
                const exist = uniq.get(val.url) ?? [];
                uniq.set(val.url, [...exist, [val.res, val.rej]]);
            });

        return Promise.allSettled(
            Array.from(uniq).map(([k, v]) =>
                get(k, cancel)
                    .then((s) => {
                        v.forEach((cb) => cb[0]?.(s));
                        return s;
                    })
                    .catch((r: unknown) => {
                        v.forEach((cb) => cb[1]?.(r));
                        return r;
                    }),
            ),
        );
    };

    const download = async (input: string, name: string): Promise<Response> => {
        const reverse = new Map<string, string>(
            Array.from(objectUrls.entries()).map(([k, v]) => [v, k]),
        );

        let targetUrl = input;
        if (!reverse.has(targetUrl)) {
            try {
                const checkUrl = new URL(targetUrl);
                if (!checkUrl.protocol.includes('blob')) {
                    throw new Error('Is not blob');
                }
            } catch {
                targetUrl = await get(targetUrl);
            }
        }

        return request(HTTP_GET, targetUrl).withDownload(name).default();
    };

    const instance = {
        run,
        del,
        has,
        set,
        get,
        download,
        setTtl(v: number) {
            ttl = Number(v);
            return instance;
        },
        withForceCache() {
            forceCache = true;
            return instance;
        },
    };

    return instance;
};

export type CacheInstance = ReturnType<typeof cache>;
