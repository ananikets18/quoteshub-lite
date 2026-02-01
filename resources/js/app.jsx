import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'QuotesHub';

// Get CSRF token from meta tag and keep it updated
function getCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// Handle 419 CSRF token mismatch errors globally
router.on('error', (event) => {
    // Check if it's a 419 CSRF token mismatch error
    if (event.detail.errors && event.detail.errors.message === 'CSRF token mismatch.') {
        // Reload the page to get a fresh CSRF token
        window.location.reload();
    }
    
    // Also handle by status code
    if (event.detail.response && event.detail.response.status === 419) {
        console.warn('CSRF token expired. Reloading page to get fresh token...');
        // Reload the page to get a fresh CSRF token
        window.location.reload();
    }
});

// Update CSRF token in axios headers before each request
if (window.axios) {
    window.axios.interceptors.request.use((config) => {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    });
}
