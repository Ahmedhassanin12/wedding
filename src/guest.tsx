import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GuestInvitationView } from './components/GuestInvitationView';

const mountReact = (): void => {
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
        createRoot(appRoot).render(
            <StrictMode>
                <GuestInvitationView autoInit={true} />
            </StrictMode>,
        );
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountReact, { once: true });
} else {
    mountReact();
}
