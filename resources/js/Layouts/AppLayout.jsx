import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import BottomNav from '@/Components/BottomNav';

export default function AppLayout({ children, title, showHeader = true, showNav = true }) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {showHeader && <Header title={title} />}

                <main className={`max-w-lg mx-auto ${showNav ? 'pb-20' : ''}`}>
                    {children}
                </main>

                {showNav && <BottomNav />}
            </div>
        </>
    );
}
