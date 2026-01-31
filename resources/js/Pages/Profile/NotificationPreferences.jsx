import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import PrimaryButton from '@/Components/PrimaryButton';
import { Bell, BellOff, Volume2, VolumeX, Users } from 'lucide-react';

export default function NotificationPreferences({ auth, preferences }) {
    const { data, setData, post, processing } = useForm({
        // Notification types
        new_follower: preferences?.new_follower ?? true,
        quote_liked: preferences?.quote_liked ?? true,
        quote_saved: preferences?.quote_saved ?? true,
        comment_added: preferences?.comment_added ?? true,
        achievement_unlocked: preferences?.achievement_unlocked ?? true,
        admin_warning: preferences?.admin_warning ?? true,
        quote_removed: preferences?.quote_removed ?? true,
        quote_featured: preferences?.quote_featured ?? true,

        // Delivery preferences
        in_app_notifications: preferences?.in_app_notifications ?? true,
        email_notifications: preferences?.email_notifications ?? false,
        push_notifications: preferences?.push_notifications ?? false,

        // Other preferences
        notification_sounds: preferences?.notification_sounds ?? true,
        group_similar_notifications: preferences?.group_similar_notifications ?? true,
    });

    const [pushPermission, setPushPermission] = useState(
        'Notification' in window ? Notification.permission : 'unsupported'
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.notification-preferences.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            },
        });
    };

    const requestPushPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            setPushPermission(permission);

            if (permission === 'granted') {
                setData('push_notifications', true);
            }
        }
    };

    const notificationTypes = [
        {
            key: 'new_follower',
            label: 'New Followers',
            description: 'When someone follows you',
            icon: Users,
        },
        {
            key: 'quote_liked',
            label: 'Quote Likes',
            description: 'When someone likes your quote',
            icon: '❤️',
        },
        {
            key: 'quote_saved',
            label: 'Quote Saves',
            description: 'When someone saves your quote',
            icon: '🔖',
        },
        {
            key: 'comment_added',
            label: 'Comments',
            description: 'When someone comments on your quote',
            icon: '💬',
        },
        {
            key: 'achievement_unlocked',
            label: 'Achievements',
            description: 'When you unlock a new achievement',
            icon: '🏆',
        },
        {
            key: 'quote_featured',
            label: 'Featured Quotes',
            description: 'When your quote is featured',
            icon: '⭐',
        },
        {
            key: 'admin_warning',
            label: 'Admin Warnings',
            description: 'Important messages from moderators',
            icon: '⚠️',
        },
        {
            key: 'quote_removed',
            label: 'Quote Removals',
            description: 'When your quote is removed',
            icon: '🗑️',
        },
    ];

    return (
        <AppLayout user={auth.user} showNav={true}>
            <SeoHead title="Notification Preferences" description="Manage how you receive notifications on QuotesHub." />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-4 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Bell className="w-6 h-6" />
                            Notification Preferences
                        </h2>
                        <p className="mt-1 text-sm text-purple-100">
                            Manage how and when you receive notifications
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl">

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Delivery Methods */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Delivery Methods
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    In-App Notifications
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Show notifications in the app
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.in_app_notifications}
                                            onChange={(e) => setData('in_app_notifications', e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">📧</span>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    Email Notifications
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Receive notifications via email
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.email_notifications}
                                            onChange={(e) => setData('email_notifications', e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </label>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🔔</span>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    Push Notifications
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Browser push notifications
                                                    {pushPermission === 'denied' && (
                                                        <span className="text-red-500 ml-2">(Blocked by browser)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {pushPermission === 'granted' ? (
                                            <input
                                                type="checkbox"
                                                checked={data.push_notifications}
                                                onChange={(e) => setData('push_notifications', e.target.checked)}
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                        ) : pushPermission === 'default' ? (
                                            <button
                                                type="button"
                                                onClick={requestPushPermission}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                                            >
                                                Enable
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500">Blocked</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notification Types */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Notification Types
                                </h3>
                                <div className="space-y-3">
                                    {notificationTypes.map((type) => (
                                        <label
                                            key={type.key}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{type.icon}</span>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {type.label}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {type.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={data[type.key]}
                                                onChange={(e) => setData(type.key, e.target.checked)}
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Preferences */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Additional Preferences
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex items-center gap-3">
                                            {data.notification_sounds ? (
                                                <Volume2 className="w-5 h-5 text-purple-600" />
                                            ) : (
                                                <VolumeX className="w-5 h-5 text-gray-400" />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    Notification Sounds
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Play sound when receiving notifications
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.notification_sounds}
                                            onChange={(e) => setData('notification_sounds', e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    Group Similar Notifications
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Combine similar notifications (e.g., "John and 5 others liked your quote")
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.group_similar_notifications}
                                            onChange={(e) => setData('group_similar_notifications', e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex items-center justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
