import React, { useEffect } from 'react';
import { guest } from '../app/guest/guest';
import { theme } from '../common/theme';

export interface GuestInvitationProps {
    coupleNames?: string;
    groomName?: string;
    brideName?: string;
    weddingDateDisplay?: string;
    weddingDateTimeDisplay?: string;
    ceremonyTimeDisplay?: string;
    locationAddress?: string;
    googleMapsUrl?: string;
    videoSrc?: string;
    autoInit?: boolean;
}

export const GuestInvitationView: React.FC<GuestInvitationProps> = ({
    coupleNames = 'Ahmed & Nermin',
    groomName = 'Ahmed',
    brideName = 'Nermin',
    weddingDateDisplay = 'Thursday, 8 October 2026',
    weddingDateTimeDisplay = 'Thursday, 8 October 2026 · 9:00 PM',
    ceremonyTimeDisplay = '9:00 PM - Until finished',
    locationAddress = 'Rotana High Class Village, Zifta-Tanta Road .',
    googleMapsUrl = 'https://maps.app.goo.gl/z9SuGTQF8qQdhhKm7?g_st=aw',
    videoSrc = './assets/video/265501_tiny.mp4',
    autoInit = false,
}) => {
    useEffect(() => {
        if (autoInit) {
            window.undangan = guest.init();
        }
    }, [autoInit]);

    return (
        <>
            {/* Root Invitation */}
            <div className="row m-0 p-0 opacity-0" id="root">
                {/* Desktop mode */}
                <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
                    <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
                        <div className="d-flex position-absolute w-100 h-100">
                            <div className="position-relative overflow-hidden vw-100">
                                {[7, 8, 9].map((seed) => (
                                    <div
                                        key={seed}
                                        className="position-absolute h-100 w-100 slide-desktop"
                                        style={{ opacity: 0 }}
                                    >
                                        <img
                                            src="./assets/images/placeholder.webp"
                                            data-src={`https://picsum.photos/1000/1000?random=${seed}`}
                                            alt="bg"
                                            className="bg-cover-home"
                                            style={{ maskImage: 'none', opacity: '30%' }}
                                        />
                                    </div>
                                ))}
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
                        <section id="home" className="bg-light-dark position-relative overflow-hidden p-0 m-0">
                            <img
                                src="./assets/images/placeholder.webp"
                                data-src="./assets/images/3.jpeg"
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
                                    src="./assets/images/placeholder.webp"
                                    data-src="./assets/images/3.jpeg"
                                    alt="bg"
                                    onClick={(e) => guest.modal(e.currentTarget)}
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

                        {/* Bride */}
                        <section className="bg-white-black text-center" id="bride">
                            <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2rem' }}>
                                Peace, Mercy, and Blessings Be Upon You
                            </h2>
                            <p className="pb-4 px-2 m-0" style={{ fontSize: '0.95rem' }}>
                                With all due respect, we cordially invite you to attend our wedding celebration:
                            </p>

                            <div className="overflow-x-hidden pb-4">
                                <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
                                    <img
                                        src="./assets/images/placeholder.webp"
                                        data-src="./assets/images/2.jpeg"
                                        alt="groom"
                                        onClick={(e) => guest.modal(e.currentTarget)}
                                        className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                    />
                                    <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                                        {groomName}
                                    </h2>
                                </div>

                                <h2 className="font-esthetic mt-4" style={{ fontSize: '4.5rem' }}>
                                    &amp;
                                </h2>

                                <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
                                    <img
                                        src="./assets/images/placeholder.webp"
                                        data-src="./assets/images/1.jpeg"
                                        alt="bride"
                                        onClick={(e) => guest.modal(e.currentTarget)}
                                        className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                                    />
                                    <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                                        {brideName}
                                    </h2>
                                </div>
                            </div>
                        </section>

                        {/* Love Story */}
                        <section className="bg-light-dark pt-2 pb-4">
                            <div className="container">
                                <div className="bg-theme-auto rounded-5 shadow p-3">
                                    <h2 className="font-esthetic text-center py-2 mb-2" style={{ fontSize: '2.125rem' }}>
                                        Our Love Story
                                    </h2>

                                    <div
                                        id="video-love-stroy"
                                        className="position-relative rounded-4 mb-2 pb-0"
                                        data-src={videoSrc}
                                        data-vid-class="w-100 rounded-4 shadow-sm m-0 p-0"
                                    >
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
                                                    style={{ width: '0%' }}
                                                ></div>
                                            </div>
                                            <small
                                                className="mt-1 text-theme-auto bg-theme-auto py-0 px-2 rounded-4"
                                                id="progress-info-video-love-stroy"
                                                style={{ fontSize: '0.7rem' }}
                                            ></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Wedding Date */}
                        <section className="bg-white-black pb-2" id="wedding-date">
                            <div className="container text-center">
                                <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2.25rem' }}>
                                    Our Special Day
                                </h2>

                                <div className="border rounded-pill shadow py-2 px-4 mt-2 mb-4">
                                    <div className="row justify-content-center">
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="day">
                                                0
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Days</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="hour">
                                                0
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Hours</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="minute">
                                                0
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Minutes</small>
                                        </div>
                                        <div className="col-3 p-1">
                                            <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }} id="second">
                                                0
                                            </p>
                                            <small className="ms-1 me-0 my-0 p-0 d-inline">Seconds</small>
                                        </div>
                                    </div>
                                </div>

                                <p className="py-2 m-0" style={{ fontSize: '0.95rem' }}>
                                    Seeking the mercy and blessing of Allah, God willing, we will hold our wedding on:
                                </p>

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
                        <section className="bg-white-black py-2 no-gap-bottom">
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
            <div className="loading-page bg-white-black" id="welcome" style={{ opacity: 0 }}>
                <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
                    <div className="d-flex flex-column text-center">
                        <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                            The Wedding Of
                        </h2>

                        <img
                            src="./assets/images/placeholder.webp"
                            data-src="./assets/images/3.jpeg"
                            alt="background"
                            className="img-center-crop rounded-circle border border-3 border-light shadow mb-4 mx-auto"
                        />

                        <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                            {coupleNames}
                        </h2>
                        <div id="guest-name" data-message="Dear Mr./Mrs./Ms."></div>

                        <button
                            type="button"
                            className="btn btn-light shadow rounded-4 mt-3 mx-auto"
                            onClick={(e) => guest.open(e.currentTarget)}
                        >
                            <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>Open Invitation
                        </button>
                    </div>
                </div>
            </div>

            {/* Button Group */}
            <div
                className="d-flex position-fixed flex-column"
                style={{ bottom: '10vh', right: '2vh', zIndex: 1030 }}
            >
                <button
                    type="button"
                    id="button-theme"
                    className="btn bg-light-dark border btn-sm rounded-circle d-none btn-transparent shadow-sm mt-3"
                    aria-label="Change theme"
                    onClick={() => theme.change()}
                >
                    <i className="fa-solid fa-circle-half-stroke"></i>
                </button>

                <button
                    type="button"
                    id="button-music"
                    className="btn bg-light-dark border btn-sm rounded-circle d-none btn-transparent shadow-sm mt-3"
                    aria-label="Change audio"
                    data-offline-disabled="false"
                >
                    <i className="fa-solid fa-circle-pause spin-button"></i>
                </button>
            </div>

            {/* Loading Page */}
            <div className="loading-page bg-white-black" id="loading" style={{ opacity: 1 }}>
                <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
                    <div className="d-flex flex-column width-loading text-center">
                        <img
                            src="./assets/images/placeholder.webp"
                            data-src="./assets/images/icon-192x192.png"
                            fetchPriority="high"
                            className="img-fluid mb-3 mx-auto object-fit-cover opacity-0"
                            alt="icon"
                            style={{ width: '3.5rem', height: '3.5rem' }}
                        />
                        <div
                            className="progress"
                            role="progressbar"
                            style={{ height: '0.5rem' }}
                            aria-label="progress bar"
                        >
                            <div className="progress-bar" id="progress-bar" style={{ width: '0%' }}></div>
                        </div>
                        <small className="d-none mt-1 text-theme-auto" id="progress-info" style={{ fontSize: '0.8rem' }}>
                            Booting application...
                        </small>
                    </div>
                </div>
            </div>

            {/* Modal Image */}
            <div className="modal fade" id="modal-image" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border border-0">
                        <div className="modal-body p-0">
                            <div className="d-flex position-absolute top-0 end-0">
                                <a
                                    className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                                    role="button"
                                    target="_blank"
                                    rel="noreferrer"
                                    href="./assets/images/placeholder.webp"
                                    id="button-modal-click"
                                >
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        style={{ width: '1em' }}
                                    ></i>
                                </a>
                                <button
                                    type="button"
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
                                src="./assets/images/placeholder.webp"
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
