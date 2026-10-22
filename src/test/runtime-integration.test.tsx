import { describe, it, expect, vi, beforeEach } from 'vitest';
import { guest } from '../app/guest/guest';
import { offline } from '../common/offline';

describe('End-to-End Runtime Integration (Guest Flow)', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('initializes Guest flow, parses ?to= query parameter, opens invitation, and opens image modal', () => {
        window.history.pushState({}, '', '/?to=Dr.%20Hassan');
        document.body.setAttribute('data-time', '2026-10-08 21:00:00');
        document.body.setAttribute('data-confetti', 'false');
        document.body.innerHTML = `
            <div id="root" class="opacity-0">
                <section id="home"><button type="button">Calendar</button></section>
            </div>
            <div id="welcome" style="opacity: 1;">
                <div id="guest-name" data-message="Dear Mr./Mrs./Ms."></div>
                <button id="btn-open" type="button">Open Invitation</button>
            </div>
            <div id="loading" style="opacity: 1;">
                <div id="progress-bar" style="width: 0%;"></div>
                <small id="progress-info" class="d-none"></small>
            </div>
            <button id="button-theme" class="d-none"></button>
            <button id="button-music" class="d-none"></button>
            <p id="day">0</p><p id="hour">0</p><p id="minute">0</p><p id="second">0</p>
            <div id="modal-image">
                <a id="button-modal-click" href="#"></a>
                <button id="button-modal-download"></button>
                <img id="show-modal-image" src="" />
            </div>
        `;

        const instance = guest.init();
        expect(instance.guest).toBeDefined();
        expect(instance.theme).toBeDefined();
        expect('comment' in instance).toBe(false);

        const btnOpen = document.getElementById('btn-open') as HTMLButtonElement;
        instance.guest.open(btnOpen);

        expect(btnOpen.disabled).toBe(true);
        expect(document.getElementById('root')?.classList.contains('opacity-0')).toBe(false);

        const sampleImg = document.createElement('img');
        sampleImg.src = 'https://ulems.my.id/assets/images/3.jpeg';
        sampleImg.width = 500;
        sampleImg.height = 500;
        instance.guest.modal(sampleImg);

        expect(document.getElementById('button-modal-click')?.getAttribute('href')).toBe(
            'https://ulems.my.id/assets/images/3.jpeg',
        );
        expect((document.getElementById('show-modal-image') as HTMLImageElement).src).toBe(
            'https://ulems.my.id/assets/images/3.jpeg',
        );
    });

    it('handles offline and online network transitions across interactive controls', () => {
        document.body.innerHTML = `
            <input id="test-input" data-offline-disabled="false" />
            <button id="test-btn" data-offline-disabled="false">Submit</button>
        `;

        offline.init();
        expect(offline.isOnline()).toBe(true);

        window.dispatchEvent(new Event('offline'));
        expect(offline.isOnline()).toBe(false);
        expect(document.getElementById('test-input')?.getAttribute('disabled')).toBe('true');
        expect(document.getElementById('test-btn')?.classList.contains('disabled')).toBe(true);

        window.dispatchEvent(new Event('online'));
        expect(offline.isOnline()).toBe(true);
        expect(document.getElementById('test-input')?.hasAttribute('disabled')).toBe(false);
        expect(document.getElementById('test-btn')?.classList.contains('disabled')).toBe(false);
    });
});
