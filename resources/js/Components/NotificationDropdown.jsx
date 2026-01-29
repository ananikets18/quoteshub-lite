import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Check, Trash2, Heart, Bookmark, UserPlus, Trophy, AlertTriangle, XCircle, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';

export default function NotificationDropdown({ show, onClose }) {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Only load notifications if user is authenticated and dropdown is shown
        if (show && auth?.user) {
            loadNotifications();
        }
    }, [show, auth?.user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications', {
                params: { per_page: 15 }
            });
            setNotifications(response.data.data);
            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            // Silently fail if user is not authenticated (401)
            if (error.response?.status !== 401) {
                console.error('Failed to load notifications:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/api/notifications/${notificationId}/read`);
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, is_read: true, read_at: new Date() } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, is_read: true, read_at: new Date() })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/api/notifications/${notificationId}`);
            setNotifications(notifications.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        if (notification.url) {
            router.visit(notification.url);
            onClose();
        }
    };

    const getIcon = (iconName) => {
        const iconMap = {
            'heart': Heart,
            'bookmark': Bookmark,
            'user-plus': UserPlus,
            'trophy': Trophy,
            'alert-triangle': AlertTriangle,
            'x-circle': XCircle,
            'star': Star,
            'message-circle': MessageCircle,
            'bell': Bell,
        };

        const IconComponent = iconMap[iconName] || Bell;
        return <IconComponent className="w-5 h-5" />;
    };

    const getIconColor = (type) => {
        const colorMap = {
            'new_follower': 'text-blue-500',
            'quote_liked': 'text-red-500',
            'quote_saved': 'text-purple-500',
            'comment_added': 'text-green-500',
            'achievement_unlocked': 'text-yellow-500',
            'admin_warning': 'text-orange-500',
            'quote_removed': 'text-red-600',
            'quote_featured': 'text-yellow-400',
        };
        return colorMap[type] || 'text-gray-500';
    };

    if (!show) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Dropdown */}
            <div ref={dropdownRef} className="fixed md:absolute top-0 md:top-auto right-0 md:right-0 left-0 md:left-auto mt-0 md:mt-2 md:w-96 w-full h-full md:h-auto md:max-w-md bg-white dark:bg-gray-800 md:rounded-lg rounded-none md:shadow-xl shadow-2xl border-0 md:border border-gray-200 dark:border-gray-700 z-50 md:max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <div className="flex items-center gap-2">
                        {notifications.some(n => !n.is_read) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Mark all read
                            </button>
                        )}
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2">Loading...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                                            {getIcon(notification.icon)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {notification.actor && (
                                                            <span className="font-semibold">{notification.actor.name} </span>
                                                        )}
                                                        <span className={!notification.is_read ? 'font-medium' : ''}>
                                                            {notification.message.replace(notification.actor?.name + ' ', '')}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {notification.time_ago}
                                                    </p>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                    className="ml-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Unread indicator */}
                                            {!notification.is_read && (
                                                <div className="mt-2">
                                                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                        <Link
                            href="/notifications"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={onClose}
                        >
                            View all notifications
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
