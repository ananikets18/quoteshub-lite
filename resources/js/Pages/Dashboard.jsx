import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Home, TrendingUp, BookOpen, Users, Sparkles, ArrowRight, Heart, Bookmark, Eye, BarChart3, Award, Zap, Clock, TrendingDown } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="px-4 py-6 pb-20">
                {/* This Week Highlights */}
                {stats?.this_week && (stats.this_week.quotes > 0 || stats.this_week.likes > 0 || stats.this_week.followers > 0) && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 mb-6 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5" />
                            <h2 className="text-lg font-bold">This Week's Progress</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.this_week.quotes}</div>
                                <div className="text-xs opacity-90">Quotes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.this_week.likes}</div>
                                <div className="text-xs opacity-90">Likes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.this_week.followers}</div>
                                <div className="text-xs opacity-90">Followers</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                        <BookOpen className="w-6 h-6 opacity-80 mb-2" />
                        <div className="text-3xl font-bold mb-1">{stats?.quotes_count || 0}</div>
                        <div className="text-sm opacity-90">Your Quotes</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                        <Heart className="w-6 h-6 opacity-80 mb-2" />
                        <div className="text-3xl font-bold mb-1">{stats?.total_likes || 0}</div>
                        <div className="text-sm opacity-90">Total Likes</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
                        <Users className="w-6 h-6 opacity-80 mb-2" />
                        <div className="text-3xl font-bold mb-1">{stats?.followers_count || 0}</div>
                        <div className="text-sm opacity-90">Followers</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
                        <TrendingUp className="w-6 h-6 opacity-80 mb-2" />
                        <div className="text-3xl font-bold mb-1">{stats?.daily_streak || 0}</div>
                        <div className="text-sm opacity-90">Day Streak</div>
                    </div>
                </div>

                {/* Simple Progress Graph */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Engagement Overview
                    </h2>
                    <div className="space-y-6">
                        {/* Graph Area */}
                        <div className="relative h-48 flex items-end gap-2 px-4">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                                <span>{Math.max(stats?.total_likes || 0, stats?.total_saves || 0, stats?.followers_count || 0)}</span>
                                <span>{Math.round(Math.max(stats?.total_likes || 0, stats?.total_saves || 0, stats?.followers_count || 0) * 0.75)}</span>
                                <span>{Math.round(Math.max(stats?.total_likes || 0, stats?.total_saves || 0, stats?.followers_count || 0) * 0.5)}</span>
                                <span>{Math.round(Math.max(stats?.total_likes || 0, stats?.total_saves || 0, stats?.followers_count || 0) * 0.25)}</span>
                                <span>0</span>
                            </div>
                            
                            {/* Grid lines */}
                            <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="border-t border-gray-200 dark:border-gray-700 border-dashed" />
                                ))}
                            </div>

                            {/* Bars */}
                            <div className="flex-1 flex items-end justify-around gap-4 pl-8 relative z-10">
                                {/* Likes Bar */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                                            {stats?.total_likes || 0}
                                        </div>
                                        <div 
                                            className="w-full bg-gradient-to-t from-red-500 to-pink-500 rounded-t-lg transition-all duration-700 ease-out min-h-[4px] relative group"
                                            style={{ 
                                                height: `${Math.max((stats?.total_likes || 0) / Math.max(stats?.total_likes || 1, stats?.total_saves || 1, stats?.followers_count || 1) * 100, 2)}%` 
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-2">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Likes</span>
                                    </div>
                                </div>

                                {/* Saves Bar */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                                            {stats?.total_saves || 0}
                                        </div>
                                        <div 
                                            className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-700 ease-out min-h-[4px] relative group"
                                            style={{ 
                                                height: `${Math.max((stats?.total_saves || 0) / Math.max(stats?.total_likes || 1, stats?.total_saves || 1, stats?.followers_count || 1) * 100, 2)}%` 
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-2">
                                        <Bookmark className="w-5 h-5 text-purple-500" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Saves</span>
                                    </div>
                                </div>

                                {/* Followers Bar */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                                            {stats?.followers_count || 0}
                                        </div>
                                        <div 
                                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-700 ease-out min-h-[4px] relative group"
                                            style={{ 
                                                height: `${Math.max((stats?.followers_count || 0) / Math.max(stats?.total_likes || 1, stats?.total_saves || 1, stats?.followers_count || 1) * 100, 2)}%` 
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 mt-2">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Bookmark className="w-4 h-4 text-purple-500" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.total_saves || 0}</span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Saves</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.total_views || 0}</span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Views</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <BookOpen className="w-4 h-4 text-orange-500" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.collections_count || 0}</span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Collections</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performing Quote */}
                {stats?.top_quote && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-5 mb-6 border-2 border-yellow-300 dark:border-yellow-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Quote</h2>
                        </div>
                        <Link
                            href={`/quotes/${stats.top_quote.id}`}
                            className="block group"
                        >
                            <p className="text-gray-900 dark:text-white font-medium mb-3 line-clamp-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                "{stats.top_quote.content}"
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                                    <Heart className="w-4 h-4 fill-current" />
                                    {stats.top_quote.likes_count || 0}
                                </span>
                                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                                    <Bookmark className="w-4 h-4" />
                                    {stats.top_quote.saves_count || 0}
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Collections Showcase */}
                {stats?.public_collections && stats.public_collections.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Collections</h2>
                            <Link
                                href="/collections"
                                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {stats.public_collections.slice(0, 2).map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.id}`}
                                    className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {collection.name}
                                            </h3>
                                            {collection.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                                                    {collection.description}
                                                </p>
                                            )}
                                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                                {collection.quotes_count} {collection.quotes_count === 1 ? 'quote' : 'quotes'}
                                            </span>
                                        </div>
                                        <BookOpen className="w-5 h-5 text-purple-500 flex-shrink-0 ml-2" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity - Show either user quotes OR following activity */}
                {stats?.recent_quotes && stats.recent_quotes.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Recent Quotes</h2>
                            <Link
                                href={`/${auth.user.username}`}
                                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recent_quotes.slice(0, 2).map((quote) => (
                                <Link
                                    key={quote.id}
                                    href={`/quotes/${quote.id}`}
                                    className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                                >
                                    <p className="text-gray-900 dark:text-white font-medium mb-3 line-clamp-2">
                                        "{quote.content}"
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4 text-red-500" />
                                            {quote.likes_count || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Bookmark className="w-4 h-4 text-purple-500" />
                                            {quote.saves_count || 0}
                                        </span>
                                        <span className="ml-auto text-xs">{quote.time_ago || 'Recently'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : stats?.following_activity && stats.following_activity.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent from Following</h2>
                        </div>
                        <div className="space-y-4">
                            {stats.following_activity.slice(0, 3).map((activity, index) => (
                                <div key={index} className="flex gap-3">
                                    <Link href={`/${activity.user.username}`} className="flex-shrink-0">
                                        {activity.user.avatar ? (
                                            <img
                                                src={activity.user.avatar}
                                                alt={activity.user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {activity.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={`/${activity.user.username}`}
                                                className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                                            >
                                                {activity.user.name}
                                            </Link>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {activity.quote.time_ago}
                                            </span>
                                        </div>
                                        <Link href={`/quotes/${activity.quote.id}`} className="block">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                                "{activity.quote.content}"
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {activity.quote.likes_count}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
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
