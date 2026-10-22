import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GuestInvitationView } from '../components/GuestInvitationView';
import { invitationConfig } from '../config/invitationConfig';
import { guest } from '../app/guest/guest';
import { designStore } from '../designs/designStore';
import { INVITATION_DESIGN_LIST, INVITATION_DESIGN_REGISTRY, getDesignDefinition } from '../designs/registry';
import { DEFAULT_DESIGN_TOKENS } from '../designs/tokens';

describe('Multi-Design Invitation System & Design Studio Customizer', () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.history.replaceState({}, '', '/');
        document.body.removeAttribute('data-design');
        invitationConfig.reset();
        designStore.resetAll();
        guest.reset();
    });

    it('registers 4 visually and structurally distinct invitation templates in a central registry', () => {
        expect(INVITATION_DESIGN_LIST).toHaveLength(4);

        const ids = INVITATION_DESIGN_LIST.map((d) => d.id);
        expect(ids).toEqual(['royal-filigree', 'crimson-velvet', 'botanical-editorial', 'classic-wave']);

        for (const id of ids) {
            const def = getDesignDefinition(id);
            expect(def).toBe(INVITATION_DESIGN_REGISTRY[id]);
            expect(def.name.length).toBeGreaterThan(0);
            expect(def.previewColors).toHaveLength(3);
            expect(def.defaultTokens).toEqual(DEFAULT_DESIGN_TOKENS[id]);
        }
    });

    it('renders Royal Champagne Filigree by default with filigree arch, scalloped lace Quranic verse, and colon countdown', () => {
        const { container } = render(<GuestInvitationView />);

        const wrapper = container.querySelector('#invitation-design-wrapper');
        expect(wrapper).toHaveAttribute('data-active-design', 'royal-filigree');

        // Verify Royal Filigree structural landmarks inspired by Reference Images 1 & 5
        expect(container.querySelector('.inv-filigree-arch-frame')).not.toBeNull();
        expect(container.querySelector('.inv-lace-verse-wrapper')).not.toBeNull();
        expect(screen.getByText('SURAH AR-RUM — 30:21')).toBeInTheDocument();
        expect(screen.getByText('The celebration begins.')).toBeInTheDocument();

        // Verify colon countdown landmarks (#day, #hour, #minute, #second)
        expect(container.querySelector('#day')).not.toBeNull();
        expect(container.querySelector('#hour')).not.toBeNull();
        expect(container.querySelector('#minute')).not.toBeNull();
        expect(container.querySelector('#second')).not.toBeNull();
    });

    it('switches between all 4 templates via the Design Studio Drawer while preserving invitation content', () => {
        const { container } = render(
            <GuestInvitationView
                coupleNames="Zayd & Layla"
                groomName="Zayd"
                brideName="Layla"
                locationAddress="Royal Palace Gardens"
            />,
        );

        // Open the Design Studio Drawer
        const studioButton = container.querySelector('#button-design-studio') as HTMLButtonElement;
        expect(studioButton).not.toBeNull();
        fireEvent.click(studioButton);

        const drawer = container.querySelector('#design-studio-drawer');
        expect(drawer).toHaveAttribute('aria-hidden', 'false');

        // Switch to Crimson Velvet & Wax Seal (Reference Images 2, 3, 4)
        const crimsonOption = container.querySelector('[data-design-option="crimson-velvet"]') as HTMLButtonElement;
        fireEvent.click(crimsonOption);

        expect(container.querySelector('#invitation-design-wrapper')).toHaveAttribute(
            'data-active-design',
            'crimson-velvet',
        );
        expect(container.querySelector('.inv-sealed-lace-envelope')).not.toBeNull();
        expect(container.querySelector('.inv-parchment-letter-card')).not.toBeNull();
        expect(screen.getAllByText('Zayd & Layla').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Royal Palace Gardens')).toBeInTheDocument();

        // Switch to Botanical Sage Editorial
        const botanicalOption = container.querySelector(
            '[data-design-option="botanical-editorial"]',
        ) as HTMLButtonElement;
        fireEvent.click(botanicalOption);

        expect(container.querySelector('#invitation-design-wrapper')).toHaveAttribute(
            'data-active-design',
            'botanical-editorial',
        );
        expect(screen.getByText(/Issue No\. 01/i)).toBeInTheDocument();
        expect(screen.getAllByText('Zayd & Layla').length).toBeGreaterThanOrEqual(1);

        // Switch to Classic Split-Wave
        const classicOption = container.querySelector('[data-design-option="classic-wave"]') as HTMLButtonElement;
        fireEvent.click(classicOption);

        expect(container.querySelector('#invitation-design-wrapper')).toHaveAttribute(
            'data-active-design',
            'classic-wave',
        );
        expect(container.querySelectorAll('.svg-wrapper').length).toBeGreaterThanOrEqual(3);
        expect(screen.getAllByText('Zayd & Layla').length).toBeGreaterThanOrEqual(2);
    });

    it('supports live customization of colors, typography, countdown style, decorative toggles, and reset to defaults', () => {
        const { container } = render(<GuestInvitationView />);

        // Verify verse card is initially visible in royal-filigree
        expect(container.querySelector('.inv-lace-verse-wrapper')).not.toBeNull();

        // Toggle off Sacred Verse Card via UI switch
        const verseToggle = container.querySelector('#toggle-verse-section') as HTMLInputElement;
        fireEvent.click(verseToggle);
        expect(container.querySelector('.inv-lace-verse-wrapper')).toBeNull();

        // Switch typography preset to editorial-luxury
        const editorialPresetBtn = container.querySelector(
            '[data-typography-preset="editorial-luxury"]',
        ) as HTMLButtonElement;
        fireEvent.click(editorialPresetBtn);
        expect(container.querySelector('#invitation-design-wrapper')).toHaveAttribute(
            'data-typography-preset',
            'editorial-luxury',
        );

        // Customize primary color token
        act(() => {
            designStore.updateTokens({ primaryColor: '#123456', countdownStyle: 'cards' });
        });
        expect(designStore.getSnapshot().tokens.primaryColor).toBe('#123456');
        expect(designStore.getSnapshot().tokens.countdownStyle).toBe('cards');
        expect(designStore.getSnapshot().hasCustomOverrides).toBe(true);

        // Reset template defaults
        const resetButton = container.querySelector('#button-reset-design-tokens') as HTMLButtonElement;
        fireEvent.click(resetButton);

        expect(designStore.getSnapshot().tokens).toEqual(DEFAULT_DESIGN_TOKENS['royal-filigree']);
        expect(designStore.getSnapshot().hasCustomOverrides).toBe(false);
        expect(container.querySelector('.inv-lace-verse-wrapper')).not.toBeNull();
    });
});
