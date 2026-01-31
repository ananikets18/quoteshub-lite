import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { User, Lock, Bell, Shield, Eye, Moon, Sun, Trash2, LogOut, ChevronRight, UserX, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function Settings({ auth, preferences = {}, privacy = {} }) {
    const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    const [notifPrefs, setNotifPrefs] = useState({
        in_app_notifications: preferences.in_app_notifications ?? true,
        email_notifications: preferences.email_notifications ?? false,
        push_notifications: preferences.push_notifications ?? false,
        new_follower: preferences.new_follower ?? true,
        quote_liked: preferences.quote_liked ?? true,
        quote_saved: preferences.quote_saved ?? true,
        comment_added: preferences.comment_added ?? true,
        notification_sounds: preferences.notification_sounds ?? true,
    });
    const [privacySettings, setPrivacySettings] = useState({
        profile_is_private: privacy.profile_is_private ?? false,
        show_email: privacy.show_email ?? false,
        show_activity_status: privacy.show_activity_status ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleNotificationToggle = async (field) => {
        const newValue = !notifPrefs[field];
        setNotifPrefs(prev => ({ ...prev, [field]: newValue }));

        setSaving(true);
        try {
            await axios.post('/profile/notification-preferences', {
                ...notifPrefs,
                [field]: newValue
            });
        } catch (error) {
            console.error('Failed to update preferences:', error);
            // Revert on error
            setNotifPrefs(prev => ({ ...prev, [field]: !newValue }));
        } finally {
            setSaving(false);
        }
    };

    const handlePrivacyToggle = async (field) => {
        const newValue = !privacySettings[field];
        setPrivacySettings(prev => ({ ...prev, [field]: newValue }));

        setSaving(true);
        try {
            await axios.post('/settings/privacy', {
                ...privacySettings,
                [field]: newValue
            });
        } catch (error) {
            console.error('Failed to update privacy settings:', error);
            // Revert on error
            setPrivacySettings(prev => ({ ...prev, [field]: !newValue }));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteError('');

        if (deleteConfirmation !== 'DELETE') {
            setDeleteError('Please type DELETE to confirm');
            return;
        }

        if (!deletePassword) {
            setDeleteError('Please enter your password');
            return;
        }

        setDeleting(true);
        try {
            await router.delete('/settings/account', {
                data: {
                    password: deletePassword,
                    confirmation: deleteConfirmation,
                },
                onError: (errors) => {
                    setDeleteError(errors.password || 'Failed to delete account');
                    setDeleting(false);
                },
            });
        } catch (error) {
            setDeleteError('Failed to delete account');
            setDeleting(false);
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const settingsSections = [
        {
            title: 'Account',
            icon: User,
            color: 'from-purple-500 to-pink-500',
            items: [
                {
                    label: 'Profile Information',
                    description: 'Update your name, email, and bio',
                    href: '/profile',
                    icon: User,
                },
                {
                    label: 'Change Password',
                    description: 'Update your password to keep your account secure',
                    href: '/profile',
                    icon: Lock,
                },
            ],
        },
        {
            title: 'Appearance',
            icon: darkMode ? Moon : Sun,
            color: 'from-indigo-500 to-purple-500',
            items: [
                {
                    label: 'Dark Mode',
                    description: darkMode ? 'Currently using dark theme' : 'Currently using light theme',
                    icon: darkMode ? Moon : Sun,
                    toggle: true,
                    value: darkMode,
                    onChange: toggleDarkMode,
                },
            ],
        },
        {
            title: 'Notifications',
            icon: Bell,
            color: 'from-blue-500 to-cyan-500',
            items: [
                {
                    label: 'In-App Notifications',
                    description: 'Show notifications within the app',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.in_app_notifications,
                    onChange: () => handleNotificationToggle('in_app_notifications'),
                },
                {
                    label: 'Email Notifications',
                    description: 'Receive notifications via email',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.email_notifications,
                    onChange: () => handleNotificationToggle('email_notifications'),
                },
                {
                    label: 'Push Notifications',
                    description: 'Receive browser push notifications',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.push_notifications,
                    onChange: () => handleNotificationToggle('push_notifications'),
                },
                {
                    label: 'New Followers',
                    description: 'When someone follows you',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.new_follower,
                    onChange: () => handleNotificationToggle('new_follower'),
                },
                {
                    label: 'Quote Likes',
                    description: 'When someone likes your quote',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.quote_liked,
                    onChange: () => handleNotificationToggle('quote_liked'),
                },
                {
                    label: 'Quote Saves',
                    description: 'When someone saves your quote',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.quote_saved,
                    onChange: () => handleNotificationToggle('quote_saved'),
                },
                {
                    label: 'Comments',
                    description: 'When someone comments on your quote',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.comment_added,
                    onChange: () => handleNotificationToggle('comment_added'),
                },
                {
                    label: 'Notification Sounds',
                    description: 'Play sound when receiving notifications',
                    icon: Bell,
                    toggle: true,
                    value: notifPrefs.notification_sounds,
                    onChange: () => handleNotificationToggle('notification_sounds'),
                },
            ],
        },
        {
            title: 'Privacy',
            icon: Shield,
            color: 'from-green-500 to-emerald-500',
            items: [
                {
                    label: 'Private Profile',
                    description: privacySettings.profile_is_private ? 'Only followers can see your quotes' : 'Anyone can see your quotes',
                    icon: Eye,
                    toggle: true,
                    value: privacySettings.profile_is_private,
                    onChange: () => handlePrivacyToggle('profile_is_private'),
                },
                {
                    label: 'Show Email',
                    description: privacySettings.show_email ? 'Email visible on profile' : 'Email hidden from profile',
                    icon: Shield,
                    toggle: true,
                    value: privacySettings.show_email,
                    onChange: () => handlePrivacyToggle('show_email'),
                },
                {
                    label: 'Show Activity Status',
                    description: privacySettings.show_activity_status ? 'Others can see when you\'re active' : 'Activity status hidden',
                    icon: Eye,
                    toggle: true,
                    value: privacySettings.show_activity_status,
                    onChange: () => handlePrivacyToggle('show_activity_status'),
                },
                {
                    label: 'Blocked Users',
                    description: 'Manage users you have blocked',
                    href: '/settings/blocked-users',
                    icon: UserX,
                },
            ],
        },
        {
            title: 'Danger Zone',
            icon: Trash2,
            color: 'from-red-500 to-orange-500',
            items: [
                {
                    label: 'Delete Account',
                    description: 'Permanently delete your account and all data',
                    icon: Trash2,
                    danger: true,
                    action: () => setShowDeleteModal(true),
                },
                {
                    label: 'Logout',
                    description: 'Sign out of your account',
                    icon: LogOut,
                    action: handleLogout,
                },
            ],
        },
    ];

    return (
        <AppLayout title="Settings">
            <Head title="Settings" />

            <div className="px-4 py-6 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account preferences and settings
                    </p>
                </div>

                {/* Saving Indicator */}
                {saving && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Saving changes...</p>
                    </div>
                )}

                {/* Settings Sections */}
                <div className="space-y-6">
                    {settingsSections.map((section) => {
                        const SectionIcon = section.icon;

                        return (
                            <div
                                key={section.title}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Section Header */}
                                <div className={`px-6 py-4 bg-gradient-to-r ${section.color} text-white`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <SectionIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-lg font-bold">
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Section Items */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {section.items.map((item, index) => {
                                        const ItemIcon = item.icon;

                                        if (item.toggle) {
                                            return (
                                                <div
                                                    key={index}
                                                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <ItemIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {item.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={item.onChange}
                                                        disabled={saving}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-shrink-0 ${item.value
                                                            ? 'bg-purple-600'
                                                            : 'bg-gray-200 dark:bg-gray-700'
                                                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.value ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        }

                                        if (item.action) {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={item.action}
                                                    className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <ItemIcon
                                                            className={`w-5 h-5 flex-shrink-0 ${item.danger
                                                                ? 'text-red-500'
                                                                : 'text-gray-400'
                                                                }`}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div
                                                                className={`font-medium ${item.danger
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : 'text-gray-900 dark:text-white'
                                                                    }`}
                                                            >
                                                                {item.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={item.href}
                                                className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <ItemIcon
                                                        className={`w-5 h-5 flex-shrink-0 ${item.danger
                                                            ? 'text-red-500'
                                                            : 'text-gray-400'
                                                            }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className={`font-medium ${item.danger
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : 'text-gray-900 dark:text-white'
                                                                }`}
                                                        >
                                                            {item.label}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* App Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        QuotesHub v1.0.0
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <Link href="/about" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                            About
                        </Link>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <Link href="/privacy" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                            Privacy
                        </Link>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <Link href="/terms" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold">Delete Account</h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleDeleteAccount} className="p-6">
                            <div className="mb-6">
                                <p className="text-gray-900 dark:text-white font-medium mb-2">
                                    Are you absolutely sure?
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    This action cannot be undone. This will permanently delete your account and remove all your data including quotes, likes, saves, and followers.
                                </p>
                            </div>

                            {deleteError && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type <span className="font-bold text-red-600">DELETE</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="DELETE"
                                        disabled={deleting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Enter your password
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Password"
                                        disabled={deleting}
                                    />
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletePassword('');
                                        setDeleteConfirmation('');
                                        setDeleteError('');
                                    }}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleting || deleteConfirmation !== 'DELETE' || !deletePassword}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
