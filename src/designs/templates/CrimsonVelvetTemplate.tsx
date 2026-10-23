import React from 'react';
import {
    BotanicalKnotDivider,
    FloatingPetalsOverlay,
    GoldHeartWaxSealSvg,
    InvitationCountdown,
    LoveStoryVideoCard,
    ScallopedLaceVerseCard,
} from '../components/OrnamentalSvgs';
import type { InvitationTemplateProps } from '../types';

/**
 * Crimson Velvet & Gold Wax Seal Template
 * Inspired by Reference Images 2, 3 & 4:
 * - Welcome screen: Deep burgundy velvet background with a 3D floral-lace envelope sealed by a gold heart wax seal
 * - Hero section: Ivory parchment invitation letter emerging from the burgundy lace envelope pocket
 *   with stacked expressive couple names and a 3-column vertical-divider date header
 */
export const CrimsonVelvetTemplate: React.FC<InvitationTemplateProps> = ({
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
    const dateParts = content.weddingDateDisplay.split(',');
    const dayOfWeekPart = dateParts[0]?.trim() || 'Thursday';
    const dateMonthYearPart = dateParts.slice(1).join(',').trim() || content.weddingDateDisplay;

    return (
        <div className="inv-design-crimson-velvet">
            {tokens.showFloatingPetals && <FloatingPetalsOverlay variant="sparkles" />}

            {/* Root Invitation */}
            <div
                className={isOpened ? 'row m-0 p-0' : 'row m-0 p-0 opacity-0'}
                id="root"
                style={{
                    backgroundColor: 'var(--inv-bg)',
                    color: 'var(--inv-surface)',
                    fontFamily: 'var(--inv-font-body)',
                }}
            >
                {/* Desktop Showcase */}
                <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
                    <div
                        className="position-relative d-flex justify-content-center align-items-center vh-100 p-4"
                        style={{
                            background: 'radial-gradient(circle at center, #4a1521 0%, var(--inv-bg) 75%)',
                        }}
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
                                                style={{ maskImage: 'none', opacity: '18%' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className="text-center px-5 py-5 rounded-4 shadow-lg position-relative z-1"
                            style={{
                                backgroundColor: 'var(--inv-surface)',
                                color: 'var(--inv-text)',
                                border: '2px solid var(--inv-secondary)',
                                maxWidth: '460px',
                            }}
                        >
                            <div className="mb-3">
                                <GoldHeartWaxSealSvg size={58} />
                            </div>
                            <h2
                                className="mb-2 fw-bold"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2.6rem',
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
                                    fontSize: '1.1rem',
                                    color: 'var(--inv-muted)',
                                }}
                            >
                                {content.weddingDateDisplay}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile / Scroll Column */}
                <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
                    <main tabIndex={0}>
                        {/* Hero: Unfolded Parchment Letter Rising from Burgundy Lace Envelope (Reference Images 3 & 4) */}
                        <section
                            ref={registerSectionRef}
                            id="home"
                            className="position-relative overflow-hidden py-5 px-3"
                            style={{
                                background: 'radial-gradient(circle at 50% 25%, #4a1521 0%, var(--inv-bg) 85%)',
                            }}
                        >
                            <div className="inv-velvet-envelope-stage mx-auto">
                                {/* Parchment Invitation Card Emerging from Envelope */}
                                <div className="inv-parchment-letter-card text-center px-3 pt-4 pb-5 shadow-lg">
                                    <h1
                                        className="text-uppercase mb-3"
                                        style={{
                                            fontFamily: 'var(--inv-font-serif)',
                                            fontSize: '0.8rem',
                                            letterSpacing: '0.24em',
                                            color: 'var(--inv-muted)',
                                        }}
                                    >
                                        Wedding Invitation
                                    </h1>

                                    <img
                                        ref={registerImageRef}
                                        src={content.placeholderImageSrc}
                                        data-src={content.heroPhotoSrc}
                                        alt="bg"
                                        onClick={onOpenImageModal}
                                        className="img-center-crop rounded-circle shadow-sm mb-3 mx-auto cursor-pointer"
                                        style={{
                                            width: '7.5rem',
                                            height: '7.5rem',
                                            border: '2px solid var(--inv-secondary)',
                                        }}
                                    />

                                    {/* Stacked Couple Names (Reference Image 3) */}
                                    <div className="my-2">
                                        <h2
                                            className="m-0 fw-bold"
                                            style={{
                                                fontFamily: 'var(--inv-font-display)',
                                                fontSize: '2.45rem',
                                                color: 'var(--inv-primary)',
                                            }}
                                        >
                                            {content.groomName}
                                        </h2>
                                        <span
                                            className="d-block my-1"
                                            style={{
                                                fontFamily: 'var(--inv-font-serif)',
                                                fontSize: '1.5rem',
                                                color: 'var(--inv-secondary)',
                                            }}
                                        >
                                            &amp;
                                        </span>
                                        <h2
                                            className="m-0 fw-bold"
                                            style={{
                                                fontFamily: 'var(--inv-font-display)',
                                                fontSize: '2.45rem',
                                                color: 'var(--inv-primary)',
                                            }}
                                        >
                                            {content.brideName}
                                        </h2>
                                        <span className="visually-hidden">{content.coupleNames}</span>
                                    </div>

                                    <hr
                                        className="w-50 mx-auto my-3"
                                        style={{ borderColor: 'var(--inv-secondary)', opacity: 0.45 }}
                                    />

                                    {/* 3-Column Vertical-Divider Date Header (Reference Image 3) */}
                                    <div
                                        className="d-flex justify-content-center align-items-center text-center my-3 px-2"
                                        style={{
                                            fontFamily: 'var(--inv-font-serif)',
                                            color: 'var(--inv-primary)',
                                        }}
                                    >
                                        <div className="px-2 flex-fill">
                                            <small className="d-block fw-semibold" style={{ fontSize: '0.82rem' }}>
                                                {dayOfWeekPart}
                                            </small>
                                        </div>
                                        <div
                                            className="px-3 border-start border-end"
                                            style={{ borderColor: 'var(--inv-border)' }}
                                        >
                                            <span className="d-block fw-bold" style={{ fontSize: '1.1rem' }}>
                                                {dateMonthYearPart}
                                            </span>
                                        </div>
                                        <div className="px-2 flex-fill">
                                            <small className="d-block fw-semibold" style={{ fontSize: '0.82rem' }}>
                                                {content.ceremonyTimeDisplay.split('-')[0]?.trim()}
                                            </small>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onSaveToCalendar}
                                        className="btn btn-sm rounded-pill px-3 py-1 mt-2"
                                        style={{
                                            backgroundColor: 'var(--inv-primary)',
                                            color: 'var(--inv-surface)',
                                            border: '1px solid var(--inv-secondary)',
                                            fontSize: '0.78rem',
                                        }}
                                    >
                                        <i className="fa-solid fa-calendar-check me-2"></i>Save to Google Calendar
                                    </button>
                                </div>

                                {/* Burgundy Floral-Lace Envelope Pocket Overlay at Bottom */}
                                <div className="inv-velvet-envelope-pocket text-center pt-4 pb-3 px-3">
                                    <a
                                        href="#bride"
                                        className="d-inline-block rounded-pill px-4 py-1 text-decoration-none shadow-sm"
                                        style={{
                                            backgroundColor: 'var(--inv-surface)',
                                            color: 'var(--inv-primary)',
                                            fontFamily: 'var(--inv-font-serif)',
                                            fontSize: '0.82rem',
                                            border: '1px solid var(--inv-secondary)',
                                        }}
                                    >
                                        • Scroll Down •
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Couple Section */}
                        <section
                            ref={registerSectionRef}
                            id="bride"
                            className="py-4 px-3 text-center"
                            style={{ backgroundColor: 'var(--inv-bg)' }}
                        >
                            <div
                                className="container p-4 rounded-4 shadow"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    color: 'var(--inv-text)',
                                    border: '1.5px solid var(--inv-secondary)',
                                }}
                            >
                                <h2
                                    className="py-2 m-0"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '1.9rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Peace, Mercy, and Blessings Be Upon You
                                </h2>
                                <p
                                    className="pb-3 px-2 m-0"
                                    style={{ fontFamily: 'var(--inv-font-serif)', fontSize: '0.98rem' }}
                                >
                                    With all due respect, we cordially invite you to attend our wedding celebration:
                                </p>

                                <div className="py-2">
                                    <img
                                        ref={registerImageRef}
                                        src={content.placeholderImageSrc}
                                        data-src={content.groomPhotoSrc}
                                        alt="groom"
                                        onClick={onOpenImageModal}
                                        className="img-center-crop rounded-circle shadow my-3 mx-auto cursor-pointer"
                                        style={{ border: '3px solid var(--inv-secondary)' }}
                                    />
                                    <h3
                                        className="m-0 fw-bold"
                                        style={{
                                            fontFamily: 'var(--inv-font-display)',
                                            fontSize: '2rem',
                                            color: 'var(--inv-primary)',
                                        }}
                                    >
                                        {content.groomName}
                                    </h3>
                                </div>

                                <div className="my-3">
                                    <GoldHeartWaxSealSvg size={48} />
                                </div>

                                <div className="py-2">
                                    <img
                                        ref={registerImageRef}
                                        src={content.placeholderImageSrc}
                                        data-src={content.bridePhotoSrc}
                                        alt="bride"
                                        onClick={onOpenImageModal}
                                        className="img-center-crop rounded-circle shadow my-3 mx-auto cursor-pointer"
                                        style={{ border: '3px solid var(--inv-secondary)' }}
                                    />
                                    <h3
                                        className="m-0 fw-bold"
                                        style={{
                                            fontFamily: 'var(--inv-font-display)',
                                            fontSize: '2rem',
                                            color: 'var(--inv-primary)',
                                        }}
                                    >
                                        {content.brideName}
                                    </h3>
                                </div>
                            </div>
                        </section>

                        {/* Love Story Video */}
                        {Boolean(content.videoSrc?.trim()) && (
                            <section
                                ref={registerSectionRef}
                                className="py-3 px-3"
                                style={{ backgroundColor: 'var(--inv-bg)' }}
                            >
                                <div className="container px-0">
                                    <LoveStoryVideoCard
                                        videoSrc={content.videoSrc}
                                        videoRef={videoRef}
                                        videoState={videoState}
                                    />
                                </div>
                            </section>
                        )}

                        {/* Countdown & Ceremony Details */}
                        <section
                            ref={registerSectionRef}
                            id="wedding-date"
                            className="py-4 px-3 text-center"
                            style={{ backgroundColor: 'var(--inv-bg)' }}
                        >
                            <div
                                className="container p-4 rounded-4 shadow"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    color: 'var(--inv-text)',
                                    border: '1.5px solid var(--inv-secondary)',
                                }}
                            >
                                {tokens.showVerseCard && (
                                    <ScallopedLaceVerseCard
                                        verseText={content.verseText}
                                        verseSource={content.verseSource}
                                        showOrnateFrame={tokens.showOrnateFrame}
                                    />
                                )}

                                <h2
                                    className="py-2 m-0"
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

                                <h3
                                    className="m-0 py-2"
                                    style={{
                                        fontFamily: 'var(--inv-font-display)',
                                        fontSize: '1.85rem',
                                        color: 'var(--inv-primary)',
                                    }}
                                >
                                    Wedding Ceremony
                                </h3>
                                <p className="m-0 fw-semibold">{content.weddingDateDisplay}</p>
                                <p className="mb-3">{content.ceremonyTimeDisplay}</p>

                                <a
                                    href={content.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm rounded-pill shadow mb-2 px-4 py-2"
                                    style={{
                                        backgroundColor: 'var(--inv-primary)',
                                        color: 'var(--inv-surface)',
                                        border: '1px solid var(--inv-secondary)',
                                    }}
                                >
                                    <i className="fa-solid fa-map-location-dot me-2"></i>View on Google Maps
                                </a>
                                <small className="d-block my-1" style={{ color: 'var(--inv-muted)' }}>
                                    {content.locationAddress}
                                </small>

                                <hr
                                    className="my-4"
                                    style={{ borderColor: 'var(--inv-secondary)', opacity: 0.35 }}
                                />

                                <p className="mb-2" style={{ fontSize: '0.95rem' }}>
                                    Thank you for your attention and your blessings, which are a great joy and honor to
                                    us.
                                </p>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Sealed Lace Envelope Welcome Screen (Reference Image 2) */}
            {!isOpened && (
                <div
                    className="loading-page"
                    id="welcome"
                    style={{
                        background: 'radial-gradient(circle at 50% 35%, #4a1521 0%, #1f060b 85%)',
                        color: 'var(--inv-surface)',
                        opacity: !autoInit || isBooted ? 1 : 0,
                        transition: 'opacity 400ms ease',
                    }}
                >
                    <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto p-3">
                        <div className="d-flex flex-column align-items-center text-center">
                            <small
                                className="text-uppercase mb-2"
                                style={{
                                    letterSpacing: '0.24em',
                                    color: 'var(--inv-secondary)',
                                    fontFamily: 'var(--inv-font-serif)',
                                }}
                            >
                                The Wedding Of
                            </small>

                            <h2
                                className="mb-3"
                                style={{
                                    fontFamily: 'var(--inv-font-display)',
                                    fontSize: '2.35rem',
                                    color: 'var(--inv-surface)',
                                }}
                            >
                                {content.coupleNames}
                            </h2>

                            {/* Hidden preload hero image ref so image cache count stays consistent */}
                            <img
                                ref={registerImageRef}
                                src={content.placeholderImageSrc}
                                data-src={content.heroPhotoSrc}
                                alt="background"
                                className="d-none"
                            />

                            {/* 3D Burgundy Floral-Lace Envelope with Gold Heart Wax Seal (Reference Image 2) */}
                            <div
                                className="inv-sealed-lace-envelope my-3 position-relative d-flex justify-content-center align-items-center cursor-pointer"
                                onClick={(e) => {
                                    const btn = e.currentTarget.parentElement?.querySelector('button');
                                    if (btn) {
                                        onOpenInvitation(btn);
                                    }
                                }}
                            >
                                <div className="inv-envelope-flap-top" />
                                <div className="inv-envelope-flap-left" />
                                <div className="inv-envelope-flap-right" />
                                <div className="inv-envelope-flap-bottom" />
                                <div className="position-relative z-2 inv-wax-seal-pulse">
                                    <GoldHeartWaxSealSvg size={78} />
                                </div>
                            </div>

                            <div id="guest-name" data-message={content.guestSalutation} className="my-2">
                                {content.guestQueryName && (
                                    <div className="m-2">
                                        <small
                                            className="mt-0 mb-1 mx-0 p-0 d-block"
                                            style={{ color: 'var(--inv-secondary)' }}
                                        >
                                            {content.guestSalutation}
                                        </small>
                                        <p className="m-0 p-0 fw-semibold" style={{ fontSize: '1.25rem' }}>
                                            {content.guestQueryName}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isOpened}
                                className="btn rounded-pill shadow-lg mt-2 px-4 py-2 mx-auto"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    color: 'var(--inv-primary)',
                                    border: '1.5px solid var(--inv-secondary)',
                                    fontFamily: 'var(--inv-font-serif)',
                                    fontWeight: 600,
                                }}
                                onClick={(e) => onOpenInvitation(e.currentTarget)}
                            >
                                <i className="fa-solid fa-envelope-open me-2"></i>• Open Invitation •
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
