import React, { useEffect, useState } from 'react';
import type { CountdownValues } from '../../app/guest/useGuestInvitation';
import type { VideoSnapshot } from '../../app/guest/video';
import type { CountdownStyleVariant } from '../types';

const HEART_SVG_PATH =
    'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15';

export interface AnimatedHeartSvgProps {
    delayMs: number;
    style: React.CSSProperties;
}

export const AnimatedHeartSvg: React.FC<AnimatedHeartSvgProps> = ({ delayMs, style }) => {
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

export const WaveSeparator: React.FC<{ pathD: string }> = ({ pathD }) => (
    <div className="svg-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="color-theme-svg no-gap-bottom">
            <path fill="currentColor" fillOpacity="1" d={pathD} />
        </svg>
    </div>
);

/**
 * Delicate horizontal rule with central floral knot ornament (Reference Image 1).
 */
export const BotanicalKnotDivider: React.FC<{ color?: string }> = ({ color = 'var(--inv-secondary)' }) => (
    <div className="d-flex justify-content-center align-items-center my-3" aria-hidden="true">
        <svg width="220" height="24" viewBox="0 0 220 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="12" x2="92" y2="12" stroke={color} strokeWidth="1" strokeOpacity="0.65" />
            <line x1="128" y1="12" x2="210" y2="12" stroke={color} strokeWidth="1" strokeOpacity="0.65" />
            <path
                d="M110 4C112.5 8 112.5 16 110 20C107.5 16 107.5 8 110 4Z"
                stroke={color}
                strokeWidth="1.2"
            />
            <path
                d="M102 12C106 9.5 114 9.5 118 12C114 14.5 106 14.5 102 12Z"
                stroke={color}
                strokeWidth="1.2"
            />
            <circle cx="98" cy="12" r="1.8" fill={color} />
            <circle cx="122" cy="12" r="1.8" fill={color} />
        </svg>
    </div>
);

/**
 * Scalloped vintage floral-lace verse card inspired by Reference Image 1 (Surah Ar-Rum 30:21).
 */
export const ScallopedLaceVerseCard: React.FC<{
    verseText: string;
    verseSource: string;
    showOrnateFrame?: boolean;
}> = ({ verseText, verseSource, showOrnateFrame = true }) => (
    <div className={`inv-lace-verse-wrapper mx-auto my-3 ${showOrnateFrame ? 'inv-lace-ornate' : ''}`}>
        <div className="inv-lace-verse-inner text-center px-3 py-4">
            <p
                className="mb-2 fst-italic"
                style={{
                    fontFamily: 'var(--inv-font-serif)',
                    fontSize: '0.98rem',
                    lineHeight: 1.65,
                    color: 'var(--inv-text)',
                }}
            >
                {verseText}
            </p>
            <small
                className="d-block fw-semibold"
                style={{
                    fontFamily: 'var(--inv-font-serif)',
                    letterSpacing: '0.16em',
                    fontSize: '0.74rem',
                    color: 'var(--inv-muted)',
                }}
            >
                {verseSource}
            </small>
        </div>
        {showOrnateFrame && (
            <svg
                viewBox="0 0 360 44"
                className="w-100 d-block inv-lace-scallop-svg"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <pattern id="laceScallopPattern" x="0" y="0" width="60" height="44" patternUnits="userSpaceOnUse">
                        <path
                            d="M0,0 Q30,42 60,0"
                            fill="var(--inv-surface)"
                            stroke="var(--inv-border)"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M6,4 Q30,36 54,4"
                            fill="none"
                            stroke="var(--inv-secondary)"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                        />
                        <circle cx="30" cy="15" r="5" fill="var(--inv-secondary)" fillOpacity="0.28" />
                        <circle cx="30" cy="15" r="2.2" fill="var(--inv-primary)" fillOpacity="0.5" />
                        <circle cx="15" cy="11" r="2" fill="var(--inv-secondary)" fillOpacity="0.35" />
                        <circle cx="45" cy="11" r="2" fill="var(--inv-secondary)" fillOpacity="0.35" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="360" height="44" fill="url(#laceScallopPattern)" />
            </svg>
        )}
    </div>
);

/**
 * Multi-variant countdown component supporting:
 * - 'colon': Open editorial serif countdown `49 : 21 : 51 : 51` (Reference Image 1)
 * - 'pill': Classic bordered pill bar
 * - 'cards': Architectural 4-card grid
 * Always preserves `#day`, `#hour`, `#minute`, `#second` IDs.
 */
export const InvitationCountdown: React.FC<{
    countdown: CountdownValues;
    variant: CountdownStyleVariant;
    heading?: string;
}> = ({ countdown, variant, heading }) => {
    if (variant === 'colon') {
        return (
            <div className="inv-countdown-colon text-center my-3 py-2">
                {heading && (
                    <p
                        className="mb-2"
                        style={{
                            fontFamily: 'var(--inv-font-display)',
                            fontSize: '2.1rem',
                            color: 'var(--inv-primary)',
                        }}
                    >
                        {heading}
                    </p>
                )}
                <div
                    className="d-flex justify-content-center align-items-baseline gap-2 gap-sm-3"
                    style={{ fontFamily: 'var(--inv-font-serif)', color: 'var(--inv-primary)' }}
                >
                    <div className="text-center px-1">
                        <p className="m-0 fw-normal" style={{ fontSize: '2.35rem', lineHeight: 1.1 }} id="day">
                            {countdown.days}
                        </p>
                        <small
                            className="d-block mt-1"
                            style={{ fontSize: '0.82rem', color: 'var(--inv-muted)', letterSpacing: '0.04em' }}
                        >
                            Days
                        </small>
                    </div>
                    <span style={{ fontSize: '1.85rem', opacity: 0.7 }}>:</span>
                    <div className="text-center px-1">
                        <p className="m-0 fw-normal" style={{ fontSize: '2.35rem', lineHeight: 1.1 }} id="hour">
                            {countdown.hours}
                        </p>
                        <small
                            className="d-block mt-1"
                            style={{ fontSize: '0.82rem', color: 'var(--inv-muted)', letterSpacing: '0.04em' }}
                        >
                            Hours
                        </small>
                    </div>
                    <span style={{ fontSize: '1.85rem', opacity: 0.7 }}>:</span>
                    <div className="text-center px-1">
                        <p className="m-0 fw-normal" style={{ fontSize: '2.35rem', lineHeight: 1.1 }} id="minute">
                            {countdown.minutes}
                        </p>
                        <small
                            className="d-block mt-1"
                            style={{ fontSize: '0.82rem', color: 'var(--inv-muted)', letterSpacing: '0.04em' }}
                        >
                            Minutes
                        </small>
                    </div>
                    <span style={{ fontSize: '1.85rem', opacity: 0.7 }}>:</span>
                    <div className="text-center px-1">
                        <p className="m-0 fw-normal" style={{ fontSize: '2.35rem', lineHeight: 1.1 }} id="second">
                            {countdown.seconds}
                        </p>
                        <small
                            className="d-block mt-1"
                            style={{ fontSize: '0.82rem', color: 'var(--inv-muted)', letterSpacing: '0.04em' }}
                        >
                            Seconds
                        </small>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'cards') {
        const items = [
            { id: 'day', value: countdown.days, label: 'Days' },
            { id: 'hour', value: countdown.hours, label: 'Hours' },
            { id: 'minute', value: countdown.minutes, label: 'Minutes' },
            { id: 'second', value: countdown.seconds, label: 'Seconds' },
        ] as const;

        return (
            <div className="my-3">
                {heading && (
                    <p
                        className="mb-2 text-center"
                        style={{
                            fontFamily: 'var(--inv-font-display)',
                            fontSize: '1.85rem',
                            color: 'var(--inv-primary)',
                        }}
                    >
                        {heading}
                    </p>
                )}
                <div className="row g-2 justify-content-center">
                    {items.map((item) => (
                        <div key={item.id} className="col-3">
                            <div
                                className="p-2 rounded-3 text-center shadow-sm"
                                style={{
                                    backgroundColor: 'var(--inv-surface)',
                                    border: '1px solid var(--inv-border)',
                                }}
                            >
                                <p
                                    className="m-0 fw-semibold"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontFamily: 'var(--inv-font-serif)',
                                        color: 'var(--inv-primary)',
                                    }}
                                    id={item.id}
                                >
                                    {item.value}
                                </p>
                                <small
                                    className="d-block text-uppercase"
                                    style={{
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.08em',
                                        color: 'var(--inv-muted)',
                                    }}
                                >
                                    {item.label}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="border rounded-pill shadow py-2 px-4 mt-2 mb-4"
            style={{ borderColor: 'var(--inv-border)' }}
        >
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
    );
};

/**
 * Ornate Royal Crown Filigree Arch SVG Crest (inspired by Reference Image 5).
 */
export const FiligreeCrownCrestSvg: React.FC<{ color?: string }> = ({ color = 'var(--inv-secondary)' }) => (
    <div className="d-flex justify-content-center mb-1" aria-hidden="true">
        <svg width="180" height="54" viewBox="0 0 180 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M90 4L96 16L108 12L102 24C116 24 132 30 150 46H30C48 30 64 24 78 24L72 12L84 16L90 4Z"
                stroke={color}
                strokeWidth="1.4"
                fill={color}
                fillOpacity="0.12"
            />
            <circle cx="90" cy="4" r="2.5" fill={color} />
            <circle cx="72" cy="11" r="2" fill={color} />
            <circle cx="108" cy="11" r="2" fill={color} />
            <path
                d="M16 50C45 34 70 28 90 28C110 28 135 34 164 50"
                stroke={color}
                strokeWidth="1.2"
                strokeDasharray="3 2"
            />
        </svg>
    </div>
);

/**
 * Serene twin swans on lake illustration inspired by Reference Image 5.
 */
export const SwanLakeIllustration: React.FC<{ color?: string }> = ({ color = 'var(--inv-secondary)' }) => (
    <div className="d-flex justify-content-center my-2" aria-hidden="true">
        <svg width="240" height="68" viewBox="0 0 240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left Swan */}
            <path
                d="M45 46C38 46 32 41 34 35C36 30 48 28 58 31C65 33 74 37 78 43C82 32 82 20 77 15C73 11 67 13 66 18C65 21 67 23 69 24L65 26L62 22C61 14 68 7 76 9C85 11 89 24 84 40C80 46 62 48 45 46Z"
                fill="var(--inv-surface)"
                stroke={color}
                strokeWidth="1.3"
            />
            {/* Right Swan */}
            <path
                d="M195 46C202 46 208 41 206 35C204 30 192 28 182 31C175 33 166 37 162 43C158 32 158 20 163 15C167 11 173 13 174 18C175 21 173 23 171 24L175 26L178 22C179 14 172 7 164 9C155 11 151 24 156 40C160 46 178 48 195 46Z"
                fill="var(--inv-surface)"
                stroke={color}
                strokeWidth="1.3"
            />
            {/* Water Ripples */}
            <path d="M22 52Q70 56 118 52T218 52" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
            <path d="M48 59Q95 62 142 59T196 59" stroke={color} strokeWidth="0.9" strokeOpacity="0.4" />
        </svg>
    </div>
);

/**
 * 3D-styled Metallic Gold Heart Wax Seal SVG (inspired by Reference Image 2).
 */
export const GoldHeartWaxSealSvg: React.FC<{ size?: number }> = ({ size = 76 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inv-wax-seal-svg"
        aria-hidden="true"
    >
        <defs>
            <radialGradient id="waxGoldGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fae08c" />
                <stop offset="45%" stopColor="#d4af37" />
                <stop offset="80%" stopColor="#9e741c" />
                <stop offset="100%" stopColor="#6e4d0c" />
            </radialGradient>
        </defs>
        <path
            d="M42 4C49 3 56 7 62 11C69 15 76 20 79 28C82 36 80 45 78 53C76 61 73 70 66 75C59 80 50 81 42 81C34 81 25 79 18 74C11 69 7 61 5 53C3 45 3 36 6 28C9 20 16 14 23 10C30 6 35 5 42 4Z"
            fill="url(#waxGoldGrad)"
            stroke="#5c3e08"
            strokeWidth="1.5"
        />
        <circle cx="42" cy="42" r="28" stroke="#6e4d0c" strokeWidth="1.6" strokeOpacity="0.7" fill="none" />
        <path
            d="M42 57C42 57 26 45 26 34C26 28.5 30.5 25 35 25C38.5 25 41 27.5 42 30.5C43 27.5 45.5 25 49 25C53.5 25 58 28.5 58 34C58 45 42 57 42 57Z"
            stroke="#593b06"
            strokeWidth="2.4"
            fill="#eac463"
            fillOpacity="0.35"
        />
    </svg>
);

/**
 * Floating rose-gold petals / gold sparkles overlay (Reference Images 1, 3, 4, 5).
 */
export const FloatingPetalsOverlay: React.FC<{ variant?: 'petals' | 'sparkles' }> = ({ variant = 'petals' }) => {
    const items = [
        { left: '8%', delay: '0s', duration: '9s', size: 10 },
        { left: '22%', delay: '1.8s', duration: '11s', size: 8 },
        { left: '38%', delay: '3.4s', duration: '8.5s', size: 12 },
        { left: '54%', delay: '0.9s', duration: '10.5s', size: 9 },
        { left: '71%', delay: '2.5s', duration: '9.5s', size: 11 },
        { left: '86%', delay: '4.1s', duration: '12s', size: 8 },
    ];

    return (
        <div className="inv-petals-overlay" aria-hidden="true">
            {items.map((item, idx) => (
                <span
                    key={idx}
                    className={`inv-petal-particle ${variant === 'sparkles' ? 'inv-sparkle-dot' : ''}`}
                    style={{
                        left: item.left,
                        width: `${item.size}px`,
                        height: `${variant === 'sparkles' ? item.size : Math.round(item.size * 0.7)}px`,
                        animationDelay: item.delay,
                        animationDuration: item.duration,
                    }}
                />
            ))}
        </div>
    );
};

/**
 * Reusable Love Story Video Card that preserves `#video-love-stroy` and `#video-love-stroy-loading`
 * while adapting to the active design template's surface and border tokens.
 */
export const LoveStoryVideoCard: React.FC<{
    videoSrc: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoState: VideoSnapshot;
    title?: string;
}> = ({ videoSrc, videoRef, videoState, title = 'Our Love Story' }) => {
    const isVideoOverlayVisible = videoState.status === 'loading' || videoState.status === 'error';

    return (
        <div
            className="rounded-5 shadow-sm p-3"
            style={{
                backgroundColor: 'var(--inv-surface)',
                border: '1px solid var(--inv-border)',
                color: 'var(--inv-text)',
            }}
        >
            <h2
                className="font-esthetic text-center py-2 mb-2"
                style={{
                    fontSize: '2.125rem',
                    fontFamily: 'var(--inv-font-display)',
                    color: 'var(--inv-primary)',
                }}
            >
                {title}
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
                                        backgroundColor: videoState.errorText ? 'red' : 'var(--inv-primary)',
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
    );
};
