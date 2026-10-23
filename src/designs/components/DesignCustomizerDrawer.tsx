import React from 'react';
import { INVITATION_DESIGN_LIST } from '../registry';
import { designStore, useDesignStore } from '../designStore';
import { TYPOGRAPHY_PRESETS } from '../tokens';
import type { CountdownStyleVariant, TypographyPresetId } from '../types';

const COUNTDOWN_VARIANTS: readonly { id: CountdownStyleVariant; label: string }[] = [
    { id: 'colon', label: 'Open Serif (49 : 21 : 51)' },
    { id: 'cards', label: 'Editorial Cards' },
    { id: 'pill', label: 'Classic Pill' },
];

const TYPOGRAPHY_PRESET_LIST = Object.values(TYPOGRAPHY_PRESETS);

export const DesignCustomizerDrawer: React.FC = () => {
    const { activeDesignId, isStudioOpen, tokens } = useDesignStore();

    return (
        <>
            {/* Floating Trigger Button (accessible on both Welcome & Opened screens) */}
            {/* <button
                type="button"
                id="button-design-studio"
                aria-label="Customize Invitation Design"
                aria-expanded={isStudioOpen}
                onClick={() => designStore.toggleStudio()}
                className="btn shadow-lg rounded-pill d-flex align-items-center gap-2 px-3 py-2 inv-design-studio-fab"
            >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span className="fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                    Design Studio
                </span>
            </button> */}

            {/* Backdrop */}
            {isStudioOpen && (
                <div
                    className="inv-design-studio-backdrop"
                    onClick={() => designStore.toggleStudio(false)}
                    aria-hidden="true"
                />
            )}

            {/* Slide-Over Customizer Drawer */}
            <aside
                id="design-studio-drawer"
                aria-label="Invitation Design Studio"
                aria-hidden={!isStudioOpen}
                className={`inv-design-studio-drawer${isStudioOpen ? ' is-open' : ''}`}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom border-secondary border-opacity-25">
                    <div>
                        <span
                            className="text-uppercase d-block fw-semibold"
                            style={{ fontSize: '0.65rem', letterSpacing: '0.16em', color: '#c89d66' }}
                        >
                            Multi-Design System
                        </span>
                        <h3 className="m-0 fw-bold" style={{ fontSize: '1.1rem' }}>
                            Invitation Design Studio
                        </h3>
                    </div>
                    <button
                        type="button"
                        id="button-close-design-studio"
                        aria-label="Close Design Studio"
                        onClick={() => designStore.toggleStudio(false)}
                        className="btn btn-sm rounded-circle border border-secondary border-opacity-25 d-flex align-items-center justify-content-center"
                        style={{ width: '2.1rem', height: '2.1rem', color: 'inherit' }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Drawer Body */}
                <div className="p-4 overflow-y-auto flex-grow-1">
                    {/* 1. Template Switcher Gallery */}
                    <div className="mb-4">
                        <label
                            className="d-block text-uppercase fw-semibold mb-2"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.8 }}
                        >
                            1. Select Invitation Template
                        </label>
                        <div className="d-flex flex-column gap-2" role="radiogroup" aria-label="Invitation Templates">
                            {INVITATION_DESIGN_LIST.map((design) => {
                                const isSelected = design.id === activeDesignId;
                                return (
                                    <button
                                        key={design.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        data-design-option={design.id}
                                        onClick={() => designStore.selectDesign(design.id)}
                                        className={`text-start p-3 rounded-4 border transition-all inv-design-card${isSelected ? ' is-selected' : ''
                                            }`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <div>
                                                <span
                                                    className="badge rounded-pill mb-1"
                                                    style={{
                                                        fontSize: '0.62rem',
                                                        backgroundColor: isSelected
                                                            ? '#c89d66'
                                                            : 'rgba(128,128,128,0.2)',
                                                        color: isSelected ? '#1a120b' : 'inherit',
                                                    }}
                                                >
                                                    {design.inspirationTag}
                                                </span>
                                                <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                                                    {design.name}
                                                </div>
                                            </div>
                                            {/* Swatches */}
                                            <div className="d-flex gap-1 mt-1">
                                                {design.previewColors.map((hex: string, i: number) => (
                                                    <span
                                                        key={`${design.id}-swatch-${i}`}
                                                        className="rounded-circle border border-white border-opacity-50 d-inline-block"
                                                        style={{
                                                            width: '0.95rem',
                                                            height: '0.95rem',
                                                            backgroundColor: hex,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.76rem', opacity: 0.78 }}>{design.subtitle}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Typography Pairing */}
                    <div className="mb-4">
                        <label
                            className="d-block text-uppercase fw-semibold mb-2"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.8 }}
                        >
                            2. Typography Pairing
                        </label>
                        <div className="row g-2">
                            {TYPOGRAPHY_PRESET_LIST.map((preset) => {
                                const isActive = tokens.typographyPreset === preset.id;
                                return (
                                    <div key={preset.id} className="col-6">
                                        <button
                                            type="button"
                                            data-typography-preset={preset.id}
                                            onClick={() => designStore.setTypographyPreset(preset.id as TypographyPresetId)}
                                            className={`w-100 text-start p-2 rounded-3 border inv-design-subcard${isActive ? ' is-selected' : ''
                                                }`}
                                        >
                                            <div className="fw-semibold" style={{ fontSize: '0.8rem' }}>
                                                {preset.name}
                                            </div>
                                            <small
                                                className="d-block text-truncate"
                                                style={{ fontSize: '0.68rem', opacity: 0.7 }}
                                            >
                                                {preset.displayFont.split(',')[0].replace(/'/g, '')}
                                            </small>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Color Palette Tokens */}
                    <div className="mb-4">
                        <label
                            className="d-block text-uppercase fw-semibold mb-2"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.8 }}
                        >
                            3. Custom Color Tokens
                        </label>
                        <div className="row g-2">
                            <div className="col-6">
                                <label className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-secondary border-opacity-25">
                                    <span style={{ fontSize: '0.76rem' }}>Primary Accent</span>
                                    <input
                                        type="color"
                                        aria-label="Primary Accent Color"
                                        value={tokens.primaryColor}
                                        onChange={(e) => designStore.updateTokens({ primaryColor: e.target.value })}
                                        className="form-control form-control-color border-0 p-0 bg-transparent"
                                        style={{ width: '1.75rem', height: '1.75rem' }}
                                    />
                                </label>
                            </div>
                            <div className="col-6">
                                <label className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-secondary border-opacity-25">
                                    <span style={{ fontSize: '0.76rem' }}>Secondary Accent</span>
                                    <input
                                        type="color"
                                        aria-label="Secondary Accent Color"
                                        value={tokens.secondaryColor}
                                        onChange={(e) => designStore.updateTokens({ secondaryColor: e.target.value })}
                                        className="form-control form-control-color border-0 p-0 bg-transparent"
                                        style={{ width: '1.75rem', height: '1.75rem' }}
                                    />
                                </label>
                            </div>
                            <div className="col-6">
                                <label className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-secondary border-opacity-25">
                                    <span style={{ fontSize: '0.76rem' }}>Backdrop</span>
                                    <input
                                        type="color"
                                        aria-label="Backdrop Color"
                                        value={tokens.backgroundColor}
                                        onChange={(e) => designStore.updateTokens({ backgroundColor: e.target.value })}
                                        className="form-control form-control-color border-0 p-0 bg-transparent"
                                        style={{ width: '1.75rem', height: '1.75rem' }}
                                    />
                                </label>
                            </div>
                            <div className="col-6">
                                <label className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-secondary border-opacity-25">
                                    <span style={{ fontSize: '0.76rem' }}>Card Surface</span>
                                    <input
                                        type="color"
                                        aria-label="Card Surface Color"
                                        value={tokens.surfaceColor}
                                        onChange={(e) => designStore.updateTokens({ surfaceColor: e.target.value })}
                                        className="form-control form-control-color border-0 p-0 bg-transparent"
                                        style={{ width: '1.75rem', height: '1.75rem' }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 4. Countdown Timer Style */}
                    <div className="mb-4">
                        <label
                            className="d-block text-uppercase fw-semibold mb-2"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.8 }}
                        >
                            4. Countdown Presentation
                        </label>
                        <div className="d-flex flex-column gap-2">
                            {COUNTDOWN_VARIANTS.map((variant) => {
                                const isActive = tokens.countdownStyle === variant.id;
                                return (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        data-countdown-style={variant.id}
                                        onClick={() => designStore.updateTokens({ countdownStyle: variant.id })}
                                        className={`text-start px-3 py-2 rounded-3 border inv-design-subcard${isActive ? ' is-selected' : ''
                                            }`}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        <i
                                            className={`fa-regular ${isActive ? 'fa-circle-check' : 'fa-circle'
                                                } me-2`}
                                        ></i>
                                        {variant.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 5. Ornamental & Content Toggles */}
                    <div className="mb-3">
                        <label
                            className="d-block text-uppercase fw-semibold mb-2"
                            style={{ fontSize: '0.72rem', letterSpacing: '0.12em', opacity: 0.8 }}
                        >
                            5. Decorative &amp; Section Elements
                        </label>
                        <div className="d-flex flex-column gap-2">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="toggle-ornate-frame"
                                    checked={tokens.showOrnateFrame}
                                    onChange={(e) => designStore.updateTokens({ showOrnateFrame: e.target.checked })}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggle-ornate-frame"
                                    style={{ fontSize: '0.82rem' }}
                                >
                                    Ornate Filigree / Lace Frame
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="toggle-floating-petals"
                                    checked={tokens.showFloatingPetals}
                                    onChange={(e) => designStore.updateTokens({ showFloatingPetals: e.target.checked })}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggle-floating-petals"
                                    style={{ fontSize: '0.82rem' }}
                                >
                                    Floating Petals &amp; Shimmer
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="toggle-verse-section"
                                    checked={tokens.showVerseCard}
                                    onChange={(e) => designStore.updateTokens({ showVerseCard: e.target.checked })}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggle-verse-section"
                                    style={{ fontSize: '0.82rem' }}
                                >
                                    Sacred Verse Card (Surah Ar-Rum 30:21)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <button
                        type="button"
                        id="button-reset-design-tokens"
                        onClick={() => designStore.resetCurrentDesignTokens()}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        style={{ fontSize: '0.76rem' }}
                    >
                        <i className="fa-solid fa-rotate-left me-1"></i>Reset Template Defaults
                    </button>
                    <small style={{ fontSize: '0.7rem', opacity: 0.65 }}>Live Preview Active</small>
                </div>
            </aside>
        </>
    );
};
