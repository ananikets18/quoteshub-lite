import { usePage } from '@inertiajs/react';
import { Flame, Bell, Settings } from 'lucide-react';

export default function Header({ title, showStreak = true, showNotifications = true }) {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
            <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
                {/* Left: Title or Logo */}
                <div>
                    <h1 className="text-2xl font-bold text-gradient-primary">
                        {title || 'QuotesHub'}
                    </h1>
                </div>

                {/* Right: Streak & Actions */}
                <div className="flex items-center gap-3">
                    {showStreak && auth?.user && (
                        <div className="streak-badge">
                            <Flame className="w-4 h-4" />
                            <span>{auth.user.daily_streak || 0}</span>
                        </div>
                    )}

                    {showNotifications && (
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}

                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
