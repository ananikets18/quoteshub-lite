import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { UserPlus, Users, Check, ChevronRight } from 'lucide-react';

export default function SuggestedUsers({ auth, inline = false }) {
    const [suggested, setSuggested] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState({});

    useEffect(() => {
        fetchSuggested();
    }, []);

    const fetchSuggested = async () => {
        try {
            const response = await fetch('/api/activity/suggested-users');
            const data = await response.json();
            setSuggested(data.suggested || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch suggested users:', error);
            setLoading(false);
        }
    };

    const handleFollow = (username, userId) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        const wasFollowing = following[userId];

        // Optimistic update
        setFollowing(prev => ({ ...prev, [userId]: !wasFollowing }));

        router.post(`/users/${username}/follow`, {}, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                // Revert on error
                setFollowing(prev => ({ ...prev, [userId]: wasFollowing }));
            },
        });
    };

    const getAvatar = (user) => {
        if (user.avatar) {
            return `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=80`;
    };

    if (loading) {
        return null; // Don't show while loading to avoid layout shift
    }

    if (suggested.length === 0) {
        return null; // Don't show if no suggestions
    }

    // Instagram-style inline horizontal scroll
    if (inline) {
        return (
            <div className="my-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Suggested for you
                    </h3>
                    <Link
                        href="/search?tab=users"
                        className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1"
                    >
                        See All
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                    {suggested.slice(0, 10).map((user) => (
                        <div
                            key={user.id}
                            className="flex-shrink-0 w-40 snap-start"
                        >
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                                {/* Avatar */}
                                <Link href={`/${user.username}`} className="block">
                                    <img
                                        src={getAvatar(user)}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-purple-100 dark:ring-purple-900"
                                    />
                                </Link>

                                {/* User Info */}
                                <Link
                                    href={`/${user.username}`}
                                    className="block text-center mb-3"
                                >
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                        {user.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        @{user.username}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {user.followers_count} followers
                                    </p>
                                </Link>

                                {/* Follow Button */}
                                {auth.user && auth.user.id !== user.id && (
                                    <button
                                        onClick={() => handleFollow(user.username, user.id)}
                                        className={`w-full px-3 py-1.5 rounded-md text-xs font-medium transition-all ${following[user.id]
                                                ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                    >
                                        {following[user.id] ? (
                                            <span className="flex items-center justify-center gap-1">
                                                <Check className="w-3 h-3" />
                                                Following
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1">
                                                <UserPlus className="w-3 h-3" />
                                                Follow
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Original sidebar version (kept for backward compatibility, but not used)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Suggested for You
            </h2>

            <div className="space-y-4">
                {suggested.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        {/* Avatar */}
                        <Link href={`/${user.username}`}>
                            <img
                                src={getAvatar(user)}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                        </Link>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/${user.username}`}
                                className="block"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    {user.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    @{user.username}
                                </p>
                            </Link>

                            {user.bio && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {user.bio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{user.followers_count} followers</span>
                                <span>•</span>
                                <span>{user.quotes_count} quotes</span>
                            </div>
                        </div>

                        {/* Follow Button */}
                        {auth.user && auth.user.id !== user.id && (
                            <button
                                onClick={() => handleFollow(user.username, user.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${following[user.id]
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                {following[user.id] ? (
                                    <span className="flex items-center gap-1">
                                        <Check className="w-4 h-4" />
                                        Following
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <UserPlus className="w-4 h-4" />
                                        Follow
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/search?tab=users"
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                    Discover more people →
                </Link>
            </div>
        </div>
    );
}
