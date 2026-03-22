import './bootstrap';
import Alpine from 'alpinejs';

// Import components
import { quoteCard } from './components/quoteCard.js';
import { notificationSystem } from './components/notifications.js';
import { toastNotification } from './components/toast.js';
import { followButton } from './components/followButton.js';
import { infiniteScroll } from './components/infiniteScroll.js';
import { feedInfiniteScroll } from './components/feedInfiniteScroll.js';
import { collectionPicker } from './components/collectionPicker.js';
import { searchBar } from './components/searchBar.js';

// Register Alpine components
Alpine.data('quoteCard', quoteCard);
Alpine.data('notificationSystem', notificationSystem);
Alpine.data('toastNotification', toastNotification);
Alpine.data('followButton', followButton);
Alpine.data('infiniteScroll', infiniteScroll);
Alpine.data('feedInfiniteScroll', feedInfiniteScroll);
Alpine.data('collectionPicker', collectionPicker);
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
    var root = document.documentElement;
    var current = localStorage.getItem('qh-theme') || 'dark';
    if (current === 'dark') {
        localStorage.setItem('qh-theme', 'light');
        root.classList.remove('dark');
        root.classList.add('light');
    } else {
        localStorage.setItem('qh-theme', 'dark');
        root.classList.remove('light');
        root.classList.add('dark');
    }
};

// Initialize theme on page load (FOUC already handled inline in <head>)
(function () {
    var t = localStorage.getItem('qh-theme');
    var root = document.documentElement;
    if (t === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
    } else {
        root.classList.add('dark');
        root.classList.remove('light');
    }
})();

// Make appData globally available for components
window.appData = window.appData || {
    authenticated: document.querySelector('meta[name="authenticated"]')?.content === 'true',
    user: null
};
