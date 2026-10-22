export interface ApiResponse<T> {
    code: number;
    data: T;
    error: string[] | null;
    id?: string;
}

export interface CacheRunItem {
    url: string;
    res: (blobUrl: string) => void | Promise<void>;
    rej?: (err: unknown) => void;
}

export interface LoaderOptions {
    aos?: boolean;
    confetti?: boolean;
    additionalFont?: boolean;
}

export interface NotifyActions {
    success: () => void;
    error: () => void;
    warning: () => void;
    info: () => void;
    custom: (emoji: string) => void;
}

export interface StorageAdapter<T extends Record<string, unknown> = Record<string, unknown>> {
    get(): T;
    get<K extends keyof T & string>(key: K): T[K] | undefined;
    set: <K extends keyof T & string>(key: K, value: T[K]) => void;
    has: (key: string) => boolean;
    clear: () => void;
    unset: (key: string) => void;
}

export interface BootstrapModalInstance {
    show: () => void;
    hide: () => void;
}

export interface BootstrapTabInstance {
    show: () => void;
}

export interface BootstrapGlobal {
    Modal: {
        getOrCreateInstance: (element: HTMLElement | string) => BootstrapModalInstance;
    };
    Tab: {
        getOrCreateInstance: (element: HTMLElement | string) => BootstrapTabInstance;
    };
}

export interface AOSGlobal {
    init: (options?: Record<string, unknown>) => void;
}

export interface ConfettiShape {
    type?: string;
    [key: string]: unknown;
}

export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: ConfettiShape[];
    scalar?: number;
    zIndex?: number;
}

export interface ConfettiGlobal {
    (options?: ConfettiOptions): Promise<null> | null;
    shapeFromPath: (options: { path: string; matrix?: number[] }) => ConfettiShape;
}

declare global {
    interface Window {
        bootstrap: BootstrapGlobal;
        AOS?: AOSGlobal;
        confetti?: ConfettiGlobal;
        undangan?: Record<string, unknown>;
    }
}
