import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import BottomNav from '@/Components/BottomNav';
import KeyboardShortcutsModal from '@/Components/KeyboardShortcutsModal';
import { useGlobalShortcuts } from '@/Hooks/useKeyboardShortcuts';
import useScrollDirection from '@/Hooks/useScrollDirection';

export default function AppLayout({ children, title, showHeader = true, showNav = true }) {
    const { auth } = usePage().props;
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const { scrollDirection, scrollY } = useScrollDirection();

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
                className="min-h-screen bg-gray-50 dark:bg-gray-900"
                data-user-username={auth.user?.username}
            >
                {showHeader && <Header title={title} isVisible={isNavVisible} />}

                <main className={`max-w-lg mx-auto ${showNav ? 'pb-20' : ''}`}>
                    {children}
                </main>

                {showNav && <BottomNav isVisible={isNavVisible} />}
            </div>

            {/* Keyboard Shortcuts Help Modal */}
            <KeyboardShortcutsModal
                show={showShortcutsModal}
                onClose={() => setShowShortcutsModal(false)}
                isAuthenticated={!!auth.user}
            />
        </>
    );
}
