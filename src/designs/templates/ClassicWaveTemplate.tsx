import React from 'react';
import {
    AnimatedHeartSvg,
    FloatingPetalsOverlay,
    InvitationCountdown,
    LoveStoryVideoCard,
    ScallopedLaceVerseCard,
    WaveSeparator,
} from '../components/OrnamentalSvgs';
import type { InvitationTemplateProps } from '../types';

const WAVE_HOME_TO_BRIDE =
    'M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z';

const WAVE_BRIDE_TO_STORY =
    'M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z';

const WAVE_STORY_TO_DATE =
    'M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z';

export const ClassicWaveTemplate: React.FC<InvitationTemplateProps> = ({
    content,
    tokens,
    countdown,
    activeSlideIndex,
    isOpened,
    isBooted,
    autoInit,
    videoState,
    videoRef,
    registerImageRef,
    registerSectionRef,
    onOpenInvitation,
    onOpenImageModal,
    onSaveToCalendar,
}) => {
    return (
        <>
            {tokens.showFloatingPetals && <FloatingPetalsOverlay variant="petals" />}

            {/* Root Invitation */}
            <div
                className={isOpened ? 'row m-0 p-0' : 'row m-0 p-0 opacity-0'}
                id="root"
                style={{ fontFamily: 'var(--inv-font-body)' }}
            >
                {/* Desktop mode */}
                <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
                    <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
                        <div className="d-flex position-absolute w-100 h-100">
                            <div className="position-relative overflow-hidden vw-100">
                                {content.desktopSlides.map((slideItem, index) => {
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
                                                src={content.placeholderImageSrc}
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
                            <h2
                                className="font-esthetic mb-4"
                                style={{ fontSize: '2rem', fontFamily: 'var(--inv-font-display)' }}
                            >
                                {content.coupleNames}
                            </h2>
                            <p className="m-0" style={{ fontSize: '1rem' }}>
                                {content.weddingDateDisplay}
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
                                src={content.placeholderImageSrc}
                                data-src={content.heroPhotoSrc}
                                alt="bg"
                                className="position-absolute opacity-25 top-50 start-50 translate-middle bg-cover-home"
                            />

                            <div
                                className="position-relative text-center bg-overlay-auto"
                                style={{ backgroundColor: 'unset' }}
                            >
                                <h1
                                    className="font-esthetic pt-5 pb-4 fw-medium"
                                    style={{ fontSize: '2.25rem', fontFamily: 'var(--inv-font-display)' }}
                                >
                                    Wedding Invitation
                                </h1>

                                <img
                                    ref={registerImageRef}
                                    src={content.placeholderImageSrc}
                                    data-src={content.heroPhotoSrc}
                                    alt="bg"
                                    onClick={onOpenImageModal}
                                    className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                />

                                <h2
                                    className="font-esthetic my-4"
                                    style={{ fontSize: '2.25rem', fontFamily: 'var(--inv-font-display)' }}
                                >
                                    {content.coupleNames}
                                </h2>
                                <p className="my-2" style={{ fontSize: '1.25rem' }}>
                                    {content.weddingDateTimeDisplay}
                                </p>

                                <button
                                    type="button"
                                    onClick={onSaveToCalendar}
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
                            <h2
                                className="font-esthetic py-4 m-0"
                                style={{ fontSize: '2rem', fontFamily: 'var(--inv-font-display)' }}
                            >
                                Peace, Mercy, and Blessings Be Upon You
                            </h2>
                            <p className="pb-4 px-2 m-0" style={{ fontSize: '0.95rem' }}>
                                With all due respect, we cordially invite you to attend our wedding celebration:
                            </p>

                            {tokens.showVerseCard && (
                                <div className="container">
                                    <ScallopedLaceVerseCard
                                        verseText={content.verseText}
                                        verseSource={content.verseSource}
                                        showOrnateFrame={tokens.showOrnateFrame}
                                    />
                                </div>
                            )}

                            <div className="overflow-x-hidden pb-4">
                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={500} style={{ top: '0%', right: '5%' }} />

                                    <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
                                        <img
                                            ref={registerImageRef}
                                            src={content.placeholderImageSrc}
                                            data-src={content.groomPhotoSrc}
                                            alt="groom"
                                            onClick={onOpenImageModal}
                                            className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                        />
                                        <h2
                                            className="font-esthetic m-0"
                                            style={{ fontSize: '2.125rem', fontFamily: 'var(--inv-font-display)' }}
                                        >
                                            {content.groomName}
                                        </h2>
                                    </div>

                                    <AnimatedHeartSvg delayMs={2000} style={{ top: '90%', left: '5%' }} />
                                </div>

                                <h2
                                    className="font-esthetic mt-4"
                                    style={{ fontSize: '4.5rem', fontFamily: 'var(--inv-font-display)' }}
                                >
                                    &amp;
                                </h2>

                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={3000} style={{ top: '0%', right: '5%' }} />

                                    <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
                                        <img
                                            ref={registerImageRef}
                                            src={content.placeholderImageSrc}
                                            data-src={content.bridePhotoSrc}
                                            alt="bride"
                                            onClick={onOpenImageModal}
                                            className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                        />
                                        <h2
                                            className="font-esthetic m-0"
                                            style={{ fontSize: '2.125rem', fontFamily: 'var(--inv-font-display)' }}
                                        >
                                            {content.brideName}
                                        </h2>
                                    </div>

                                    <AnimatedHeartSvg delayMs={2500} style={{ top: '90%', left: '5%' }} />
                                </div>
                            </div>
                        </section>

                        <WaveSeparator pathD={WAVE_BRIDE_TO_STORY} />

                        {/* Love Story or Quranic Message */}
                        <section ref={registerSectionRef} className="bg-light-dark pt-2 pb-4">
                            <div className="container">
                                <LoveStoryVideoCard
                                    videoSrc={content.videoSrc}
                                    videoRef={videoRef}
                                    videoState={videoState}
                                    verseArabicText={content.verseArabicText}
                                    verseSourceArabic={content.verseSourceArabic}
                                />
                            </div>
                        </section>

                        <WaveSeparator pathD={WAVE_STORY_TO_DATE} />

                        {/* Wedding Date */}
                        <section ref={registerSectionRef} className="bg-white-black pb-2" id="wedding-date">
                            <div className="container text-center">
                                <h2
                                    className="font-esthetic py-4 m-0"
                                    style={{ fontSize: '2.25rem', fontFamily: 'var(--inv-font-display)' }}
                                >
                                    Our Special Day
                                </h2>

                                <InvitationCountdown
                                    countdown={countdown}
                                    variant={tokens.countdownStyle}
                                    heading={tokens.countdownStyle === 'colon' ? content.celebrationHeading : undefined}
                                />

                                <p className="py-2 m-0" style={{ fontSize: '0.95rem' }}>
                                    Seeking the mercy and blessing of Allah, God willing, we will hold our wedding on:
                                </p>

                                <div className="position-relative">
                                    <AnimatedHeartSvg delayMs={3000} style={{ top: '0%', right: '5%' }} />
                                </div>

                                <div className="overflow-x-hidden">
                                    <div className="py-2" data-aos="fade-right" data-aos-duration="1500">
                                        <h2
                                            className="font-esthetic m-0 py-2"
                                            style={{ fontSize: '2rem', fontFamily: 'var(--inv-font-display)' }}
                                        >
                                            Wedding Ceremony
                                        </h2>
                                        <p className="m-0" style={{ fontSize: '0.95rem' }}>
                                            {content.weddingDateDisplay}
                                        </p>
                                        <p style={{ fontSize: '0.95rem' }}>{content.ceremonyTimeDisplay}</p>
                                    </div>
                                </div>

                                <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
                                    <a
                                        href={content.googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
                                    >
                                        <i className="fa-solid fa-map-location-dot me-2"></i>View on Google Maps
                                    </a>
                                    <small className="d-block my-1">{content.locationAddress}</small>
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

                                <h2
                                    className="font-esthetic"
                                    style={{ fontSize: '2rem', fontFamily: 'var(--inv-font-display)' }}
                                >
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
            {!isOpened && (
                <div
                    className="loading-page bg-white-black"
                    id="welcome"
                    style={{
                        opacity: !autoInit || isBooted ? 1 : 0,
                        transition: 'opacity 400ms ease',
                    }}
                >
                    <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
                        <div className="d-flex flex-column text-center">
                            <h2
                                className="font-esthetic mb-4"
                                style={{ fontSize: '2.25rem', fontFamily: 'var(--inv-font-display)' }}
                            >
                                The Wedding Of
                            </h2>

                            <img
                                ref={registerImageRef}
                                src={content.placeholderImageSrc}
                                data-src={content.heroPhotoSrc}
                                alt="background"
                                className="img-center-crop rounded-circle border border-3 border-light shadow mb-4 mx-auto"
                            />

                            <h2
                                className="font-esthetic mb-4"
                                style={{ fontSize: '2.25rem', fontFamily: 'var(--inv-font-display)' }}
                            >
                                {content.coupleNames}
                            </h2>
                            <div id="guest-name" data-message={content.guestSalutation}>
                                {content.guestQueryName && (
                                    <div className="m-2">
                                        <small className="mt-0 mb-1 mx-0 p-0">{content.guestSalutation}</small>
                                        <p className="m-0 p-0" style={{ fontSize: '1.25rem' }}>
                                            {content.guestQueryName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isOpened}
                                className="btn btn-light shadow rounded-4 mt-3 mx-auto"
                                onClick={(e) => onOpenInvitation(e.currentTarget)}
                            >
                                <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>Open Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
