import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import BottomNav from '@/Components/BottomNav';
import KeyboardShortcutsModal from '@/Components/KeyboardShortcutsModal';
import { useGlobalShortcuts } from '@/Hooks/useKeyboardShortcuts';
import useScrollDirection from '@/Hooks/useScrollDirection';
import Footer from '@/Components/Footer';
import Toast from '@/Components/Toast';

export default function AppLayout({ children, title, showHeader = true, showNav = true }) {
    const { auth, flash } = usePage().props;
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const { scrollDirection, scrollY } = useScrollDirection();
    const [toast, setToast] = useState(null);

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
                {showHeader && <Header title={title} isVisible={isNavVisible} />}

                <main className={`flex-grow max-w-lg mx-auto w-full ${showNav ? 'pb-20' : 'pb-10'}`}>
                    {children}
                </main>

                <Footer />

                {showNav && <BottomNav isVisible={isNavVisible} />}
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
