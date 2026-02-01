import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Bookmark, UserPlus, FileText, TrendingUp } from 'lucide-react';

export default function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
        // Refresh every 30 seconds
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activity/feed');
            const data = await response.json();
            setActivities(data.activities || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart className="w-4 h-4 text-red-500" />;
            case 'save':
                return <Bookmark className="w-4 h-4 text-blue-500" />;
            case 'follow':
                return <UserPlus className="w-4 h-4 text-green-500" />;
            case 'quote':
                return <FileText className="w-4 h-4 text-purple-500" />;
            default:
                return <TrendingUp className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityText = (activity) => {
        switch (activity.type) {
            case 'like':
                return (
                    <>
                        <Link
                            href={`/${activity.user.username}`}
                            className="font-semibold hover:underline"
                        >
                            {activity.user.name}
                        </Link>
                        {' liked '}
                        <Link
                            href={`/quotes/${activity.quote.id}`}
                            className="text-purple-600 hover:underline"
                        >
                            a quote
                        </Link>
                    </>
                );
            case 'save':
                return (
                    <>
                        <Link
                            href={`/${activity.user.username}`}
                            className="font-semibold hover:underline"
                        >
                            {activity.user.name}
                        </Link>
                        {' saved '}
                        <Link
                            href={`/quotes/${activity.quote.id}`}
                            className="text-purple-600 hover:underline"
                        >
                            a quote
                        </Link>
                    </>
                );
            case 'follow':
                return (
                    <>
                        <Link
                            href={`/${activity.user.username}`}
                            className="font-semibold hover:underline"
                        >
                            {activity.user.name}
                        </Link>
                        {' followed you'}
                    </>
                );
            case 'quote':
                return (
                    <>
                        <Link
                            href={`/${activity.user.username}`}
                            className="font-semibold hover:underline"
                        >
                            {activity.user.name}
                        </Link>
                        {' created '}
                        <Link
                            href={`/quotes/${activity.quote.id}`}
                            className="text-purple-600 hover:underline"
                        >
                            a new quote
                        </Link>
                    </>
                );
            default:
                return null;
        }
    };

    const getAvatar = (user) => {
        if (user.avatar) {
            return `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32`;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Recent Activity
                </h2>
                <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Follow people to see their activity here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Recent Activity
            </h2>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div
                        key={`${activity.type}-${activity.created_at}-${index}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        {/* Avatar */}
                        <Link href={`/${activity.user.username}`}>
                            <img
                                src={getAvatar(activity.user)}
                                alt={activity.user.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                        </Link>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                                <div className="mt-1">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {getActivityText(activity)}
                                    </p>

                                    {/* Quote preview for like/save/quote activities */}
                                    {activity.quote && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate">
                                            "{activity.quote.content.substring(0, 60)}
                                            {activity.quote.content.length > 60 ? '...' : ''}"
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {activity.timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/notifications"
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                    View all activity →
                </Link>
            </div>
        </div>
    );
}
