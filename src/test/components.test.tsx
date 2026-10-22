import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuestInvitationView } from '../components/GuestInvitationView';

describe('React 19 GuestInvitationView Component', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    it('renders GuestInvitationView with couple details, countdown, and ceremony section', () => {
        render(<GuestInvitationView />);

        expect(screen.getByText('Wedding Invitation')).toBeInTheDocument();
        expect(screen.getAllByText('Ahmed & Nermin').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Ahmed')).toBeInTheDocument();
        expect(screen.getByText('Nermin')).toBeInTheDocument();
        expect(screen.getByText('Open Invitation')).toBeInTheDocument();
        expect(screen.getByText('View on Google Maps')).toBeInTheDocument();
        expect(document.getElementById('comment')).toBeNull();
    });

    it('supports custom couple and ceremony props', () => {
        render(
            <GuestInvitationView
                coupleNames="Omar & Layla"
                groomName="Omar"
                brideName="Layla"
                weddingDateDisplay="Friday, 15 November 2026"
            />,
        );

        expect(screen.getAllByText('Omar & Layla').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Omar')).toBeInTheDocument();
        expect(screen.getByText('Layla')).toBeInTheDocument();
        expect(screen.getAllByText('Friday, 15 November 2026').length).toBeGreaterThanOrEqual(1);
    });
});
