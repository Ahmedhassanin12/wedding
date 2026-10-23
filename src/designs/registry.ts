import { DEFAULT_DESIGN_TOKENS } from './tokens';
import type { InvitationDesignDefinition, InvitationDesignId } from './types';
import { ClassicWaveTemplate } from './templates/ClassicWaveTemplate';
import { RoyalFiligreeTemplate } from './templates/RoyalFiligreeTemplate';
import { CrimsonVelvetTemplate } from './templates/CrimsonVelvetTemplate';
import { BotanicalEditorialTemplate } from './templates/BotanicalEditorialTemplate';

/**
 * Central Registry of all available Invitation Design Templates.
 * Adding a new template only requires creating a template component
 * and registering its definition here.
 */
export const INVITATION_DESIGN_REGISTRY: Record<InvitationDesignId, InvitationDesignDefinition> = {
    'royal-filigree': {
        id: 'royal-filigree',
        name: 'Royal Champagne Filigree',
        subtitle: 'Golden Filigree Arch, Swan Lake & Scalloped Lace',
        description:
            'Inspired by luxury royal wedding cards with an ornate golden filigree arch, swan lake illustration, scalloped lace Quranic verse frame, and open serif colon countdown.',
        inspirationTag: 'Luxury & Ornamental',
        previewColors: ['#f8ebe0', '#c89d66', '#7c5836'],
        defaultTokens: DEFAULT_DESIGN_TOKENS['royal-filigree'],
        Component: RoyalFiligreeTemplate,
    },
    'crimson-velvet': {
        id: 'crimson-velvet',
        name: 'Crimson Velvet & Wax Seal',
        subtitle: 'Burgundy Lace Envelope & Ivory Parchment Card',
        description:
            'Inspired by bespoke velvet envelope invitations featuring a crimson floral-lace pocket, embossed gold heart wax seal, and rising warm parchment letter card with 3-column date layout.',
        inspirationTag: 'Bespoke Envelope',
        previewColors: ['#2d0c13', '#d4af37', '#f7efe6'],
        defaultTokens: DEFAULT_DESIGN_TOKENS['crimson-velvet'],
        Component: CrimsonVelvetTemplate,
    },
    'botanical-editorial': {
        id: 'botanical-editorial',
        name: 'Botanical Sage Editorial',
        subtitle: 'Architectural Archway & Numbered Magazine Chapters',
        description:
            'A contemporary editorial layout pairing deep forest sage and gilded bronze with numbered chapter headings, clean typographic hierarchy, and botanical frame geometry.',
        inspirationTag: 'Modern Editorial',
        previewColors: ['#f2efe9', '#3b4d3e', '#b5945b'],
        defaultTokens: DEFAULT_DESIGN_TOKENS['botanical-editorial'],
        Component: BotanicalEditorialTemplate,
    },
    'classic-wave': {
        id: 'classic-wave',
        name: 'Classic Split-Wave',
        subtitle: 'Layered SVG Waves & Interactive Timeline',
        description:
            'The signature split-screen invitation with layered animated wave dividers, dual-panel desktop showcase, and floating pill countdown.',
        inspirationTag: 'Classic & Minimal',
        previewColors: ['#f8f9fa', '#8c6d46', '#212529'],
        defaultTokens: DEFAULT_DESIGN_TOKENS['classic-wave'],
        Component: ClassicWaveTemplate,
    },
};

export const INVITATION_DESIGN_LIST: InvitationDesignDefinition[] = Object.values(INVITATION_DESIGN_REGISTRY);

export const getDesignDefinition = (id: InvitationDesignId): InvitationDesignDefinition => {
    return INVITATION_DESIGN_REGISTRY['royal-filigree'];
};
