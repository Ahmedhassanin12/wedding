import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { guest } from '../app/guest/guest';
import { image } from '../app/guest/image';
import { audio } from '../app/guest/audio';
import {
    buildGoogleCalendarUrl,
    useAudioStore,
    useCountdown,
    useDesktopSlideshow,
    useGuestQueryName,
    useGuestStore,
    useOfflineStore,
    useProgressStore,
    useThemeStore,
    useVideoStore,
} from '../app/guest/useGuestInvitation';
import { theme } from '../common/theme';
import { useInvitationConfig } from '../config/invitationConfig';
import { DesignCustomizerDrawer } from '../designs/components/DesignCustomizerDrawer';
import { designStore, useDesignStore } from '../designs/designStore';
import { getDesignDefinition } from '../designs/registry';
import { buildDesignCssVariables } from '../designs/tokens';
import type { InvitationDesignId, ResolvedInvitationContent } from '../designs/types';

export interface GuestInvitationProps {
    designId?: InvitationDesignId;
    enableDesignStudio?: boolean;
    coupleNames?: string;
    groomName?: string;
    brideName?: string;
    weddingDateDisplay?: string;
    weddingDateTimeDisplay?: string;
    ceremonyTimeDisplay?: string;
    countdownTargetTime?: string;
    locationAddress?: string;
    googleMapsUrl?: string;
    videoSrc?: string;
    audioSrc?: string;
    enableConfetti?: boolean;
    guestSalutation?: string;
    verseText?: string;
    verseSource?: string;
    verseArabicText?: string;
    verseSourceArabic?: string;
    celebrationHeading?: string;
    autoInit?: boolean;
}

interface OfflineStatusBannerProps {
    bannerState: 'hidden' | 'offline' | 'online-restored';
}

const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({ bannerState }) => {
    if (bannerState === 'hidden') {
        return null;
    }

    return (
        <div className="fixed-top pe-none" style={{ opacity: 1, zIndex: 1057, transition: 'opacity 300ms ease' }}>
            <div className="d-flex justify-content-center mx-auto">
                <div
                    className={`d-flex justify-content-center align-items-center rounded-pill my-2 ${bannerState === 'offline' ? 'bg-danger' : 'bg-success'
                        } shadow`}
                >
                    <small
                        className="text-center py-1 px-2 mx-1 mt-1 mb-0 text-white"
                        style={{ fontSize: '0.8rem' }}
                    >
                        {bannerState === 'offline' ? (
                            <>
                                <i className="fa-solid fa-ban me-2"></i>Koneksi tidak tersedia
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-cloud me-2"></i>Koneksi tersedia kembali
                            </>
                        )}
                    </small>
                </div>
            </div>
        </div>
    );
};

export const GuestInvitationView: React.FC<GuestInvitationProps> = (props) => {
    const config = useInvitationConfig();
    const guestState = useGuestStore();
    const progressState = useProgressStore();
    const offlineState = useOfflineStore();
    const themeState = useThemeStore();
    const audioState = useAudioStore();
    const videoState = useVideoStore();
    const designState = useDesignStore();

    useEffect(() => {
        if (props.designId) {
            designStore.selectDesign(props.designId);
        }
    }, [props.designId]);

    const coupleNames = props.coupleNames ?? config.couple.coupleNames;
    const groomName = props.groomName ?? config.couple.groomName;
    const brideName = props.brideName ?? config.couple.brideName;
    const weddingDateDisplay = props.weddingDateDisplay ?? config.event.weddingDateDisplay;
    const weddingDateTimeDisplay = props.weddingDateTimeDisplay ?? config.event.weddingDateTimeDisplay;
    const ceremonyTimeDisplay = props.ceremonyTimeDisplay ?? config.event.ceremonyTimeDisplay;
    const locationAddress = props.locationAddress ?? config.event.locationAddress;
    const googleMapsUrl = props.googleMapsUrl ?? config.event.googleMapsUrl;
    const videoSrc = props.videoSrc !== undefined ? props.videoSrc : config.media.videoSrc;
    const audioSrc = props.audioSrc ?? config.media.audioSrc;
    const enableConfetti = props.enableConfetti ?? config.presentation.enableConfetti;
    const guestSalutation = props.guestSalutation ?? config.presentation.guestSalutation;
    const verseText = props.verseText ?? config.presentation.verseText;
    const verseSource = props.verseSource ?? config.presentation.verseSource;
    const verseArabicText = props.verseArabicText ?? config.presentation.verseArabicText;
    const verseSourceArabic = props.verseSourceArabic ?? config.presentation.verseSourceArabic;
    const celebrationHeading = props.celebrationHeading ?? config.presentation.celebrationHeading;
    const enableDesignStudio = props.enableDesignStudio ?? config.design.enableDesignStudio;
    const autoInit = props.autoInit ?? false;

    const effectiveTargetTime =
        props.countdownTargetTime ??
        (typeof document !== 'undefined' ? document.body.getAttribute('data-time') : null) ??
        config.event.countdownTargetTime;

    const countdown = useCountdown(effectiveTargetTime);
    const activeSlideIndex = useDesktopSlideshow(
        config.media.desktopSlides.length,
        guestState.isOpened,
        config.presentation.slideshowIntervalMs,
    );
    const guestQueryName = useGuestQueryName();

    const [areModalActionsVisible, setAreModalActionsVisible] = useState(true);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const imageRefs = useRef<Set<HTMLImageElement>>(new Set());
    const sectionRefs = useRef<Set<HTMLElement>>(new Set());

    const registerImageRef = useCallback((el: HTMLImageElement | null) => {
        if (el) {
            imageRefs.current.add(el);
            const dataSrc = el.getAttribute('data-src');
            if (guest.getSnapshot().isBooted && dataSrc && el.getAttribute('src') !== dataSrc) {
                el.src = dataSrc;
            }
        }
    }, []);

    const registerSectionRef = useCallback((el: HTMLElement | null) => {
        if (el) {
            sectionRefs.current.add(el);
        }
    }, []);

    useEffect(() => {
        guest.setModalElement(modalRef.current);
        return () => {
            guest.setModalElement(null);
        };
    }, []);

    useEffect(() => {
        const modalEl = modalRef.current;
        if (!modalEl) {
            return;
        }

        const handleModalHide = (): void => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        };

        modalEl.addEventListener('hide.bs.modal', handleModalHide);
        return () => {
            modalEl.removeEventListener('hide.bs.modal', handleModalHide);
        };
    }, []);

    useEffect(() => {
        if (!autoInit) {
            return;
        }

        const instance = guest.init({
            images: imageRefs.current,
            sections: sectionRefs.current,
            modalElement: modalRef.current,
            audioUrl: audioSrc,
            enableConfetti,
            videoOptions: {
                videoEl: videoRef.current,
                src: videoSrc,
            },
        });

        window.undangan = instance;

        return () => {
            instance.cleanup();
        };
    }, [autoInit, audioSrc, enableConfetti, videoSrc]);

    useEffect(() => {
        if (!offlineState.isOnline && audioState.isPlaying) {
            audio.pause();
        }
    }, [offlineState.isOnline, audioState.isPlaying]);

    const calendarUrl = useMemo(
        () =>
            buildGoogleCalendarUrl({
                ...config.event,
                calendarTitle: `The Wedding of ${coupleNames}`,
                locationAddress,
            }),
        [config.event, coupleNames, locationAddress],
    );

    const handleSaveToCalendar = useCallback(() => {
        window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    }, [calendarUrl]);

    const handleOpenImageModal = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        setAreModalActionsVisible(true);
        guest.modal(e.currentTarget);
    }, []);

    const handleOpenInvitation = useCallback((button: HTMLButtonElement) => {
        guest.open(button);
    }, []);

    const handleDownloadModalImage = useCallback(() => {
        const src = guestState.selectedImage?.src;
        if (src) {
            image.download(src);
        }
    }, [guestState.selectedImage]);

    const resolvedContent: ResolvedInvitationContent = useMemo(
        () => ({
            coupleNames,
            groomName,
            brideName,
            heroPhotoSrc: config.couple.heroPhotoSrc,
            groomPhotoSrc: config.couple.groomPhotoSrc,
            bridePhotoSrc: config.couple.bridePhotoSrc,
            placeholderImageSrc: config.media.placeholderImageSrc,
            weddingDateDisplay,
            weddingDateTimeDisplay,
            ceremonyTimeDisplay,
            locationAddress,
            googleMapsUrl,
            videoSrc,
            guestSalutation,
            guestQueryName,
            verseText,
            verseSource,
            verseArabicText,
            verseSourceArabic,
            celebrationHeading,
            desktopSlides: config.media.desktopSlides,
        }),
        [
            coupleNames,
            groomName,
            brideName,
            config.couple.heroPhotoSrc,
            config.couple.groomPhotoSrc,
            config.couple.bridePhotoSrc,
            config.media.placeholderImageSrc,
            weddingDateDisplay,
            weddingDateTimeDisplay,
            ceremonyTimeDisplay,
            locationAddress,
            googleMapsUrl,
            videoSrc,
            guestSalutation,
            guestQueryName,
            verseText,
            verseSource,
            verseArabicText,
            verseSourceArabic,
            celebrationHeading,
            config.media.desktopSlides,
        ],
    );

    const activeDefinition = getDesignDefinition(designState.activeDesignId);
    const ActiveTemplateComponent = activeDefinition.Component;
    const designCssVariables = useMemo(
        () => buildDesignCssVariables(designState.tokens),
        [designState.tokens],
    );

    const selectedImageSrc = guestState.selectedImage?.src ?? config.media.placeholderImageSrc;
    const isCustomAudioButton = designState.activeDesignId !== 'classic-wave';

    return (
        <div
            id="invitation-design-wrapper"
            data-active-design={designState.activeDesignId}
            data-typography-preset={designState.tokens.typographyPreset}
            style={designCssVariables}
        >
            <OfflineStatusBanner bannerState={offlineState.bannerState} />

            {/* Active Design Template */}
            <ActiveTemplateComponent
                content={resolvedContent}
                tokens={designState.tokens}
                countdown={countdown}
                activeSlideIndex={activeSlideIndex}
                isOpened={guestState.isOpened}
                isBooted={guestState.isBooted}
                autoInit={autoInit}
                videoState={videoState}
                videoRef={videoRef}
                registerImageRef={registerImageRef}
                registerSectionRef={registerSectionRef}
                onOpenInvitation={handleOpenInvitation}
                onSaveToCalendar={handleSaveToCalendar}
                onOpenImageModal={handleOpenImageModal}
            />

            {/* Multi-Design Customization Studio */}
            {enableDesignStudio && <DesignCustomizerDrawer />}

            {/* Floating Action Button Group */}
            <div
                className="d-flex position-fixed flex-column"
                style={{ bottom: '10vh', right: '2vh', zIndex: 1030 }}
            >
                <button
                    type="button"
                    id="button-theme"
                    className={`btn bg-light-dark border btn-sm rounded-circle ${
                        guestState.isOpened && themeState.isAuto ? '' : 'd-none '
                    }btn-transparent shadow-sm mt-3`}
                    aria-label="Change theme"
                    onClick={() => theme.change()}
                >
                    <i className="fa-solid fa-circle-half-stroke"></i>
                </button>

                <button
                    type="button"
                    id="button-music"
                    disabled={audioState.isLoading || !offlineState.isOnline}
                    className={`btn border btn-sm rounded-circle ${guestState.isOpened ? '' : 'd-none '
                        }${!offlineState.isOnline ? 'disabled ' : ''}${isCustomAudioButton ? 'shadow' : 'bg-light-dark btn-transparent shadow-sm'
                        } mt-3`}
                    style={
                        isCustomAudioButton
                            ? {
                                backgroundColor: designState.tokens.buttonBgColor,
                                color: designState.tokens.buttonTextColor,
                                borderColor: designState.tokens.borderColor,
                                width: '2.5rem',
                                height: '2.5rem',
                            }
                            : undefined
                    }
                    aria-label="Change audio"
                    data-offline-disabled={offlineState.isOnline ? 'false' : 'true'}
                    onClick={() => void audio.toggle()}
                >
                    <i
                        className={
                            audioState.isPlaying
                                ? 'fa-solid fa-circle-pause spin-button'
                                : 'fa-solid fa-volume-high'
                        }
                    ></i>
                </button>
            </div>

            {/* Loading Page */}
            {!guestState.isBooted && (
                <div className="loading-page bg-white-black" id="loading" style={{ opacity: 1 }}>
                    <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
                        <div className="d-flex flex-column width-loading text-center">
                            <img
                                ref={registerImageRef}
                                src={config.media.placeholderImageSrc}
                                data-src={config.media.appIconSrc}
                                fetchPriority="high"
                                className="img-fluid mb-3 mx-auto object-fit-cover"
                                alt="icon"
                                style={{ width: '3.5rem', height: '3.5rem' }}
                            />
                            <div
                                className="progress"
                                role="progressbar"
                                style={{ height: '0.5rem' }}
                                aria-label="progress bar"
                            >
                                <div
                                    className="progress-bar"
                                    id="progress-bar"
                                    style={{
                                        width: `${progressState.percentage}%`,
                                        backgroundColor: progressState.isError ? 'red' : undefined,
                                    }}
                                ></div>
                            </div>
                            <small
                                className={`${progressState.isVisible ? '' : 'd-none '}mt-1 text-theme-auto`}
                                id="progress-info"
                                style={{ fontSize: '0.8rem' }}
                            >
                                {progressState.infoText}
                            </small>
                            <noscript>
                                <small className="mt-1 text-danger">
                                    Sorry, this invitation requires javascript to work
                                </small>
                            </noscript>
                        </div>
                    </div>
                    <div className="text-center position-fixed w-100" style={{ bottom: '8%', left: 0 }}>
                        <div className="d-flex flex-column">
                            <small className="text-secondary">from</small>
                            <small className="text-theme-auto">
                                <i className="fa-brands fa-github me-1"></i>
                                {config.presentation.footerAttribution}
                            </small>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Image */}
            <div ref={modalRef} className="modal fade" id="modal-image" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border border-0">
                        <div className="modal-body p-0">
                            <div
                                className={`${areModalActionsVisible ? 'd-flex' : 'd-none'
                                    } position-absolute top-0 end-0`}
                            >
                                <a
                                    className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                                    role="button"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={selectedImageSrc}
                                    id="button-modal-click"
                                >
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        style={{ width: '1em' }}
                                    ></i>
                                </a>
                                <button
                                    type="button"
                                    onClick={handleDownloadModalImage}
                                    data-src={selectedImageSrc}
                                    className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                                    id="button-modal-download"
                                >
                                    <i className="fa-solid fa-download" style={{ width: '1em' }}></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                                    data-bs-dismiss="modal"
                                >
                                    <i className="fa-solid fa-circle-xmark" style={{ width: '1em' }}></i>
                                </button>
                            </div>

                            <img
                                src={selectedImageSrc}
                                width={guestState.selectedImage?.width}
                                height={guestState.selectedImage?.height}
                                onClick={() => setAreModalActionsVisible((prev) => !prev)}
                                className="img-fluid w-100 rounded-4 cursor-pointer"
                                alt="image"
                                id="show-modal-image"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
