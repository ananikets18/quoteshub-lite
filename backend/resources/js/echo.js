import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

// Keep the UI functional even when realtime env vars are missing on production.
if (reverbKey) {
    try {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: reverbKey,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss']
        });
    } catch (error) {
        console.warn('[echo] Realtime disabled due to initialization error.', error);
        window.Echo = null;
    }
} else {
    window.Echo = null;
}
