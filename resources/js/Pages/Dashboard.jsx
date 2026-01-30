import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Home, TrendingUp, BookOpen, Users, Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="px-4 py-6 pb-20">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {auth.user.name}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your quotes today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <BookOpen className="w-6 h-6 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.quotes_count || auth.user.quotes_count || 0}</div>
                        <div className="text-sm opacity-90">Your Quotes</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-6 h-6 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.followers_count || auth.user.followers_count || 0}</div>
                        <div className="text-sm opacity-90">Followers</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Heart className="w-6 h-6 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.total_likes || 0}</div>
                        <div className="text-sm opacity-90">Total Likes</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-6 h-6 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats?.daily_streak || auth.user.daily_streak || 0}</div>
                        <div className="text-sm opacity-90">Day Streak</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/quotes/create"
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Create Quote</span>
                        </Link>

                        <Link
                            href="/feed"
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Explore Feed</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                {stats?.recent_quotes && stats.recent_quotes.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Recent Quotes</h2>
                            <Link
                                href={`/profile/${auth.user.username}`}
                                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recent_quotes.slice(0, 3).map((quote) => (
                                <Link
                                    key={quote.id}
                                    href={`/quotes/${quote.id}`}
                                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <p className="text-gray-900 dark:text-white font-medium mb-2 line-clamp-2">
                                        "{quote.content}"
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {quote.likes_count || 0}
                                        </span>
                                        <span>{quote.time_ago || 'Recently'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Start Your Quote Journey
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Share your first inspiring quote with the community
                        </p>
                        <Link
                            href="/quotes/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Create Your First Quote
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
