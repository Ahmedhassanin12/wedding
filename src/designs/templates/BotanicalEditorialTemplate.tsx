import React from 'react';
import {
    BotanicalKnotDivider,
    FloatingPetalsOverlay,
    InvitationCountdown,
    LoveStoryVideoCard,
    ScallopedLaceVerseCard,
} from '../components/OrnamentalSvgs';
import type { InvitationTemplateProps } from '../types';

/**
 * Botanical Sage & Architectural Arch Template
 * Contemporary luxury magazine layout featuring numbered editorial chapters,
 * asymmetric pill-arch imagery, sage-emerald & warm alabaster palette, and 4-card countdown grid.
 */
export const BotanicalEditorialTemplate: React.FC<InvitationTemplateProps> = ({
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
        <div className="inv-design-botanical-editorial">
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
                        className="position-relative d-flex justify-content-center align-items-center vh-100 p-5"
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
                                                style={{ maskImage: 'none', opacity: '20%' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className="p-5 text-start position-relative z-1 shadow-sm"
                            style={{
                                backgroundColor: 'var(--inv-surface)',
                                borderLeft: '4px solid var(--inv-primary)',
                                maxWidth: '480px',
                            }}
                        >
                            <small
                                className="d-block text-uppercase mb-2"
                                style={{ letterSpacing: '0.28em', color: 'var(--inv-secondary)', fontSize: '0.72rem' }}
                            >
                                Issue No. 01 — The Wedding Editorial
                            </small>
                            <h2
                                className="mb-3"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2.8rem',
                                    color: 'var(--inv-primary)',
                                }}
                            >
                                {content.coupleNames}
                            </h2>
                            <p className="m-0" style={{ color: 'var(--inv-muted)', letterSpacing: '0.06em' }}>
                                {content.weddingDateDisplay} · {content.locationAddress}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile / Scroll Column */}
                <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
                    <main tabIndex={0}>
                        {/* Chapter 01: Hero */}
                        <section
                            ref={registerSectionRef}
                            id="home"
                            className="py-5 px-4"
                            style={{
                                backgroundColor: 'var(--inv-surface)',
                                borderBottom: '1px solid var(--inv-border)',
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span
                                    className="text-uppercase"
                                    style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--inv-muted)' }}
                                >
                                    01 / THE UNION
                                </span>
                                <h1
                                    className="m-0 text-uppercase"
                                    style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--inv-primary)' }}
                                >
                                    Wedding Invitation
                                </h1>
                            </div>

                            <div className="text-center my-4">
                                <div
                                    className="mx-auto p-2 d-inline-block"
                                    style={{
                                        borderRadius: '999px',
                                        border: '1px solid var(--inv-secondary)',
                                    }}
                                >
                                    <img
                                        ref={registerImageRef}
                                        src={content.placeholderImageSrc}
                                        data-src={content.heroPhotoSrc}
                                        alt="bg"
                                        onClick={onOpenImageModal}
                                        className="img-center-crop cursor-pointer d-block"
                                        style={{ borderRadius: '999px' }}
                                    />
                                </div>

                                <h2
                                    className="mt-4 mb-2"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '2.5rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    {content.coupleNames}
                                </h2>

                                <p
                                    className="mb-3"
                                    style={{
                                        fontFamily: 'var(--inv-font-serif)',
                                        fontSize: '1.05rem',
                                        color: 'var(--inv-muted)',
                                    }}
                                >
                                    {content.weddingDateTimeDisplay}
                                </p>

                                <button
                                    type="button"
                                    onClick={onSaveToCalendar}
                                    className="btn btn-sm rounded-0 px-4 py-2 text-uppercase"
                                    style={{
                                        backgroundColor: 'var(--inv-btn-bg)',
                                        color: 'var(--inv-btn-text)',
                                        letterSpacing: '0.12em',
                                        fontSize: '0.74rem',
                                    }}
                                >
                                    <i className="fa-solid fa-calendar-check me-2"></i>Save to Google Calendar
                                </button>
                            </div>
                        </section>

                        {/* Chapter 02: The Couple */}
                        <section
                            ref={registerSectionRef}
                            id="bride"
                            className="py-5 px-4"
                            style={{
                                backgroundColor: 'var(--inv-bg)',
                                borderBottom: '1px solid var(--inv-border)',
                            }}
                        >
                            <div className="mb-3">
                                <span
                                    className="text-uppercase d-block mb-1"
                                    style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--inv-muted)' }}
                                >
                                    02 / THE COUPLE
                                </span>
                                <h2
                                    className="m-0"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '1.85rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Peace, Mercy, and Blessings Be Upon You
                                </h2>
                                <p className="mt-2 mb-0" style={{ fontSize: '0.92rem', color: 'var(--inv-muted)' }}>
                                    With all due respect, we cordially invite you to attend our wedding celebration:
                                </p>
                            </div>

                            {tokens.showVerseCard && (
                                <ScallopedLaceVerseCard
                                    verseText={content.verseText}
                                    verseSource={content.verseSource}
                                    showOrnateFrame={tokens.showOrnateFrame}
                                />
                            )}

                            <div className="row g-3 mt-2 text-center">
                                <div className="col-6">
                                    <div
                                        className="p-3 h-100 rounded-4"
                                        style={{
                                            backgroundColor: 'var(--inv-surface)',
                                            border: '1px solid var(--inv-border)',
                                        }}
                                    >
                                        <img
                                            ref={registerImageRef}
                                            src={content.placeholderImageSrc}
                                            data-src={content.groomPhotoSrc}
                                            alt="groom"
                                            onClick={onOpenImageModal}
                                            className="img-fluid rounded-circle mb-2 cursor-pointer"
                                            style={{
                                                width: '6.5rem',
                                                height: '6.5rem',
                                                objectFit: 'cover',
                                                border: '2px solid var(--inv-secondary)',
                                            }}
                                        />
                                        <small
                                            className="d-block text-uppercase"
                                            style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--inv-muted)' }}
                                        >
                                            The Groom
                                        </small>
                                        <h3
                                            className="m-0 mt-1"
                                            style={{
                                                fontFamily: 'var(--inv-font-display)',
                                                fontSize: '1.45rem',
                                                color: 'var(--inv-primary)',
                                            }}
                                        >
                                            {content.groomName}
                                        </h3>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div
                                        className="p-3 h-100 rounded-4"
                                        style={{
                                            backgroundColor: 'var(--inv-surface)',
                                            border: '1px solid var(--inv-border)',
                                        }}
                                    >
                                        <img
                                            ref={registerImageRef}
                                            src={content.placeholderImageSrc}
                                            data-src={content.bridePhotoSrc}
                                            alt="bride"
                                            onClick={onOpenImageModal}
                                            className="img-fluid rounded-circle mb-2 cursor-pointer"
                                            style={{
                                                width: '6.5rem',
                                                height: '6.5rem',
                                                objectFit: 'cover',
                                                border: '2px solid var(--inv-secondary)',
                                            }}
                                        />
                                        <small
                                            className="d-block text-uppercase"
                                            style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--inv-muted)' }}
                                        >
                                            The Bride
                                        </small>
                                        <h3
                                            className="m-0 mt-1"
                                            style={{
                                                fontFamily: 'var(--inv-font-display)',
                                                fontSize: '1.45rem',
                                                color: 'var(--inv-primary)',
                                            }}
                                        >
                                            {content.brideName}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Chapter 03: Love Story */}
                        {Boolean(content.videoSrc?.trim()) && (
                            <section
                                ref={registerSectionRef}
                                className="py-4 px-4"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    borderBottom: '1px solid var(--inv-border)',
                                }}
                            >
                                <span
                                    className="text-uppercase d-block mb-2"
                                    style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--inv-muted)' }}
                                >
                                    03 / OUR FILM
                                </span>
                                <LoveStoryVideoCard
                                    videoSrc={content.videoSrc}
                                    videoRef={videoRef}
                                    videoState={videoState}
                                />
                            </section>
                        )}

                        {/* Chapter 04: The Gathering & Countdown */}
                        <section
                            ref={registerSectionRef}
                            id="wedding-date"
                            className="py-5 px-4 text-center"
                            style={{ backgroundColor: 'var(--inv-bg)' }}
                        >
                            <span
                                className="text-uppercase d-block mb-1"
                                style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--inv-muted)' }}
                            >
                                04 / THE GATHERING
                            </span>
                            <h2
                                className="mb-3"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2rem',
                                    color: 'var(--inv-primary)',
                                }}
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
                                className="p-4 rounded-4 text-center my-3"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    border: '1px solid var(--inv-border)',
                                }}
                            >
                                <h3
                                    className="mb-2"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '1.65rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Wedding Ceremony
                                </h3>
                                <p className="m-0 fw-semibold">{content.weddingDateDisplay}</p>
                                <p className="mb-3" style={{ color: 'var(--inv-muted)' }}>
                                    {content.ceremonyTimeDisplay}
                                </p>

                                <a
                                    href={content.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm rounded-0 px-4 py-2 text-uppercase mb-2"
                                    style={{
                                        backgroundColor: 'var(--inv-btn-bg)',
                                        color: 'var(--inv-btn-text)',
                                        letterSpacing: '0.1em',
                                        fontSize: '0.74rem',
                                    }}
                                >
                                    <i className="fa-solid fa-map-location-dot me-2"></i>View on Google Maps
                                </a>
                                <small className="d-block mt-1" style={{ color: 'var(--inv-muted)' }}>
                                    {content.locationAddress}
                                </small>
                            </div>

                            <p className="pt-3 mb-0" style={{ fontSize: '0.9rem', color: 'var(--inv-muted)' }}>
                                Thank you for your attention and your blessings, which are a great joy and honor to us.
                            </p>
                        </section>
                    </main>
                </div>
            </div>

            {/* Welcome Page */}
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
                        <div
                            className="p-4 text-center shadow-sm mx-auto"
                            style={{
                                backgroundColor: 'var(--inv-surface)',
                                border: '1px solid var(--inv-border)',
                                maxWidth: '380px',
                                width: '100%',
                            }}
                        >
                            <small
                                className="d-block text-uppercase mb-3"
                                style={{ letterSpacing: '0.24em', color: 'var(--inv-secondary)', fontSize: '0.72rem' }}
                            >
                                The Wedding Of
                            </small>

                            <img
                                ref={registerImageRef}
                                src={content.placeholderImageSrc}
                                data-src={content.heroPhotoSrc}
                                alt="background"
                                className="img-center-crop mb-3 mx-auto d-block"
                                style={{ borderRadius: '999px', border: '2px solid var(--inv-secondary)' }}
                            />

                            <h2
                                className="mb-2"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2.35rem',
                                    color: 'var(--inv-primary)',
                                }}
                            >
                                {content.coupleNames}
                            </h2>

                            <div id="guest-name" data-message={content.guestSalutation}>
                                {content.guestQueryName && (
                                    <div className="m-2">
                                        <small className="mt-0 mb-1 mx-0 p-0 d-block" style={{ color: 'var(--inv-muted)' }}>
                                            {content.guestSalutation}
                                        </small>
                                        <p className="m-0 p-0 fw-semibold" style={{ fontSize: '1.2rem' }}>
                                            {content.guestQueryName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isOpened}
                                className="btn rounded-0 mt-3 px-4 py-2 text-uppercase"
                                style={{
                                    backgroundColor: 'var(--inv-btn-bg)',
                                    color: 'var(--inv-btn-text)',
                                    letterSpacing: '0.14em',
                                    fontSize: '0.78rem',
                                }}
                                onClick={(e) => onOpenInvitation(e.currentTarget)}
                            >
                                <i className="fa-solid fa-envelope-open me-2"></i>Open Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
