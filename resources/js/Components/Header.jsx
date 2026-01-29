import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Flame, Bell, Settings } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';

export default function Header({ title, showStreak = true, showNotifications = true }) {
    const { auth } = usePage().props;
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

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
            console.error('Failed to fetch unread count:', error);
        }
    };

    const handleBellClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
        if (!showNotificationDropdown) {
            fetchUnreadCount(); // Refresh count when opening
        }
    };

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

                    {showNotifications && auth?.user && (
                        <div className="relative">
                            <button 
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
                            
                            <NotificationDropdown 
                                show={showNotificationDropdown}
                                onClose={() => {
                                    setShowNotificationDropdown(false);
                                    fetchUnreadCount(); // Refresh count when closing
                                }}
                            />
                        </div>
                    )}

                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
