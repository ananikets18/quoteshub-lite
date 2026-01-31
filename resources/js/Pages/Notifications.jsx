import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Bell, Check, Trash2, Heart, Bookmark, UserPlus, Trophy, AlertTriangle, XCircle, Star, MessageCircle, CheckCheck, X } from 'lucide-react';
import axios from 'axios';

export default function Notifications() {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, [filter]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications', {
                params: {
                    per_page: 30,
                    unread_only: filter === 'unread' ? 1 : 0
                }
            });
            setNotifications(response.data.data);
            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            console.error('Failed to load notifications:', error);
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

    const deleteAllRead = async () => {
        if (deleting) return;

        try {
            setDeleting(true);
            await axios.delete('/api/notifications/read/all');
            setNotifications(notifications.filter(n => !n.is_read));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete read notifications:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        if (notification.url) {
            router.visit(notification.url);
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
        return <IconComponent className="w-6 h-6" />;
    };

    const getIconColor = (type) => {
        const colorMap = {
            'new_follower': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            'quote_liked': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            'quote_saved': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            'comment_added': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            'achievement_unlocked': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            'admin_warning': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
            'quote_removed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
            'quote_featured': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        return colorMap[type] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-6 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Stay updated with your activity</p>
                </div>

                {/* Filter & Actions Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Unread {unreadCount > 0 && `(${unreadCount})`}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark all read
                                </button>
                            )}
                            {notifications.some(n => n.is_read) && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear read
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Clear Read Notifications?
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                This will permanently delete all read notifications. This action cannot be undone.
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteAllRead}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete All
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'unread'
                                ? "You're all caught up!"
                                : "When you get notifications, they'll appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer ${!notification.is_read ? 'ring-2 ring-blue-500/20' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                                        {getIcon(notification.icon)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 dark:text-white mb-1">
                                            {notification.actor && (
                                                <span className="font-semibold">{notification.actor.name} </span>
                                            )}
                                            <span className={!notification.is_read ? 'font-medium' : ''}>
                                                {notification.message.replace(notification.actor?.name + ' ', '')}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {notification.time_ago}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
