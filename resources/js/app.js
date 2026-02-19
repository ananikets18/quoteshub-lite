import './bootstrap';
import Alpine from 'alpinejs';

// Import components
import { quoteCard } from './components/quoteCard.js';
import { notificationSystem } from './components/notifications.js';
import { toastNotification } from './components/toast.js';
import { followButton } from './components/followButton.js';
import { infiniteScroll } from './components/infiniteScroll.js';
import { searchBar } from './components/searchBar.js';

// Register Alpine components
Alpine.data('quoteCard', quoteCard);
Alpine.data('notificationSystem', notificationSystem);
Alpine.data('toastNotification', toastNotification);
Alpine.data('followButton', followButton);
Alpine.data('infiniteScroll', infiniteScroll);
Alpine.data('searchBar', searchBar);

// Mobile menu toggle
Alpine.data('mobileMenu', () => ({
    open: false,
    toggle() {
        this.open = !this.open;
    }
}));

// User menu dropdown
Alpine.data('userMenu', () => ({
    open: false,
    toggle() {
        this.open = !this.open;
    },
    close() {
        this.open = false;
    }
}));

// Modal component
Alpine.data('modal', (initialOpen = false) => ({
    open: initialOpen,
    show() {
        this.open = true;
        document.body.style.overflow = 'hidden';
    },
    hide() {
        this.open = false;
        document.body.style.overflow = '';
    }
}));

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();

// Theme toggle functionality
window.toggleTheme = function () {
    if (localStorage.theme === 'dark') {
        localStorage.theme = 'light';
        document.documentElement.classList.remove('dark');
    } else {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
    }
};

// Initialize theme on page load
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Make appData globally available for components
window.appData = window.appData || {
    authenticated: document.querySelector('meta[name="authenticated"]')?.content === 'true',
    user: null
};
