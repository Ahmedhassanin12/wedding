import { createStore, useStore } from '../state/store';

export interface DesktopSlideConfig {
    readonly id: string;
    readonly src: string;
    readonly alt: string;
}

export interface CoupleConfig {
    readonly coupleNames: string;
    readonly groomName: string;
    readonly brideName: string;
    readonly heroPhotoSrc: string;
    readonly groomPhotoSrc: string;
    readonly bridePhotoSrc: string;
}

export interface EventConfig {
    readonly weddingDateDisplay: string;
    readonly weddingDateTimeDisplay: string;
    readonly ceremonyTimeDisplay: string;
    readonly countdownTargetTime: string;
    readonly calendarTitle: string;
    readonly calendarStartTime: string;
    readonly calendarEndTime: string;
    readonly calendarTimeZone: string;
    readonly calendarDescription: string;
    readonly locationAddress: string;
    readonly googleMapsUrl: string;
}

export interface MediaConfig {
    readonly audioSrc: string;
    readonly videoSrc: string;
    readonly placeholderImageSrc: string;
    readonly appIconSrc: string;
    readonly desktopSlides: ReadonlyArray<DesktopSlideConfig>;
}

export interface ThemePaletteConfig {
    readonly swapMap: Readonly<Record<string, string>>;
    readonly lightColors: ReadonlyArray<string>;
    readonly darkColors: ReadonlyArray<string>;
}

export interface PresentationConfig {
    readonly guestSalutation: string;
    readonly enableConfetti: boolean;
    readonly enableAos: boolean;
    readonly enableAdditionalFonts: boolean;
    readonly slideshowIntervalMs: number;
    readonly offlineRestoreBannerDurationMs: number;
    readonly confettiOpenDelayMs: number;
    readonly confettiOpenDurationSec: number;
    readonly confettiZIndex: number;
    readonly confettiOpenColors: ReadonlyArray<string>;
    readonly confettiTapColors: ReadonlyArray<string>;
    readonly themePalette: ThemePaletteConfig;
    readonly footerAttribution: string;
}

export interface FontAssetConfig {
    readonly css: string;
    readonly family: string;
}

export interface CdnAssetsConfig {
    readonly aosCssUrl: string;
    readonly aosJsUrl: string;
    readonly confettiJsUrl: string;
    readonly fonts: ReadonlyArray<FontAssetConfig>;
}

export interface NetworkAndCacheConfig {
    readonly defaultCacheTtlMs: number;
    readonly defaultRetryCount: number;
    readonly defaultRetryDelayMs: number;
    readonly requestCacheName: string;
    readonly cacheBuckets: ReadonlyArray<string>;
    readonly cdnAssets: CdnAssetsConfig;
}

export interface InvitationConfig {
    readonly couple: CoupleConfig;
    readonly event: EventConfig;
    readonly media: MediaConfig;
    readonly presentation: PresentationConfig;
    readonly network: NetworkAndCacheConfig;
}

export type DeepPartial<T> = {
    -readonly [P in keyof T]?: T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<U>
        : T[P] extends Readonly<Record<string, string>>
          ? Readonly<Record<string, string>>
          : T[P] extends object
            ? DeepPartial<T[P]>
            : T[P];
};

export interface ConfigValidationResult {
    readonly valid: boolean;
    readonly errors: string[];
}

export const DEFAULT_INVITATION_CONFIG: InvitationConfig = {
    couple: {
        coupleNames: 'Ahmed & Nermin',
        groomName: 'Ahmed',
        brideName: 'Nermin',
        heroPhotoSrc: './assets/images/3.jpeg',
        groomPhotoSrc: './assets/images/2.jpeg',
        bridePhotoSrc: './assets/images/1.jpeg',
    },
    event: {
        weddingDateDisplay: 'Thursday, 8 October 2026',
        weddingDateTimeDisplay: 'Thursday, 8 October 2026 · 9:00 PM',
        ceremonyTimeDisplay: '9:00 PM - Until finished',
        countdownTargetTime: '2026-10-08 21:00:00',
        calendarTitle: 'The Wedding of Ahmed & Nermin',
        calendarStartTime: '2026-10-08 21:00',
        calendarEndTime: '2026-10-08 23:59',
        calendarTimeZone: 'Africa/Cairo',
        calendarDescription:
            'With all due respect, we cordially invite you to attend our wedding celebration. Thank you for your attention and your blessings, which are a great joy and honor to us.',
        locationAddress: 'Rotana High Class Village, Zifta-Tanta Road .',
        googleMapsUrl: 'https://maps.app.goo.gl/z9SuGTQF8qQdhhKm7?g_st=aw',
    },
    media: {
        audioSrc: './assets/music/pure-love-304010.mp3',
        videoSrc: './assets/video/265501_tiny.mp4',
        placeholderImageSrc: './assets/images/placeholder.webp',
        appIconSrc: './assets/images/icon-192x192.png',
        desktopSlides: [
            { id: 'slide-7', src: 'https://picsum.photos/1000/1000?random=7', alt: 'bg' },
            { id: 'slide-8', src: 'https://picsum.photos/1000/1000?random=8', alt: 'bg' },
            { id: 'slide-9', src: 'https://picsum.photos/1000/1000?random=9', alt: 'bg' },
        ],
    },
    presentation: {
        guestSalutation: 'Dear Mr./Mrs./Ms.',
        enableConfetti: true,
        enableAos: true,
        enableAdditionalFonts: true,
        slideshowIntervalMs: 6000,
        offlineRestoreBannerDurationMs: 3000,
        confettiOpenDelayMs: 1500,
        confettiOpenDurationSec: 15,
        confettiZIndex: 1057,
        confettiOpenColors: ['#FFC0CB', '#FF1493', '#C71585'],
        confettiTapColors: ['#FF69B4', '#FF1493'],
        themePalette: {
            swapMap: {
                '#000000': '#ffffff',
                '#ffffff': '#000000',
                '#212529': '#f8f9fa',
                '#f8f9fa': '#212529',
            },
            lightColors: ['#ffffff', '#f8f9fa'],
            darkColors: ['#000000', '#212529'],
        },
        footerAttribution: 'dewanakl',
    },
    network: {
        defaultCacheTtlMs: 1000 * 60 * 60 * 6,
        defaultRetryCount: 3,
        defaultRetryDelayMs: 1000,
        requestCacheName: 'request',
        cacheBuckets: ['image', 'video', 'audio', 'libs'],
        cdnAssets: {
            aosCssUrl: 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css',
            aosJsUrl: 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js',
            confettiJsUrl: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.js',
            fonts: [
                { css: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap', family: 'Sacramento' },
                {
                    css: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap',
                    family: 'Noto Naskh Arabic',
                },
            ],
        },
    },
};

export const validateInvitationConfig = (config: InvitationConfig): ConfigValidationResult => {
    const errors: string[] = [];

    if (!config.couple.coupleNames.trim()) {
        errors.push('couple.coupleNames must not be empty');
    }
    if (!config.couple.groomName.trim()) {
        errors.push('couple.groomName must not be empty');
    }
    if (!config.couple.brideName.trim()) {
        errors.push('couple.brideName must not be empty');
    }

    const parsedCountdown = Date.parse(config.event.countdownTargetTime.replace(' ', 'T'));
    if (Number.isNaN(parsedCountdown)) {
        errors.push(`event.countdownTargetTime is not a valid date: "${config.event.countdownTargetTime}"`);
    }

    if (config.presentation.slideshowIntervalMs <= 0) {
        errors.push('presentation.slideshowIntervalMs must be greater than 0');
    }
    if (config.network.defaultCacheTtlMs <= 0) {
        errors.push('network.defaultCacheTtlMs must be greater than 0');
    }
    if (config.network.defaultRetryCount < 0) {
        errors.push('network.defaultRetryCount cannot be negative');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

const mergeInvitationConfig = (
    base: InvitationConfig,
    overrides: DeepPartial<InvitationConfig>,
): InvitationConfig => ({
    couple: {
        ...base.couple,
        ...(overrides.couple ?? {}),
    },
    event: {
        ...base.event,
        ...(overrides.event ?? {}),
    },
    media: {
        ...base.media,
        ...(overrides.media ?? {}),
        desktopSlides: overrides.media?.desktopSlides ?? base.media.desktopSlides,
    },
    presentation: {
        ...base.presentation,
        ...(overrides.presentation ?? {}),
        themePalette: {
            ...base.presentation.themePalette,
            ...(overrides.presentation?.themePalette ?? {}),
        },
    },
    network: {
        ...base.network,
        ...(overrides.network ?? {}),
        cdnAssets: {
            ...base.network.cdnAssets,
            ...(overrides.network?.cdnAssets ?? {}),
        },
    },
});

/**
 * Reads optional HTML `data-*` overrides from `document.body` (`data-audio`, `data-confetti`, `data-time`).
 */
export const readDomConfigOverrides = (): DeepPartial<InvitationConfig> => {
    if (typeof document === 'undefined' || !document.body) {
        return {};
    }

    const dataAudio = document.body.getAttribute('data-audio');
    const dataConfetti = document.body.getAttribute('data-confetti');
    const dataTime = document.body.getAttribute('data-time');

    const overrides: DeepPartial<InvitationConfig> = {};

    if (dataAudio !== null) {
        overrides.media = { audioSrc: dataAudio };
    }
    if (dataConfetti !== null) {
        overrides.presentation = { enableConfetti: dataConfetti === 'true' };
    }
    if (dataTime !== null && dataTime.trim().length > 0) {
        overrides.event = { countdownTargetTime: dataTime.trim() };
    }

    return overrides;
};

const configStore = createStore<InvitationConfig>(DEFAULT_INVITATION_CONFIG);

export const invitationConfig = {
    get: (): InvitationConfig => configStore.getSnapshot(),
    subscribe: configStore.subscribe,
    getSnapshot: configStore.getSnapshot,
    /**
     * Applies partial runtime configuration overrides after validating the merged configuration.
     */
    update: (overrides: DeepPartial<InvitationConfig>): InvitationConfig => {
        const merged = mergeInvitationConfig(configStore.getSnapshot(), overrides);
        const validation = validateInvitationConfig(merged);
        if (!validation.valid) {
            throw new Error(`Invalid InvitationConfig: ${validation.errors.join('; ')}`);
        }
        configStore.setState(merged);
        return merged;
    },
    /**
     * Synchronizes configuration with `document.body` data attributes (`data-audio`, `data-confetti`, `data-time`).
     */
    syncFromDom: (): InvitationConfig => {
        const domOverrides = readDomConfigOverrides();
        return invitationConfig.update(domOverrides);
    },
    reset: (): void => {
        configStore.reset();
    },
};

export const useInvitationConfig = (): InvitationConfig => useStore(configStore);
