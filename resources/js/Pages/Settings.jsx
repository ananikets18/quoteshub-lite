import { Head } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import { User, Lock, Bell, Shield, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import UpdateProfileInformationForm from './Profile/Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Profile/Partials/UpdatePasswordForm';
import DeleteUserForm from './Profile/Partials/DeleteUserForm';

export default function Settings({ auth, preferences = {}, privacy = {}, mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState('account');
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
            await axios.post('/profile/notification-preferences', { ...notifPrefs, [field]: newValue });
        } catch (error) {
            console.error('Failed to update preferences:', error);
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
            await axios.post('/settings/privacy', { ...privacySettings, [field]: newValue });
        } catch (error) {
            console.error('Failed to update privacy settings:', error);
            setPrivacySettings(prev => ({ ...prev, [field]: !newValue }));
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Monitor },
    ];

    return (
        <AppLayout title="Settings">
            <SeoHead
                title="Settings"
                description="Manage your profile information, password, notification preferences, and privacy settings."
            />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8 pb-32">
                <div className="mb-8 px-4 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your profile, account, and application preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-0">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                            ? 'bg-[#5D41E6] text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {saving && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-pulse">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Saving changes...</p>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                                <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>
                                <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl">
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl space-y-6">
                                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose how and when you want to be notified.</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 'in_app_notifications', label: 'In-App Notifications', desc: 'Show notifications within the app' },
                                        { id: 'email_notifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                        { id: 'new_follower', label: 'New Followers', desc: 'When someone follows you' },
                                        { id: 'quote_liked', label: 'Quote Likes', desc: 'When someone likes your quote' },
                                        { id: 'quote_saved', label: 'Quote Saves', desc: 'When someone saves your quote' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-2">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(item.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifPrefs[item.id] ? 'bg-[#5D41E6]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifPrefs[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl space-y-6">
                                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Privacy Settings</h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Control who can see your profile and activity.</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 'profile_is_private', label: 'Private Profile', desc: 'Only followers can see your quotes' },
                                        { id: 'show_email', label: 'Show Email', desc: 'Display email on public profile' },
                                        { id: 'show_activity_status', label: 'Activity Status', desc: 'Show when you are active' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-2">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => handlePrivacyToggle(item.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings[item.id] ? 'bg-[#5D41E6]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-2xl space-y-6">
                                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Customize the look and feel.</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        {darkMode ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-orange-500" />}
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{darkMode ? 'Using dark theme' : 'Using light theme'}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-[#5D41E6]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
