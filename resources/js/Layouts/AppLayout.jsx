import { useState, useEffect, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Header from '@/Components/Header';
import BottomNav from '@/Components/BottomNav';
import KeyboardShortcutsModal from '@/Components/KeyboardShortcutsModal';
import { useGlobalShortcuts } from '@/Hooks/useKeyboardShortcuts';
import useScrollDirection from '@/Hooks/useScrollDirection';
import Footer from '@/Components/Footer';
import Toast from '@/Components/Toast';

export default function AppLayout({ children, title, showHeader = true, showNav = true, showFooter = true, showLogo = false }) {
    const { auth, flash } = usePage().props;
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { scrollDirection, scrollY } = useScrollDirection();
    const [toast, setToast] = useState(null);

    const refreshUnreadCount = useCallback(async () => {
        if (!auth?.user) return;
        try {
            const { data } = await axios.get('/api/notifications/unread-count');
            setUnreadCount(data.count);
        } catch (e) {
            if (e.response?.status !== 401) console.error('Unread count:', e);
        }
    }, [auth?.user]);

    useEffect(() => {
        if (auth?.user) {
            refreshUnreadCount();
            const interval = setInterval(() => {
                if (document.visibilityState === 'visible') refreshUnreadCount();
            }, 60000);
            return () => clearInterval(interval);
        } else {
            setUnreadCount(0);
        }
    }, [auth?.user, refreshUnreadCount]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    // Global keyboard shortcuts
    useGlobalShortcuts({
        onOpenShortcutsHelp: () => setShowShortcutsModal(true),
        isAuthenticated: !!auth.user,
    });

    // Determine if nav elements should be visible
    const isNavVisible = scrollDirection === 'up' || scrollY < 50;

    return (
        <>
            <Head title={title} />

            <div
                className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"
                data-user-username={auth.user?.username}
            >
                {showHeader && (
                    <Header
                        title={title}
                        showLogo={showLogo}
                        isVisible={isNavVisible}
                        unreadCount={unreadCount}
                        refreshUnreadCount={refreshUnreadCount}
                    />
                )}

                <main className={`flex-grow max-w-lg mx-auto w-full ${showNav ? 'pb-20 md:pb-10' : 'pb-10'}`}>
                    {children}
                </main>

                {showFooter && <Footer />}

                {showNav && (
                    <BottomNav
                        isVisible={isNavVisible}
                        auth={auth}
                        unreadCount={unreadCount}
                    />
                )}
            </div>

            {toast && (
                <Toast
                    show={true}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Keyboard Shortcuts Help Modal */}
            <KeyboardShortcutsModal
                show={showShortcutsModal}
                onClose={() => setShowShortcutsModal(false)}
                isAuthenticated={!!auth.user}
            />
        </>
    );
}
