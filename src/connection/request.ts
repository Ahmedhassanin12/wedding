import { invitationConfig } from '../config/invitationConfig';
import type { ApiResponse } from '../types';

export const HTTP_GET = 'GET';
export const HTTP_PUT = 'PUT';
export const HTTP_POST = 'POST';
export const HTTP_PATCH = 'PATCH';
export const HTTP_DELETE = 'DELETE';

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_PARTIAL_CONTENT = 206;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const ERROR_ABORT = 'AbortError';
export const ERROR_TYPE = 'TypeError';

export const defaultJSON: Readonly<Record<string, string>> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

class MemoryCache {
    private store = new Map<string, Response>();

    async match(key: RequestInfo | URL): Promise<Response | undefined> {
        const k = typeof key === 'string' ? key : key.toString();
        const found = this.store.get(k);
        return found ? found.clone() : undefined;
    }

    async put(key: RequestInfo | URL, response: Response): Promise<void> {
        const k = typeof key === 'string' ? key : key.toString();
        this.store.set(k, response.clone());
    }

    async delete(key: RequestInfo | URL): Promise<boolean> {
        const k = typeof key === 'string' ? key : key.toString();
        return this.store.delete(k);
    }
}

export type CacheLike = Pick<Cache, 'match' | 'put' | 'delete'>;

const openCacheStorage = async (name: string): Promise<CacheLike> => {
    if (typeof window !== 'undefined' && 'caches' in window && window.caches) {
        return window.caches.open(name);
    }
    return new MemoryCache();
};

const deleteCacheStorage = async (name: string): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'caches' in window && window.caches) {
        return window.caches.delete(name);
    }
    return true;
};

export const pool = (() => {
    let cachePool: Map<string, CacheLike> | null = null;

    return {
        getInstance: (name: string): CacheLike => {
            if (!cachePool || !cachePool.has(name)) {
                throw new Error(`please init cache first: ${name}`);
            }

            return cachePool.get(name)!;
        },
        restart: async (name: string): Promise<void> => {
            if (!cachePool) {
                cachePool = new Map();
            }
            cachePool.delete(name);
            await deleteCacheStorage(name);
            const c = await openCacheStorage(name);
            cachePool.set(name, c);
        },
        init: (callback: () => void, lists: ReadonlyArray<string> = []): void => {
            if (typeof window !== 'undefined' && window.isSecureContext === false) {
                throw new Error('this application required secure context');
            }

            const { requestCacheName } = invitationConfig.get().network;
            cachePool = new Map();
            Promise.all(
                lists.concat([requestCacheName]).map((v) => openCacheStorage(v).then((c) => cachePool!.set(v, c))),
            ).then(() => callback());
        },
    };
})();

export const cacheWrapper = (cacheName: string) => {
    const cacheObject = pool.getInstance(cacheName);

    const set = (input: string | URL, res: Response, forceCache: boolean, ttl: number): Promise<Response> =>
        res
            .clone()
            .arrayBuffer()
            .then((ab) => {
                if (!res.ok) {
                    return res;
                }

                let effectiveTtl = ttl;
                const now = new Date();
                const headers = new Headers(res.headers);

                if (!headers.has('Date')) {
                    headers.set('Date', now.toUTCString());
                }

                if (forceCache || !headers.has('Cache-Control')) {
                    if (!forceCache && headers.has('Expires')) {
                        const expTime = new Date(headers.get('Expires')!);
                        effectiveTtl = Math.max(0, expTime.getTime() - now.getTime());
                    }

                    if (effectiveTtl === 0) {
                        throw new Error('Cache max age cannot be 0');
                    }

                    headers.set('Cache-Control', `public, max-age=${Math.floor(effectiveTtl / 1000)}`);
                }

                if (!headers.has('Content-Length')) {
                    headers.set('Content-Length', String(ab.byteLength));
                }

                return cacheObject.put(input, new Response(ab, { headers })).then(() => res);
            });

    const has = (input: string | URL): Promise<Response | null> =>
        cacheObject.match(input).then((res) => {
            if (!res) {
                return null;
            }

            const cacheControl = res.headers.get('Cache-Control') ?? '';
            const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
            if (!maxAgeMatch) {
                return null;
            }

            const maxAge = maxAgeMatch[1];
            const dateHeader = res.headers.get('Date') ?? '';
            const expTime = Date.parse(dateHeader) + parseInt(maxAge, 10) * 1000;

            return Date.now() > expTime ? null : res;
        });

    const del = (input: string | URL): Promise<boolean> => cacheObject.delete(input);

    return {
        set,
        has,
        del,
    };
};

export type ProgressCallback = (
    receivedLength: number,
    contentLength: number,
    chunks: Uint8Array[],
) => void | Promise<void>;

export const request = (method: string, path: string) => {
    const ac = new AbortController();
    const req: RequestInit & { headers: Headers; credential?: string } = {
        signal: ac.signal,
        credential: 'include',
        headers: new Headers(defaultJSON),
        method: String(method).toUpperCase(),
    };

    let reqTtl = 0;
    let reqRetry = 0;
    let reqDelay = 0;
    let reqAttempts = 0;
    let reqNoBody = false;
    let reqForceCache = false;
    let downExt: string | null = null;
    let downName: string | null = null;
    let callbackFunc: ProgressCallback | null = null;

    const baseFetch = (input: string | URL): Promise<Response> => {
        const abstractFetch = (): Promise<Response> => {
            const wrapperFetch = (): Promise<Response> =>
                window.fetch(input, req).then(async (res) => {
                    if (reqNoBody) {
                        ac.abort();
                        return new Response(null, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: new Headers(res.headers),
                        });
                    }

                    if (!res.ok || !callbackFunc) {
                        return res;
                    }

                    const contentLength = parseInt(res.headers.get('Content-Length') ?? '0', 10);
                    if (contentLength === 0 || !res.body) {
                        return res;
                    }

                    const chunks: Uint8Array[] = [];
                    let receivedLength = 0;
                    const reader = res.body.getReader();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break;
                        }

                        chunks.push(value);
                        receivedLength += value.length;

                        await callbackFunc(
                            receivedLength,
                            contentLength,
                            typeof window.structuredClone === 'function' ? window.structuredClone(chunks) : chunks,
                        );
                    }

                    const contentType = res.headers.get('Content-Type') ?? 'application/octet-stream';
                    return new Response(new Blob(chunks as BlobPart[], { type: contentType }), {
                        status: res.status,
                        statusText: res.statusText,
                        headers: new Headers(res.headers),
                    });
                });

            if (reqTtl === 0 || reqNoBody) {
                return wrapperFetch();
            }

            if (req.method !== HTTP_GET) {
                console.warn('Only method GET can be cached');
                return wrapperFetch();
            }

            const cw = cacheWrapper(invitationConfig.get().network.requestCacheName);

            return cw.has(input).then((res) => {
                if (res) {
                    return Promise.resolve(res);
                }

                return cw
                    .del(input)
                    .then(wrapperFetch)
                    .then((r) => cw.set(input, r, reqForceCache, reqTtl));
            });
        };

        if (reqRetry === 0 || reqDelay === 0) {
            return abstractFetch();
        }

        const attempt = async (): Promise<Response> => {
            try {
                return await abstractFetch();
            } catch (error: unknown) {
                if (error instanceof Error && error.name === ERROR_ABORT) {
                    throw error;
                }

                reqDelay *= 2;
                reqAttempts++;

                if (reqAttempts > reqRetry) {
                    throw new Error(`Max retries reached: ${String(error)}`);
                }

                console.warn(`Retrying fetch (${reqAttempts}/${reqRetry}): ${input.toString()}`);
                await new Promise((resolve) => window.setTimeout(resolve, reqDelay));

                return attempt();
            }
        };

        return attempt();
    };

    const baseDownload = (res: Response): Promise<Response> => {
        if (res.status !== HTTP_STATUS_OK) {
            return Promise.resolve(res);
        }

        const exist = document.querySelector('a[download]');
        if (exist) {
            document.body.removeChild(exist);
        }

        const filename = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1];

        return res
            .clone()
            .blob()
            .then((b) => {
                const link = document.createElement('a');
                const href = window.URL.createObjectURL(b);

                link.href = href;
                link.download = filename
                    ? filename
                    : `${downName}.${downExt ? downExt : (b.type.split('/')?.[1] ?? 'bin')}`;

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(href);

                return res;
            });
    };

    const builder = {
        send<T = unknown>(transform: ((data: unknown) => T) | null = null): Promise<ApiResponse<T>> {
            if (downName) {
                Object.keys(defaultJSON).forEach((k) => req.headers.delete(k));
            }

            const baseUrl = document.body.getAttribute('data-url') || window.location.origin;

            return baseFetch(new URL(path, baseUrl))
                .then((res): Promise<ApiResponse<T>> => {
                    if (downName && res.ok) {
                        return baseDownload(res).then((r) => ({
                            code: r.status,
                            data: r as unknown as T,
                            error: null,
                        }));
                    }

                    return res.json().then((json: ApiResponse<T>) => {
                        if (json.error) {
                            const msg = json.error.at(0);
                            const isErrServer = res.status >= HTTP_STATUS_INTERNAL_SERVER_ERROR;

                            throw new Error(isErrServer ? `ID: ${json.id}\n🟥 ${msg}` : `🟨 ${msg}`);
                        }

                        if (transform) {
                            json.data = transform(json.data);
                        }

                        return Object.assign(json, { code: res.status });
                    });
                })
                .catch((err: unknown) => {
                    if (err instanceof Error && err.name === ERROR_ABORT) {
                        console.warn('Fetch aborted:', err);
                        return err as unknown as ApiResponse<T>;
                    }

                    let finalErr = err;
                    if (err instanceof Error && err.name === ERROR_TYPE) {
                        finalErr = new Error('🟥 Network error or rate limit exceeded');
                    }

                    window.alert(finalErr instanceof Error ? finalErr.message : String(finalErr));
                    throw finalErr;
                });
        },
        withCache(ttl = invitationConfig.get().network.defaultCacheTtlMs) {
            reqTtl = ttl;
            return builder;
        },
        withForceCache(ttl = invitationConfig.get().network.defaultCacheTtlMs) {
            reqForceCache = true;
            if (reqTtl === 0) {
                reqTtl = ttl;
            }
            return builder;
        },
        withNoBody() {
            reqNoBody = true;
            return builder;
        },
        withRetry(
            maxRetries = invitationConfig.get().network.defaultRetryCount,
            delay = invitationConfig.get().network.defaultRetryDelayMs,
        ) {
            reqRetry = maxRetries;
            reqDelay = delay;
            return builder;
        },
        withCancel(cancel: Promise<unknown> | null | undefined) {
            if (cancel === null || cancel === undefined) {
                return builder;
            }

            (async () => {
                await cancel;
                ac.abort();
            })();

            return builder;
        },
        withDownload(name: string, ext: string | null = null) {
            downName = name;
            downExt = ext;
            return builder;
        },
        withProgressFunc(func: ProgressCallback | null = null) {
            callbackFunc = func;
            return builder;
        },
        default(header: HeadersInit | null = null): Promise<Response> {
            req.headers = new Headers(header ?? {});
            return baseFetch(path).then((res) => (downName ? baseDownload(res) : Promise.resolve(res)));
        },
        token(token: string | null) {
            const safeToken = token ?? '';
            if (safeToken.split('.').length === 3) {
                req.headers.append('Authorization', 'Bearer ' + safeToken);
                return builder;
            }

            req.headers.append('x-access-key', safeToken);
            return builder;
        },
        body(bodyData: unknown) {
            if (req.method === HTTP_GET) {
                throw new Error('GET method does not support body');
            }

            req.body = JSON.stringify(bodyData);
            return builder;
        },
    };

    return builder;
};
