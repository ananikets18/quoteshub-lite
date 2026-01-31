import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { ArrowLeft, UserX, Shield } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function BlockedUsers({ auth, blockedUsers: initialBlockedUsers = [] }) {
    const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);
    const [unblocking, setUnblocking] = useState(null);

    const handleUnblock = async (username) => {
        setUnblocking(username);
        try {
            await axios.delete(`/users/${username}/block`);
            setBlockedUsers(blockedUsers.filter(user => user.username !== username));
        } catch (error) {
            console.error('Failed to unblock user:', error);
            alert('Failed to unblock user. Please try again.');
        } finally {
            setUnblocking(null);
        }
    };

    return (
        <AppLayout title="Blocked Users">
            <SeoHead title="Blocked Users" description="Manage your blocked users on QuotesHub." />

            <div className="px-4 py-6 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Settings
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Blocked Users
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage users you have blocked
                    </p>
                </div>

                {/* Blocked Users List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {blockedUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No blocked users
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                You haven't blocked anyone yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {blockedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUnblock(user.username)}
                                        disabled={unblocking === user.username}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-4"
                                    >
                                        {unblocking === user.username ? 'Unblocking...' : 'Unblock'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex gap-3">
                        <UserX className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                About Blocking
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                When you block someone, they won't be able to see your quotes, follow you, or interact with your content. You also won't see their content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
