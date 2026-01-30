import { useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * Global keyboard shortcuts hook
 * 
 * Shortcuts:
 * - C: Create new quote
 * - /: Focus search
 * - H: Go to home/feed
 * - N: Go to notifications
 * - A: Go to achievements
 * - P: Go to profile
 * - S: Go to saved/collections
 * - ?: Show keyboard shortcuts help
 * - Esc: Close modals/dialogs
 * - 1-4: Switch feed filters (For You, Latest, Trending, Featured)
 */
export function useGlobalShortcuts({
    onOpenShortcutsHelp,
    isModalOpen = false,
    isAuthenticated = false
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.isContentEditable ||
                isModalOpen
            ) {
                // Allow Esc to work in modals
                if (e.key === 'Escape') {
                    return;
                }
                return;
            }

            // Check for modifier keys (Ctrl/Cmd)
            const isMod = e.ctrlKey || e.metaKey;

            // Navigation shortcuts
            switch (e.key.toLowerCase()) {
                case 'c':
                    if (!isMod && isAuthenticated) {
                        e.preventDefault();
                        router.visit('/quotes/create');
                    }
                    break;

                case '/':
                    e.preventDefault();
                    // Focus search input
                    const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;

                case 'h':
                    if (!isMod) {
                        e.preventDefault();
                        router.visit('/');
                    }
                    break;

                case 'n':
                    if (!isMod && isAuthenticated) {
                        e.preventDefault();
                        router.visit('/notifications');
                    }
                    break;

                case 'a':
                    if (!isMod && isAuthenticated) {
                        e.preventDefault();
                        router.visit('/achievements');
                    }
                    break;

                case 'p':
                    if (!isMod && isAuthenticated) {
                        e.preventDefault();
                        const username = document.querySelector('[data-user-username]')?.dataset.userUsername;
                        if (username) {
                            router.visit(`/u/${username}`);
                        }
                    }
                    break;

                case 's':
                    if (!isMod && isAuthenticated) {
                        e.preventDefault();
                        router.visit('/collections');
                    }
                    break;

                case '?':
                    if (!isMod) {
                        e.preventDefault();
                        onOpenShortcutsHelp?.();
                    }
                    break;

                // Feed filter shortcuts (1-4)
                case '1':
                case '2':
                case '3':
                case '4':
                    if (!isMod && window.location.pathname === '/' || window.location.pathname === '/feed') {
                        e.preventDefault();
                        const filters = isAuthenticated
                            ? ['foryou', 'latest', 'trending', 'featured']
                            : ['latest', 'trending', 'featured'];
                        const filterIndex = parseInt(e.key) - 1;
                        if (filters[filterIndex]) {
                            router.visit(`/feed?sort=${filters[filterIndex]}`, {
                                preserveState: true,
                                only: ['quotes']
                            });
                        }
                    }
                    break;

                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, isAuthenticated, onOpenShortcutsHelp]);
}

/**
 * Modal-specific keyboard shortcuts
 * Handles Esc to close, Enter to submit, etc.
 */
export function useModalShortcuts({
    isOpen,
    onClose,
    onSubmit,
    canSubmit = true
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    onClose?.();
                    break;

                case 'Enter':
                    // Only submit on Ctrl/Cmd + Enter to avoid accidental submissions
                    if ((e.ctrlKey || e.metaKey) && canSubmit) {
                        e.preventDefault();
                        onSubmit?.();
                    }
                    break;

                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onSubmit, canSubmit]);
}

/**
 * Form shortcuts
 * Handles Ctrl/Cmd + Enter to submit forms
 */
export function useFormShortcuts({ onSubmit, canSubmit = true }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Enter to submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
                e.preventDefault();
                onSubmit?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onSubmit, canSubmit]);
}

/**
 * Quote card shortcuts (when focused)
 * L: Like, B: Bookmark/Save, S: Share, R: Report
 */
export function useQuoteCardShortcuts({
    onLike,
    onSave,
    onShare,
    onReport,
    isAuthenticated
}) {
    const handleKeyDown = (e) => {
        if (!isAuthenticated) return;

        switch (e.key.toLowerCase()) {
            case 'l':
                e.preventDefault();
                onLike?.();
                break;

            case 'b':
                e.preventDefault();
                onSave?.();
                break;

            case 's':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    onShare?.();
                }
                break;

            case 'r':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    onReport?.();
                }
                break;

            default:
                break;
        }
    };

    return { handleKeyDown };
}
