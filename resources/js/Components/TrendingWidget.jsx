import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { TrendingUp, Flame, ArrowUp } from 'lucide-react';

export default function TrendingWidget() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
        // Refresh every 5 minutes
        const interval = setInterval(fetchTrending, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchTrending = async () => {
        try {
            const response = await fetch('/api/activity/trending');
            const data = await response.json();
            setTrending(data.trending || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch trending:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Trending Now
                </h2>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (trending.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Trending Now
                </h2>
                <div className="text-center py-8">
                    <Flame className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No trending quotes yet
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Trending Now
            </h2>

            <div className="space-y-4">
                {trending.map((quote, index) => (
                    <Link
                        key={quote.id}
                        href={`/quotes/${quote.id}`}
                        className="block group"
                    >
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-relaxed">
                                    "{quote.content}"
                                </p>

                                {quote.author && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                                        — {quote.author}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-3 mt-2 text-xs">
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
                                        <ArrowUp className="w-3.5 h-3.5" />
                                        <span>{quote.likes_today} today</span>
                                    </div>
                                    <div className="text-gray-400 dark:text-gray-500">
                                        •
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        {quote.total_likes} total
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/feed?sort=trending"
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                    View all trending →
                </Link>
            </div>
        </div>
    );
}
