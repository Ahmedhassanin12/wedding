import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { GuestInvitationView } from '../components/GuestInvitationView';
import { guest } from '../app/guest/guest';
import { offline } from '../common/offline';
import { progress } from '../app/guest/progress';

describe('Declarative React Runtime Integration (Guest Flow, Progress & Offline)', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.pushState({}, '', '/');
        guest.reset();
        vi.restoreAllMocks();
    });

    it('reactively updates loading progress and reveals invitation via external store subscription', () => {
        const { container } = render(<GuestInvitationView />);

        act(() => {
            progress.init();
            progress.add();
            progress.add();
        });

        expect(container.querySelector('#progress-bar')).toHaveStyle({ width: '0%' });

        act(() => {
            progress.complete('image');
        });

        expect(container.querySelector('#progress-bar')).toHaveStyle({ width: '50%' });
        expect(screen.getByText(/Loading image complete \(1\/2\) \[50%\]/i)).toBeInTheDocument();

        act(() => {
            guest.open();
        });

        expect(container.querySelector('#root')).not.toHaveClass('opacity-0');
    });

    it('declaratively renders offline/online network banner and disables audio button when offline', () => {
        const cleanupOffline = offline.init();

        const { container } = render(<GuestInvitationView />);

        act(() => {
            guest.open();
        });

        const musicBtn = container.querySelector('#button-music') as HTMLButtonElement;
        expect(musicBtn.disabled).toBe(false);

        act(() => {
            window.dispatchEvent(new Event('offline'));
        });

        expect(offline.isOnline()).toBe(false);
        expect(screen.getByText('Koneksi tidak tersedia')).toBeInTheDocument();
        expect(musicBtn.disabled).toBe(true);
        expect(musicBtn).toHaveClass('disabled');

        act(() => {
            window.dispatchEvent(new Event('online'));
        });

        expect(offline.isOnline()).toBe(true);
        expect(screen.getByText('Koneksi tersedia kembali')).toBeInTheDocument();
        expect(musicBtn.disabled).toBe(false);
        expect(musicBtn).not.toHaveClass('disabled');

        cleanupOffline();
    });
});
