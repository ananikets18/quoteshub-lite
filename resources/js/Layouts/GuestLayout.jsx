import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo variant="gradient" className="h-20 w-20 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white dark:bg-gray-800 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                {children}
            </div>
        </div>
    );
}
