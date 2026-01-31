import { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { Flame, Bell, Settings } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';

export default function Header({ title, showStreak = true, showNotifications = true, isVisible = true }) {
    const { auth } = usePage().props;
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const bellButtonRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch unread count on mount and periodically
    useEffect(() => {
        if (auth?.user && showNotifications) {
            fetchUnreadCount();

            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);

            return () => clearInterval(interval);
        }
    }, [auth?.user, showNotifications]);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/api/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            // Silently fail if user is not authenticated (401)
            if (error.response?.status !== 401) {
                console.error('Failed to fetch unread count:', error);
            }
        }
    };

    const handleBellClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
        if (!showNotificationDropdown) {
            fetchUnreadCount(); // Refresh count when opening
        }
    };

    return (
        <header className={`sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
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
                        <Link href="/achievements" className="streak-badge hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <Flame className="w-4 h-4" />
                            <span>{auth.user.daily_streak || 0}</span>
                        </Link>
                    )}

                    {showNotifications && auth?.user && (
                        <div className="relative">
                            <button
                                ref={bellButtonRef}
                                onClick={handleBellClick}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                            >
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isMounted && typeof window !== 'undefined' && createPortal(
                                <NotificationDropdown
                                    show={showNotificationDropdown}
                                    onClose={() => {
                                        setShowNotificationDropdown(false);
                                        fetchUnreadCount(); // Refresh count when closing
                                    }}
                                    buttonRef={bellButtonRef}
                                />,
                                document.body
                            )}
                        </div>
                    )}

                    <Link
                        href="/settings"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>

                    {auth?.user && (
                        <Link
                            href={`/${auth.user.username}`}
                            className="ml-1"
                        >
                            <img
                                src={auth.user.avatar ? `/storage/${auth.user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`}
                                alt={auth.user.name}
                                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
