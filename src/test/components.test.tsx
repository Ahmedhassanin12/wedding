import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuestInvitationView } from '../components/GuestInvitationView';
import { guest } from '../app/guest/guest';

describe('React 19 GuestInvitationView Component', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.pushState({}, '', '/');
        guest.reset();
    });

    it('renders GuestInvitationView with couple details, countdown, and ceremony section', () => {
        const { container } = render(<GuestInvitationView />);

        expect(screen.getByText('Wedding Invitation')).toBeInTheDocument();
        expect(screen.getAllByText('Ahmed & Nermin').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Ahmed')).toBeInTheDocument();
        expect(screen.getByText('Nermin')).toBeInTheDocument();
        expect(screen.getByText('Open Invitation')).toBeInTheDocument();
        expect(screen.getByText('View on Google Maps')).toBeInTheDocument();
        expect(container.querySelector('#comment')).toBeNull();
    });

    it('supports custom couple props and declaratively renders ?to= guest name', () => {
        window.history.pushState({}, '', '/?to=Dr.%20Hassan');

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
        expect(screen.getByText('Dr. Hassan')).toBeInTheDocument();
    });

    it('declaratively opens invitation and updates modal image state via React event handlers', () => {
        const { container } = render(<GuestInvitationView />);

        const rootDiv = container.querySelector('#root');
        expect(rootDiv).toHaveClass('opacity-0');

        const openButton = screen.getByRole('button', { name: /Open Invitation/i });
        fireEvent.click(openButton);

        expect(rootDiv).not.toHaveClass('opacity-0');
        expect(container.querySelector('#welcome')).toBeNull();

        const groomImg = screen.getByAltText('groom') as HTMLImageElement;
        fireEvent.click(groomImg);

        const modalPreviewImg = container.querySelector('#show-modal-image') as HTMLImageElement;
        expect(modalPreviewImg.src).toContain('/assets/images/placeholder.webp');

        const modalActionsContainer = container.querySelector('#button-modal-click')?.parentElement;
        expect(modalActionsContainer).toHaveClass('d-flex');

        fireEvent.click(modalPreviewImg);
        expect(modalActionsContainer).toHaveClass('d-none');
    });
});
