import { storage } from '../common/storage';
import {
    invitationConfig,
    isInvitationDesignId,
} from '../config/invitationConfig';
import { createStore, useStore } from '../state/store';
import { DEFAULT_DESIGN_TOKENS } from './tokens';
import type { DesignTokens, InvitationDesignId, TypographyPresetId } from './types';

export interface DesignCustomizationSnapshot {
    readonly activeDesignId: InvitationDesignId;
    readonly tokens: DesignTokens;
    readonly isStudioOpen: boolean;
    readonly hasCustomOverrides: boolean;
}

interface PersistedDesignPreferences {
    [key: string]: unknown;
    activeDesignId?: InvitationDesignId;
    overridesByDesign?: Partial<Record<InvitationDesignId, Partial<DesignTokens>>>;
}

const STORAGE_TABLE = 'design_customization';

const parseDesignFromUrl = (): InvitationDesignId | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    const params = new URLSearchParams(window.location.search);
    const param = params.get('design');
    return isInvitationDesignId(param) ? param : null;
};

export const designStore = (() => {
    const getPrefsStorage = () => storage<PersistedDesignPreferences>(STORAGE_TABLE);

    const resolveInitialDesignId = (): InvitationDesignId => {
        const urlDesign = parseDesignFromUrl();
        if (urlDesign) {
            return urlDesign;
        }
        const saved = getPrefsStorage().get('activeDesignId');
        if (isInvitationDesignId(saved)) {
            return saved;
        }
        return invitationConfig.get().design.defaultDesignId;
    };

    const resolveTokensForDesign = (designId: InvitationDesignId): {
        tokens: DesignTokens;
        hasCustomOverrides: boolean;
    } => {
        const baseTokens = DEFAULT_DESIGN_TOKENS[designId];
        const savedOverridesMap = getPrefsStorage().get('overridesByDesign') ?? {};
        const overrides = savedOverridesMap[designId];

        if (!overrides || Object.keys(overrides).length === 0) {
            return { tokens: baseTokens, hasCustomOverrides: false };
        }

        return {
            tokens: {
                ...baseTokens,
                ...overrides,
            },
            hasCustomOverrides: true,
        };
    };

    const initialDesignId = resolveInitialDesignId();
    const initialResolved = resolveTokensForDesign(initialDesignId);

    const store = createStore<DesignCustomizationSnapshot>({
        activeDesignId: initialDesignId,
        tokens: initialResolved.tokens,
        isStudioOpen: false,
        hasCustomOverrides: initialResolved.hasCustomOverrides,
    });

    // Keep activeDesignId in sync when invitationConfig.update({ design: { defaultDesignId } }) is called
    // unless the user has explicitly persisted a custom selection in localStorage.
    invitationConfig.subscribe(() => {
        const savedId = getPrefsStorage().get('activeDesignId');
        const urlId = parseDesignFromUrl();
        if (!savedId && !urlId) {
            const nextDefault = invitationConfig.get().design.defaultDesignId;
            if (nextDefault !== store.getSnapshot().activeDesignId) {
                const resolved = resolveTokensForDesign(nextDefault);
                store.setState({
                    activeDesignId: nextDefault,
                    tokens: resolved.tokens,
                    hasCustomOverrides: resolved.hasCustomOverrides,
                });
            }
        }
    });

    const selectDesign = (designId: InvitationDesignId): void => {
        if (!isInvitationDesignId(designId)) {
            return;
        }
        getPrefsStorage().set('activeDesignId', designId);
        const resolved = resolveTokensForDesign(designId);
        store.setState({
            activeDesignId: designId,
            tokens: resolved.tokens,
            hasCustomOverrides: resolved.hasCustomOverrides,
        });
    };

    const updateTokens = (partial: Partial<DesignTokens>): void => {
        const { activeDesignId } = store.getSnapshot();
        const prefs = getPrefsStorage();
        const existingMap = prefs.get('overridesByDesign') ?? {};
        const mergedOverrides: Partial<DesignTokens> = {
            ...(existingMap[activeDesignId] ?? {}),
            ...partial,
        };

        prefs.set('overridesByDesign', {
            ...existingMap,
            [activeDesignId]: mergedOverrides,
        });

        const baseTokens = DEFAULT_DESIGN_TOKENS[activeDesignId];
        store.setState({
            tokens: {
                ...baseTokens,
                ...mergedOverrides,
            },
            hasCustomOverrides: true,
        });
    };

    const setTypographyPreset = (preset: TypographyPresetId): void => {
        updateTokens({ typographyPreset: preset });
    };

    const resetCurrentDesignTokens = (): void => {
        const { activeDesignId } = store.getSnapshot();
        const prefs = getPrefsStorage();
        const existingMap = { ...(prefs.get('overridesByDesign') ?? {}) };
        delete existingMap[activeDesignId];
        prefs.set('overridesByDesign', existingMap);

        store.setState({
            tokens: DEFAULT_DESIGN_TOKENS[activeDesignId],
            hasCustomOverrides: false,
        });
    };

    const toggleStudio = (open?: boolean): void => {
        store.setState((prev) => ({
            ...prev,
            isStudioOpen: open ?? !prev.isStudioOpen,
        }));
    };

    const resetAll = (): void => {
        getPrefsStorage().clear();
        const defaultId = parseDesignFromUrl() ?? invitationConfig.get().design.defaultDesignId;
        store.setState({
            activeDesignId: defaultId,
            tokens: DEFAULT_DESIGN_TOKENS[defaultId],
            isStudioOpen: false,
            hasCustomOverrides: false,
        });
    };

    return {
        subscribe: store.subscribe,
        getSnapshot: store.getSnapshot,
        selectDesign,
        updateTokens,
        setTypographyPreset,
        resetCurrentDesignTokens,
        toggleStudio,
        resetAll,
    };
})();

export const useDesignStore = (): DesignCustomizationSnapshot => useStore(designStore);
