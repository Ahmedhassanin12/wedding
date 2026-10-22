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

export interface GuestInvitationProps {
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
    autoInit?: boolean;
}

const HEART_SVG_PATH =
    'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15';

const WAVE_HOME_TO_BRIDE =
    'M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z';

const WAVE_BRIDE_TO_STORY =
    'M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z';

const WAVE_STORY_TO_DATE =
    'M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z';

interface AnimatedHeartSvgProps {
    delayMs: number;
    style: React.CSSProperties;
}

const AnimatedHeartSvg: React.FC<AnimatedHeartSvgProps> = ({ delayMs, style }) => {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setIsAnimated(true);
        }, delayMs);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [delayMs]);

    return (
        <div className="position-absolute" style={style}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className={isAnimated ? 'opacity-50 animate-love' : 'opacity-50'}
                viewBox="0 0 16 16"
            >
                <path d={HEART_SVG_PATH} />
            </svg>
        </div>
    );
};

interface WaveSeparatorProps {
    pathD: string;
}

const WaveSeparator: React.FC<WaveSeparatorProps> = ({ pathD }) => (
    <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="color-theme-svg no-gap-bottom">
            <path fill="currentColor" fillOpacity="1" d={pathD} />
        </svg>
    </div>
);

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
                    className={`d-flex justify-content-center align-items-center rounded-pill my-2 ${
                        bannerState === 'offline' ? 'bg-danger' : 'bg-success'
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

    const coupleNames = props.coupleNames ?? config.couple.coupleNames;
    const groomName = props.groomName ?? config.couple.groomName;
    const brideName = props.brideName ?? config.couple.brideName;
    const weddingDateDisplay = props.weddingDateDisplay ?? config.event.weddingDateDisplay;
    const weddingDateTimeDisplay = props.weddingDateTimeDisplay ?? config.event.weddingDateTimeDisplay;
    const ceremonyTimeDisplay = props.ceremonyTimeDisplay ?? config.event.ceremonyTimeDisplay;
    const locationAddress = props.locationAddress ?? config.event.locationAddress;
    const googleMapsUrl = props.googleMapsUrl ?? config.event.googleMapsUrl;
    const videoSrc = props.videoSrc ?? config.media.videoSrc;
    const audioSrc = props.audioSrc ?? config.media.audioSrc;
    const enableConfetti = props.enableConfetti ?? config.presentation.enableConfetti;
    const guestSalutation = props.guestSalutation ?? config.presentation.guestSalutation;
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

    const handleDownloadModalImage = useCallback(() => {
        const src = guestState.selectedImage?.src;
        if (src) {
            image.download(src);
        }
    }, [guestState.selectedImage]);

    const selectedImageSrc = guestState.selectedImage?.src ?? config.media.placeholderImageSrc;
    const isVideoOverlayVisible = videoState.status === 'loading' || videoState.status === 'error';

    return (
        <>
            <OfflineStatusBanner bannerState={offlineState.bannerState} />

            {/* Root Invitation */}
            <div className={guestState.isOpened ? 'row m-0 p-0' : 'row m-0 p-0 opacity-0'} id="root">
                {/* Desktop mode */}
                <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
                    <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
                        <div className="d-flex position-absolute w-100 h-100">
                            <div className="position-relative overflow-hidden vw-100">
                                {config.media.desktopSlides.map((slideItem, index) => {
                                    const isActive = index === activeSlideIndex;
                                    return (
                                        <div
                                            key={slideItem.id}
                                            className={`position-absolute h-100 w-100 slide-desktop${
                                                isActive ? ' slide-desktop-active' : ''
                                            }`}
                                            style={{
                                                opacity: isActive ? 1 : 0,
                                                transition: 'opacity 600ms ease, transform 10s linear',
                                            }}
                                        >
                                            <img
                                                ref={registerImageRef}
                                                src={config.media.placeholderImageSrc}
                                                data-src={slideItem.src}
                                                alt={slideItem.alt}
                                                className="bg-cover-home"
                                                style={{ maskImage: 'none', opacity: '30%' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="text-center p-4 bg-overlay-auto rounded-5">
                            <h2 className="font-esthetic mb-4" style={{ fontSize: '2rem' }}>
                                {coupleNames}
                            </h2>
                            <p className="m-0" style={{ fontSize: '1rem' }}>
                                {weddingDateDisplay}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Smartphone mode */}
                <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
                    <main
                        data-bs-spy="scroll"
                        data-bs-target="#navbar-menu"
                        data-bs-root-margin="25% 0% 0% 0%"
                        data-bs-smooth-scroll="true"
                        tabIndex={0}
                    >
                        {/* Home */}
                        <section
                            ref={registerSectionRef}
                            id="home"
                            className="bg-light-dark position-relative overflow-hidden p-0 m-0"
                        >
                            <img
                                ref={registerImageRef}
                                src={config.media.placeholderImageSrc}
                                data-src={config.couple.heroPhotoSrc}
                                alt="bg"
                                className="position-absolute opacity-25 top-50 start-50 translate-middle bg-cover-home"
                            />

                            <div
                                className="position-relative text-center bg-overlay-auto"
                                style={{ backgroundColor: 'unset' }}
                            >
                                <h1 className="font-esthetic pt-5 pb-4 fw-medium" style={{ fontSize: '2.25rem' }}>
                                    Wedding Invitation
                                </h1>

                                <img
                                    ref={registerImageRef}
                                    src={config.media.placeholderImageSrc}
                                    data-src={config.couple.heroPhotoSrc}
                                    alt="bg"
                                    onClick={handleOpenImageModal}
                                    className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                />

                                <h2 className="font-esthetic my-4" style={{ fontSize: '2.25rem' }}>
                                    {coupleNames}
                                </h2>
                                <p className="my-2" style={{ fontSize: '1.25rem' }}>
                                    {weddingDateTimeDisplay}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleSaveToCalendar}
                                    className="btn btn-outline-auto btn-sm shadow rounded-pill px-3 py-1"
                                    style={{ fontSize: '0.825rem' }}
                                >
                                    <i className="fa-solid fa-calendar-check me-2"></i>Save to Google Calendar
                                </button>

                                <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
                                    <div className="mouse-animation border border-secondary border-2 rounded-5 px-2 py-1 opacity-50">
                                        <div className="scroll-animation rounded-4 bg-secondary"></div>
                                    </div>
                                </div>

                                <p className="pb-4 m-0 text-secondary" style={{ fontSize: '0.825rem' }}>
                                    Scroll Down
                                </p>
                            </div>
                        </section>

                        <WaveSeparator pathD={WAVE_HOME_TO_BRIDE} />

                        {/* Bride */}
                        <section ref={registerSectionRef} className="bg-white-black text-center" id="bride">
                            <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2rem' }}>
                                Peace, Mercy, and Blessings Be Upon You
                            </h2>
                            <p className="pb-4 px-2 m-0" style={{ fontSize: '0.95rem' }}>
                                With all due respect, we cordially invite you to attend our wedding celebration:
                            </p>

                            <div className="overflow-x-hidden pb-4">
                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={500} style={{ top: '0%', right: '5%' }} />

                                    <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
                                        <img
                                            ref={registerImageRef}
                                            src={config.media.placeholderImageSrc}
                                            data-src={config.couple.groomPhotoSrc}
                                            alt="groom"
                                            onClick={handleOpenImageModal}
                                            className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                        />
                                        <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                                            {groomName}
                                        </h2>
                                    </div>

                                    <AnimatedHeartSvg delayMs={2000} style={{ top: '90%', left: '5%' }} />
                                </div>

                                <h2 className="font-esthetic mt-4" style={{ fontSize: '4.5rem' }}>
                                    &amp;
                                </h2>

                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={3000} style={{ top: '0%', right: '5%' }} />

                                    <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
                                        <img
                                            ref={registerImageRef}
                                            src={config.media.placeholderImageSrc}
                                            data-src={config.couple.bridePhotoSrc}
                                            alt="bride"
                                            onClick={handleOpenImageModal}
                                            className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                        />
                                        <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                                            {brideName}
                                        </h2>
                                    </div>

                                    <AnimatedHeartSvg delayMs={2500} style={{ top: '90%', left: '5%' }} />
                                </div>
                            </div>
                        </section>

                        <WaveSeparator pathD={WAVE_BRIDE_TO_STORY} />

                        {/* Love Story */}
                        <section ref={registerSectionRef} className="bg-light-dark pt-2 pb-4">
                            <div className="container">
                                <div className="bg-theme-auto rounded-5 shadow p-3">
                                    <h2 className="font-esthetic text-center py-2 mb-2" style={{ fontSize: '2.125rem' }}>
                                        Our Love Story
                                    </h2>

                                    {videoSrc && (
                                        <div
                                            id="video-love-stroy"
                                            className="position-relative rounded-4 mb-2 pb-0"
                                            data-src={videoSrc}
                                        >
                                            <video
                                                ref={videoRef}
                                                data-src={videoSrc}
                                                className="w-100 rounded-4 shadow-sm m-0 p-0"
                                                loop
                                                muted
                                                playsInline
                                            />

                                            {isVideoOverlayVisible && (
                                                <div
                                                    className="position-absolute d-flex flex-column justify-content-center align-items-center top-50 start-50 translate-middle w-100 h-100 bg-overlay-auto rounded-4 z-3"
                                                    id="video-love-stroy-loading"
                                                >
                                                    <div
                                                        className="progress w-25"
                                                        role="progressbar"
                                                        style={{ height: '0.5rem' }}
                                                        aria-label="progress bar"
                                                    >
                                                        <div
                                                            className="progress-bar"
                                                            id="progress-bar-video-love-stroy"
                                                            style={{
                                                                width: `${videoState.percent}%`,
                                                                backgroundColor: videoState.errorText
                                                                    ? 'red'
                                                                    : undefined,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <small
                                                        className="mt-1 text-theme-auto bg-theme-auto py-0 px-2 rounded-4"
                                                        id="progress-info-video-love-stroy"
                                                        style={{ fontSize: '0.7rem' }}
                                                    >
                                                        {videoState.errorText ?? videoState.label}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <WaveSeparator pathD={WAVE_STORY_TO_DATE} />

                        {/* Wedding Date */}
                        <section ref={registerSectionRef} className="bg-white-black pb-2" id="wedding-date">
                            <div className="container text-center">
                                <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2.25rem' }}>
                                    Our Special Day
                                </h2>

                                <div className="border rounded-pill shadow py-2 px-4 mt-2 mb-4">
                                    <div className="row justify-content-center">
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="day">
                                                {countdown.days}
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Days</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="hour">
                                                {countdown.hours}
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Hours</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="minute">
                                                {countdown.minutes}
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Minutes</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="second">
                                                {countdown.seconds}
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Seconds</small>
                                        </div>
                                    </div>
                                </div>

                                <p className="py-2 m-0" style={{ fontSize: '0.95rem' }}>
                                    Seeking the mercy and blessing of Allah, God willing, we will hold our wedding on:
                                </p>

                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={3000} style={{ top: '0%', right: '5%' }} />
                                </div>

                                <div className="overflow-x-hidden">
                                    <div className="py-2" data-aos="fade-right" data-aos-duration="1500">
                                        <h2 className="font-esthetic m-0 py-2" style={{ fontSize: '2rem' }}>
                                            Wedding Ceremony
                                        </h2>
                                        <p className="m-0" style={{ fontSize: '0.95rem' }}>
                                            {weddingDateDisplay}
                                        </p>
                                        <p style={{ fontSize: '0.95rem' }}>{ceremonyTimeDisplay}</p>
                                    </div>
                                </div>

                                <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
                                    >
                                        <i className="fa-solid fa-map-location-dot me-2"></i>View on Google Maps
                                    </a>
                                    <small className="d-block my-1">{locationAddress}</small>
                                </div>
                            </div>
                        </section>

                        {/* End Of Invitation */}
                        <section ref={registerSectionRef} className="bg-white-black py-2 no-gap-bottom">
                            <div className="container text-center">
                                <p className="pb-2 pt-4" style={{ fontSize: '0.95rem' }}>
                                    Thank you for your attention and your blessings, which are a great joy and honor to
                                    us.
                                </p>

                                <h2 className="font-esthetic" style={{ fontSize: '2rem' }}>
                                    Peace, Mercy, and Blessings Be Upon You
                                </h2>
                            </div>
                        </section>
                    </main>

                    {/* Navbar Bottom */}
                    <nav className="navbar navbar-expand sticky-bottom rounded-top-4 border-top p-0" id="navbar-menu">
                        <ul className="navbar-nav nav-justified w-100 align-items-center">
                            <li className="nav-item">
                                <a className="nav-link" href="#home">
                                    <i className="fa-solid fa-house"></i>
                                    <span className="d-block" style={{ fontSize: '0.7rem' }}>
                                        Home
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#bride">
                                    <i className="fa-solid fa-user-group"></i>
                                    <span className="d-block" style={{ fontSize: '0.7rem' }}>
                                        Couple
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#wedding-date">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span className="d-block" style={{ fontSize: '0.7rem' }}>
                                        Date
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Welcome Page */}
            {!guestState.isOpened && (
                <div
                    className="loading-page bg-white-black"
                    id="welcome"
                    style={{
                        opacity: !autoInit || guestState.isBooted ? 1 : 0,
                        transition: 'opacity 400ms ease',
                    }}
                >
                    <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
                        <div className="d-flex flex-column text-center">
                            <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                                The Wedding Of
                            </h2>

                            <img
                                ref={registerImageRef}
                                src={config.media.placeholderImageSrc}
                                data-src={config.couple.heroPhotoSrc}
                                alt="background"
                                className="img-center-crop rounded-circle border border-3 border-light shadow mb-4 mx-auto"
                            />

                            <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                                {coupleNames}
                            </h2>
                            <div id="guest-name" data-message={guestSalutation}>
                                {guestQueryName && (
                                    <div className="m-2">
                                        <small className="mt-0 mb-1 mx-0 p-0">{guestSalutation}</small>
                                        <p className="m-0 p-0" style={{ fontSize: '1.25rem' }}>
                                            {guestQueryName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={guestState.isOpened}
                                className="btn btn-light shadow rounded-4 mt-3 mx-auto"
                                onClick={(e) => guest.open(e.currentTarget)}
                            >
                                <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>Open Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    className={`btn bg-light-dark border btn-sm rounded-circle ${
                        guestState.isOpened ? '' : 'd-none '
                    }${!offlineState.isOnline ? 'disabled ' : ''}btn-transparent shadow-sm mt-3`}
                    aria-label="Change audio"
                    data-offline-disabled={offlineState.isOnline ? 'false' : 'true'}
                    onClick={() => void audio.toggle()}
                >
                    <i
                        className={
                            audioState.isPlaying
                                ? 'fa-solid fa-circle-pause spin-button'
                                : 'fa-solid fa-circle-play'
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
                                className={`${
                                    areModalActionsVisible ? 'd-flex' : 'd-none'
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
        </>
    );
};
