import React from 'react';
import { createRoot } from 'react-dom/client';
import { guest } from './app/guest/guest';
import { GuestInvitationView } from './components/GuestInvitationView';

((w: Window) => {
    w.undangan = guest.init();

    const mountReact = () => {
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
            createRoot(appRoot).render(
                <React.StrictMode>
                    <GuestInvitationView />
                </React.StrictMode>,
            );
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountReact, { once: true });
    } else {
        mountReact();
    }
})(window);
