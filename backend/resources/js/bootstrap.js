import axios from 'axios';

window.axios = axios;

// Required for Laravel
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 🔒 CRITICAL: allow cookies (session + XSRF)
window.axios.defaults.withCredentials = true;

/*
|--------------------------------------------------------------------------
| Axios Response Interceptor
|--------------------------------------------------------------------------
| Do NOT reload blindly on 419
*/
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            console.error('CSRF token mismatch (419). Please refresh the page.');
        }
        return Promise.reject(error);
    }
);

/*
|--------------------------------------------------------------------------
| Laravel Echo — using Reverb (see echo.js for full setup)
| echo.js is imported in app.js after this file, so window.Echo will be
| available before Alpine components initialise.
|--------------------------------------------------------------------------
*/
import './echo';
