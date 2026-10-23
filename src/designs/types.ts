import type React from 'react';
import type { CountdownValues } from '../app/guest/useGuestInvitation';
import type { VideoSnapshot } from '../app/guest/video';
import type { InvitationConfig, InvitationDesignId } from '../config/invitationConfig';

export type { InvitationDesignId };

export type TypographyPresetId =
    | 'romantic-script'
    | 'royal-serif'
    | 'editorial-luxury'
    | 'arabic-calligraphy';

export type CountdownStyleVariant = 'pill' | 'colon' | 'cards';

export interface TypographyPreset {
    readonly id: TypographyPresetId;
    readonly name: string;
    readonly description: string;
    readonly displayFont: string;
    readonly bodyFont: string;
    readonly serifFont: string;
}

export interface DesignTokens {
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly backgroundColor: string;
    readonly surfaceColor: string;
    readonly textColor: string;
    readonly mutedTextColor: string;
    readonly borderColor: string;
    readonly buttonBgColor: string;
    readonly buttonTextColor: string;
    readonly typographyPreset: TypographyPresetId;
    readonly countdownStyle: CountdownStyleVariant;
    readonly showFloatingPetals: boolean;
    readonly showOrnateFrame: boolean;
    readonly showVerseCard: boolean;
}

export interface ResolvedInvitationContent {
    readonly coupleNames: string;
    readonly groomName: string;
    readonly brideName: string;
    readonly heroPhotoSrc: string;
    readonly groomPhotoSrc: string;
    readonly bridePhotoSrc: string;
    readonly placeholderImageSrc: string;
    readonly weddingDateDisplay: string;
    readonly weddingDateTimeDisplay: string;
    readonly ceremonyTimeDisplay: string;
    readonly locationAddress: string;
    readonly googleMapsUrl: string;
    readonly videoSrc?: string;
    readonly guestSalutation: string;
    readonly guestQueryName: string | null;
    readonly verseText: string;
    readonly verseSource: string;
    readonly verseArabicText: string;
    readonly verseSourceArabic: string;
    readonly celebrationHeading: string;
    readonly desktopSlides: InvitationConfig['media']['desktopSlides'];
}

export interface InvitationTemplateProps {
    readonly content: ResolvedInvitationContent;
    readonly tokens: DesignTokens;
    readonly countdown: CountdownValues;
    readonly activeSlideIndex: number;
    readonly isOpened: boolean;
    readonly isBooted: boolean;
    readonly autoInit: boolean;
    readonly videoState: VideoSnapshot;
    readonly videoRef: React.RefObject<HTMLVideoElement | null>;
    readonly registerImageRef: (el: HTMLImageElement | null) => void;
    readonly registerSectionRef: (el: HTMLElement | null) => void;
    readonly onOpenInvitation: (button: HTMLButtonElement) => void;
    readonly onOpenImageModal: (e: React.MouseEvent<HTMLImageElement>) => void;
    readonly onSaveToCalendar: () => void;
}

export interface InvitationDesignDefinition {
    readonly id: InvitationDesignId;
    readonly name: string;
    readonly subtitle: string;
    readonly description: string;
    readonly inspirationTag: string;
    readonly previewColors: readonly [string, string, string];
    readonly defaultTokens: DesignTokens;
    readonly Component: React.FC<InvitationTemplateProps>;
}
