import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { createStore } from '../state/store';
import {
    DEFAULT_INVITATION_CONFIG,
    invitationConfig,
    validateInvitationConfig,
} from '../config/invitationConfig';
import { buildGoogleCalendarUrl } from '../app/guest/useGuestInvitation';
import { GuestInvitationView } from '../components/GuestInvitationView';
import { guest } from '../app/guest/guest';

describe('Centralized Configuration Architecture and Reactive Store', () => {
    beforeEach(() => {
        document.body.removeAttribute('data-audio');
        document.body.removeAttribute('data-confetti');
        document.body.removeAttribute('data-time');
        invitationConfig.reset();
        guest.reset();
    });

    it('creates a type-safe reactive store, notifies subscribers only on changes, and resets cleanly', () => {
        const counterStore = createStore({ count: 0, label: 'init' });
        let notifications = 0;

        const unsubscribe = counterStore.subscribe(() => {
            notifications += 1;
        });

        // No-op update with identical value should not notify
        counterStore.setState({ count: 0 });
        expect(notifications).toBe(0);

        counterStore.setState((prev) => ({ ...prev, count: prev.count + 1 }));
        expect(counterStore.getSnapshot().count).toBe(1);
        expect(notifications).toBe(1);

        counterStore.reset();
        expect(counterStore.getSnapshot()).toEqual({ count: 0, label: 'init' });
        expect(notifications).toBe(2);

        unsubscribe();
        counterStore.setState({ count: 99 });
        expect(notifications).toBe(2);
    });

    it('provides authoritative defaults and validates configuration updates', () => {
        const current = invitationConfig.get();
        expect(current.couple.coupleNames).toBe('Ahmed & Esraa');
        expect(current.event.countdownTargetTime).toBe('2026-10-08 21:00:00');
        expect(validateInvitationConfig(DEFAULT_INVITATION_CONFIG)).toEqual({
            valid: true,
            errors: [],
        });

        expect(() =>
            invitationConfig.update({
                couple: { coupleNames: '   ' },
            }),
        ).toThrow(/couple\.coupleNames must not be empty/);

        expect(() =>
            invitationConfig.update({
                event: { countdownTargetTime: 'not-a-valid-date' },
            }),
        ).toThrow(/event\.countdownTargetTime is not a valid date/);

        expect(() =>
            invitationConfig.update({
                presentation: { slideshowIntervalMs: 0 },
            }),
        ).toThrow(/presentation\.slideshowIntervalMs must be greater than 0/);
    });

    it('synchronizes configuration overrides from document.body data-* attributes', () => {
        document.body.setAttribute('data-audio', './assets/music/custom-song.mp3');
        document.body.setAttribute('data-confetti', 'false');
        document.body.setAttribute('data-time', '2027-05-20 18:00:00');

        const synced = invitationConfig.syncFromDom();
        expect(synced.media.audioSrc).toBe('./assets/music/custom-song.mp3');
        expect(synced.presentation.enableConfetti).toBe(false);
        expect(synced.event.countdownTargetTime).toBe('2027-05-20 18:00:00');
    });

    it('propagates runtime configuration updates to GuestInvitationView and Google Calendar URLs without editing components', () => {
        render(<GuestInvitationView />);
        expect(screen.getAllByText('Ahmed & Esraa').length).toBeGreaterThanOrEqual(2);

        act(() => {
            invitationConfig.update({
                couple: {
                    coupleNames: 'Tariq & Salma',
                    groomName: 'Tariq',
                    brideName: 'Salma',
                },
                event: {
                    weddingDateDisplay: 'Saturday, 12 December 2026',
                    locationAddress: 'Four Seasons Nile Plaza, Cairo',
                },
            });
        });

        expect(screen.getAllByText('Tariq & Salma').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Tariq')).toBeInTheDocument();
        expect(screen.getByText('Salma')).toBeInTheDocument();
        expect(screen.getAllByText('Saturday, 12 December 2026').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Four Seasons Nile Plaza, Cairo')).toBeInTheDocument();

        const calendarUrl = buildGoogleCalendarUrl();
        expect(calendarUrl).toContain('Four+Seasons+Nile+Plaza');
    });
});
