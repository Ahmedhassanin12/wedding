import React from 'react';
import {
    BotanicalKnotDivider,
    FiligreeCrownCrestSvg,
    FloatingPetalsOverlay,
    InvitationCountdown,
    LoveStoryVideoCard,
    ScallopedLaceVerseCard,
    SwanLakeIllustration,
} from '../components/OrnamentalSvgs';
import type { InvitationTemplateProps } from '../types';

/**
 * Royal Filigree & Vintage Lace Template
 * Inspired by Reference Images 1 & 5:
 * - Golden filigree arch with royal crown finial & swan lake motif
 * - Scalloped vintage floral-lace Quranic verse card (Surah Ar-Rum 30:21)
 * - Botanical knot divider & open editorial serif colon countdown (`49 : 21 : 51 : 51`)
 */
export const RoyalFiligreeTemplate: React.FC<InvitationTemplateProps> = ({
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
        <div className="inv-design-royal-filigree">
            {tokens.showFloatingPetals && <FloatingPetalsOverlay variant="petals" />}

            {/* Root Invitation */}
            <div
                className={isOpened ? 'row m-0 p-0' : 'row m-0 p-0 opacity-0'}
                id="root"
                style={{
                    backgroundColor: 'var(--inv-bg)',
                    color: 'var(--inv-text)',
                    fontFamily: 'var(--inv-font-body)',
                }}
            >
                {/* Desktop Showcase */}
                <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
                    <div
                        className="position-relative d-flex justify-content-center align-items-center vh-100 p-4"
                        style={{ backgroundColor: 'var(--inv-bg)' }}
                    >
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
                                                style={{ maskImage: 'none', opacity: '22%' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="inv-filigree-arch-card text-center px-5 py-5 position-relative z-1">
                            <FiligreeCrownCrestSvg color="var(--inv-secondary)" />
                            <small
                                className="d-block text-uppercase mb-2"
                                style={{ letterSpacing: '0.22em', color: 'var(--inv-muted)', fontSize: '0.75rem' }}
                            >
                                Royal Wedding Celebration
                            </small>
                            <h2
                                className="mb-3"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '3.2rem',
                                    color: 'var(--inv-primary)',
                                }}
                            >
                                {content.coupleNames}
                            </h2>
                            <BotanicalKnotDivider color="var(--inv-secondary)" />
                            <p
                                className="m-0"
                                style={{
                                    fontFamily: 'var(--inv-font-serif)',
                                    fontSize: '1.15rem',
                                    letterSpacing: '0.08em',
                                    color: 'var(--inv-text)',
                                }}
                            >
                                {content.weddingDateDisplay}
                            </p>
                            <SwanLakeIllustration color="var(--inv-secondary)" />
                        </div>
                    </div>
                </div>

                {/* Mobile / Scroll Column */}
                <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
                    <main tabIndex={0}>
                        {/* Hero Section (Reference Image 5) */}
                        <section
                            ref={registerSectionRef}
                            id="home"
                            className="position-relative overflow-hidden py-4 px-3"
                            style={{ backgroundColor: 'var(--inv-bg)' }}
                        >
                            <div
                                className={`inv-filigree-arch-frame mx-auto text-center px-3 py-4 position-relative ${
                                    tokens.showOrnateFrame ? 'inv-arch-bordered' : ''
                                }`}
                            >
                                <FiligreeCrownCrestSvg color="var(--inv-secondary)" />

                                <h1
                                    className="fw-normal mb-2"
                                    style={{
                                        fontFamily: 'var(--inv-font-serif)',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        color: 'var(--inv-muted)',
                                    }}
                                >
                                    Wedding Invitation
                                </h1>

                                <div className="my-3">
                                    <img
                                        ref={registerImageRef}
                                        src={content.placeholderImageSrc}
                                        data-src={content.heroPhotoSrc}
                                        alt="bg"
                                        onClick={onOpenImageModal}
                                        className="img-center-crop cursor-pointer shadow-sm mx-auto d-block"
                                        style={{
                                            borderRadius: '120px 120px 24px 24px',
                                            border: '2px solid var(--inv-secondary)',
                                            padding: '4px',
                                            backgroundColor: 'var(--inv-surface)',
                                        }}
                                    />
                                </div>

                                <h2
                                    className="my-3"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '2.85rem',
                                        color: 'var(--inv-primary)',
                                        lineHeight: 1.15,
                                    }}
                                >
                                    {content.coupleNames}
                                </h2>

                                <p
                                    className="my-2"
                                    style={{
                                        fontFamily: 'var(--inv-font-serif)',
                                        fontSize: '1.15rem',
                                        letterSpacing: '0.06em',
                                        color: 'var(--inv-text)',
                                    }}
                                >
                                    {content.weddingDateTimeDisplay}
                                </p>

                                <button
                                    type="button"
                                    onClick={onSaveToCalendar}
                                    className="btn btn-sm rounded-pill px-4 py-2 my-2 shadow-sm"
                                    style={{
                                        backgroundColor: 'var(--inv-surface)',
                                        color: 'var(--inv-primary)',
                                        border: '1px solid var(--inv-secondary)',
                                        fontSize: '0.82rem',
                                        fontFamily: 'var(--inv-font-serif)',
                                    }}
                                >
                                    <i className="fa-solid fa-calendar-check me-2"></i>Save to Google Calendar
                                </button>

                                <SwanLakeIllustration color="var(--inv-secondary)" />

                                <div className="mt-2">
                                    <small
                                        className="d-block text-uppercase mb-2"
                                        style={{
                                            letterSpacing: '0.2em',
                                            fontSize: '0.7rem',
                                            color: 'var(--inv-muted)',
                                        }}
                                    >
                                        Scroll Down
                                    </small>
                                    <a
                                        href="#wedding-date"
                                        className="d-inline-flex justify-content-center align-items-center rounded-circle shadow-sm text-decoration-none"
                                        style={{
                                            width: '2.2rem',
                                            height: '2.2rem',
                                            backgroundColor: 'var(--inv-surface)',
                                            border: '1px solid var(--inv-border)',
                                            color: 'var(--inv-primary)',
                                        }}
                                        aria-label="Scroll to countdown"
                                    >
                                        <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Scalloped Lace Verse & Editorial Countdown Section (Reference Image 1) */}
                        <section
                            ref={registerSectionRef}
                            id="wedding-date"
                            className="py-4 px-3 text-center"
                            style={{ backgroundColor: 'var(--inv-bg)' }}
                        >
                            <div className="container px-1">
                                {tokens.showVerseCard && (
                                    <ScallopedLaceVerseCard
                                        verseText={content.verseText}
                                        verseSource={content.verseSource}
                                        showOrnateFrame={tokens.showOrnateFrame}
                                    />
                                )}

                                <BotanicalKnotDivider color="var(--inv-secondary)" />

                                <h2
                                    className="visually-hidden"
                                >
                                    Our Special Day
                                </h2>

                                <InvitationCountdown
                                    countdown={countdown}
                                    variant={tokens.countdownStyle}
                                    heading={content.celebrationHeading}
                                />

                                <BotanicalKnotDivider color="var(--inv-secondary)" />

                                <div
                                    className="p-4 rounded-4 my-3 shadow-sm"
                                    style={{
                                        backgroundColor: 'var(--inv-surface)',
                                        border: '1px solid var(--inv-border)',
                                    }}
                                >
                                    <h3
                                        className="m-0 py-1"
                                        style={{
                                            fontFamily: 'var(--inv-font-display)',
                                            fontSize: '2.1rem',
                                            color: 'var(--inv-primary)',
                                        }}
                                    >
                                        Wedding Ceremony
                                    </h3>
                                    <p
                                        className="m-0 fw-semibold"
                                        style={{ fontFamily: 'var(--inv-font-serif)', fontSize: '1.05rem' }}
                                    >
                                        {content.weddingDateDisplay}
                                    </p>
                                    <p
                                        className="mb-3"
                                        style={{ fontFamily: 'var(--inv-font-serif)', fontSize: '0.95rem' }}
                                    >
                                        {content.ceremonyTimeDisplay}
                                    </p>

                                    <a
                                        href={content.googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-sm rounded-pill shadow-sm mb-2 px-4 py-2"
                                        style={{
                                            backgroundColor: 'var(--inv-btn-bg)',
                                            color: 'var(--inv-btn-text)',
                                        }}
                                    >
                                        <i className="fa-solid fa-map-location-dot me-2"></i>View on Google Maps
                                    </a>
                                    <small
                                        className="d-block my-1"
                                        style={{ color: 'var(--inv-muted)', fontSize: '0.85rem' }}
                                    >
                                        {content.locationAddress}
                                    </small>
                                </div>
                            </div>
                        </section>

                        {/* Couple Portraits Section */}
                        <section
                            ref={registerSectionRef}
                            id="bride"
                            className="py-4 px-3 text-center"
                            style={{ backgroundColor: 'var(--inv-surface)' }}
                        >
                            <div className="container">
                                <FiligreeCrownCrestSvg color="var(--inv-secondary)" />
                                <h2
                                    className="py-2 m-0"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '2.2rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Peace, Mercy, and Blessings Be Upon You
                                </h2>
                                <p
                                    className="pb-3 px-2 m-0"
                                    style={{ fontFamily: 'var(--inv-font-serif)', fontSize: '1rem' }}
                                >
                                    With all due respect, we cordially invite you to attend our wedding celebration:
                                </p>

                                <div className="row g-4 justify-content-center align-items-center py-2">
                                    <div className="col-12">
                                        <div
                                            className="p-3 mx-auto"
                                            style={{
                                                maxWidth: '260px',
                                                borderRadius: '130px 130px 20px 20px',
                                                border: '1.5px solid var(--inv-border)',
                                                backgroundColor: 'var(--inv-bg)',
                                            }}
                                        >
                                            <img
                                                ref={registerImageRef}
                                                src={content.placeholderImageSrc}
                                                data-src={content.groomPhotoSrc}
                                                alt="groom"
                                                onClick={onOpenImageModal}
                                                className="img-center-crop rounded-circle border border-2 shadow-sm mb-3 mx-auto cursor-pointer"
                                                style={{ borderColor: 'var(--inv-secondary)' }}
                                            />
                                            <h2
                                                className="m-0"
                                                style={{
                                                    fontFamily: 'var(--inv-font-display)',
                                                    fontSize: '2.25rem',
                                                    color: 'var(--inv-primary)',
                                                }}
                                            >
                                                {content.groomName}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <span
                                            style={{
                                                fontFamily: 'var(--inv-font-display)',
                                                fontSize: '3.2rem',
                                                color: 'var(--inv-secondary)',
                                            }}
                                        >
                                            &amp;
                                        </span>
                                    </div>

                                    <div className="col-12">
                                        <div
                                            className="p-3 mx-auto"
                                            style={{
                                                maxWidth: '260px',
                                                borderRadius: '130px 130px 20px 20px',
                                                border: '1.5px solid var(--inv-border)',
                                                backgroundColor: 'var(--inv-bg)',
                                            }}
                                        >
                                            <img
                                                ref={registerImageRef}
                                                src={content.placeholderImageSrc}
                                                data-src={content.bridePhotoSrc}
                                                alt="bride"
                                                onClick={onOpenImageModal}
                                                className="img-center-crop rounded-circle border border-2 shadow-sm mb-3 mx-auto cursor-pointer"
                                                style={{ borderColor: 'var(--inv-secondary)' }}
                                            />
                                            <h2
                                                className="m-0"
                                                style={{
                                                    fontFamily: 'var(--inv-font-display)',
                                                    fontSize: '2.25rem',
                                                    color: 'var(--inv-primary)',
                                                }}
                                            >
                                                {content.brideName}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Love Story Video */}
                        {Boolean(content.videoSrc?.trim()) && (
                            <section
                                ref={registerSectionRef}
                                className="py-4 px-3"
                                style={{ backgroundColor: 'var(--inv-bg)' }}
                            >
                                <div className="container px-1">
                                    <LoveStoryVideoCard
                                        videoSrc={content.videoSrc}
                                        videoRef={videoRef}
                                        videoState={videoState}
                                    />
                                </div>
                            </section>
                        )}

                        {/* Closing */}
                        <section
                            ref={registerSectionRef}
                            className="py-4 px-3 text-center"
                            style={{ backgroundColor: 'var(--inv-surface)' }}
                        >
                            <div className="container">
                                <BotanicalKnotDivider color="var(--inv-secondary)" />
                                <p className="pb-2 pt-2" style={{ fontFamily: 'var(--inv-font-serif)', fontSize: '1rem' }}>
                                    Thank you for your attention and your blessings, which are a great joy and honor to
                                    us.
                                </p>
                                <h2
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '2rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Peace, Mercy, and Blessings Be Upon You
                                </h2>
                                <SwanLakeIllustration color="var(--inv-secondary)" />
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Welcome Page (Reference Image 5 Golden Arch) */}
            {!isOpened && (
                <div
                    className="loading-page"
                    id="welcome"
                    style={{
                        backgroundColor: 'var(--inv-bg)',
                        color: 'var(--inv-text)',
                        opacity: !autoInit || isBooted ? 1 : 0,
                        transition: 'opacity 400ms ease',
                    }}
                >
                    <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto p-3">
                        <div className="inv-filigree-arch-frame inv-arch-bordered text-center px-4 py-4 mx-auto">
                            <FiligreeCrownCrestSvg color="var(--inv-secondary)" />
                            <h2
                                className="mb-3"
                                style={{
                                    fontFamily: 'var(--inv-font-serif)',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'var(--inv-muted)',
                                }}
                            >
                                The Wedding Of
                            </h2>

                            <img
                                ref={registerImageRef}
                                src={content.placeholderImageSrc}
                                data-src={content.heroPhotoSrc}
                                alt="background"
                                className="img-center-crop rounded-circle border border-2 shadow-sm mb-3 mx-auto"
                                style={{ borderColor: 'var(--inv-secondary)' }}
                            />

                            <h2
                                className="mb-2"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2.75rem',
                                    color: 'var(--inv-primary)',
                                }}
                            >
                                {content.coupleNames}
                            </h2>

                            <p
                                className="mb-2"
                                style={{
                                    fontFamily: 'var(--inv-font-serif)',
                                    fontSize: '1rem',
                                    letterSpacing: '0.12em',
                                    color: 'var(--inv-muted)',
                                }}
                            >
                                {content.weddingDateDisplay}
                            </p>

                            <div id="guest-name" data-message={content.guestSalutation}>
                                {content.guestQueryName && (
                                    <div className="m-2">
                                        <small
                                            className="mt-0 mb-1 mx-0 p-0 d-block"
                                            style={{ color: 'var(--inv-muted)' }}
                                        >
                                            {content.guestSalutation}
                                        </small>
                                        <p
                                            className="m-0 p-0 fw-semibold"
                                            style={{ fontSize: '1.25rem', fontFamily: 'var(--inv-font-serif)' }}
                                        >
                                            {content.guestQueryName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <SwanLakeIllustration color="var(--inv-secondary)" />

                            <button
                                type="button"
                                disabled={isOpened}
                                className="btn rounded-pill shadow-sm mt-2 px-4 py-2 mx-auto"
                                style={{
                                    backgroundColor: 'var(--inv-btn-bg)',
                                    color: 'var(--inv-btn-text)',
                                    fontFamily: 'var(--inv-font-serif)',
                                    letterSpacing: '0.06em',
                                }}
                                onClick={(e) => onOpenInvitation(e.currentTarget)}
                            >
                                <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>Open Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
