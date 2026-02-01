import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { User, MapPin, Link as LinkIcon, Calendar, Users, FileText, UserPlus, UserCheck, Edit, LogOut } from 'lucide-react';

export default function Show({ auth, profile, stats, isFollowing, isOwnProfile, quotes, collections = [] }) {
    const [following, setFollowing] = useState(isFollowing);
    const [followersCount, setFollowersCount] = useState(stats.followers_count);


    const handleFollow = () => {
        const newFollowing = !following;
        setFollowing(newFollowing);
        setFollowersCount(newFollowing ? followersCount + 1 : followersCount - 1);

        router.post(`/users/${profile.username}/follow`, {}, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                setFollowing(!newFollowing);
                setFollowersCount(newFollowing ? followersCount - 1 : followersCount + 1);
            },
        });
    };

    const avatarUrl = profile.avatar
        ? `/storage/${profile.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`;

    const coverUrl = profile.cover_image
        ? `/storage/${profile.cover_image}`
        : null;

    return (
        <AppLayout title={`${profile.name}'s Profile`} showNav={true}>
            <SeoHead
                title={`${profile.name} (@${profile.username})`}
                description={`Check out ${profile.name}'s profile on QuotesHub. Views their collections, recent quotes, and statistics.`}
                image={profile.avatar ? `/storage/${profile.avatar}` : null}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cover Image - Enhanced with gradient overlay */}
                <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-[#5D41E6] via-[#7C3AED] to-[#8B5CF6] rounded-t-2xl overflow-hidden shadow-lg">
                    {coverUrl && (
                        <img
                            src={coverUrl}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Subtle overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                </div>

                {/* Profile Header - Enhanced spacing and layout */}
                <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl px-4 sm:px-6 lg:px-8 pb-6 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end relative gap-4">
                        {/* Avatar & Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0 flex-1">
                            <div className="-mt-12 sm:-mt-16 relative z-10 flex-shrink-0">
                                <img
                                    src={avatarUrl}
                                    alt={profile.name}
                                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                />
                            </div>
                            <div className="mb-0 sm:mb-2 min-w-0 flex-1">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight truncate pr-2" title={profile.name}>
                                    {profile.name}
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate mt-0.5">@{profile.username}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                            {isOwnProfile ? (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Link
                                        href={route('settings')}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${following
                                        ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'
                                        : 'bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] hover:from-[#4b33c2] hover:to-[#6b2fdb] text-white'
                                        }`}
                                >
                                    {following ? (
                                        <>
                                            <UserCheck className="w-4 h-4 mr-2" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Follow
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bio and Info */}
                    <div className="mt-6 sm:mt-8 space-y-4">
                        {profile.bio && (
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {profile.location && (
                                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg text-[#5D41E6] dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="hover:underline">{profile.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats - Enhanced with better spacing and hover effects */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-4 gap-2 sm:gap-4 py-5 sm:py-6 border-t border-b border-gray-100 dark:border-gray-700">
                        <div className="text-center group cursor-default px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors">{stats.quotes_count}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">Quotes</div>
                        </div>
                        <div className="text-center group cursor-default px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors">{stats.likes_received}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">Likes</div>
                        </div>
                        <Link href={`/${profile.username}/followers`} className="text-center group px-2 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors">{followersCount}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">Followers</div>
                        </Link>
                        <Link href={`/${profile.username}/following`} className="text-center group px-2 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] dark:group-hover:text-purple-400 transition-colors">{stats.following_count}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">Following</div>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-[#5D41E6] dark:text-purple-400" />
                                </div>
                                <span>Recent Quotes</span>
                            </h2>
                            <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                                {quotes.data.length} {quotes.data.length === 1 ? 'Quote' : 'Quotes'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quotes Grid - Enhanced spacing */}
                <div className="mt-6 sm:mt-8 mb-8">
                    {quotes.data.length > 0 ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {quotes.data.map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        auth={auth}
                                        collections={collections}
                                    />
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {quotes.links && quotes.links.length > 3 && (
                                <div className="mt-6 sm:mt-8">
                                    <Pagination links={quotes.links} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 sm:p-16 text-center border border-gray-100 dark:border-gray-700">
                            <div className="max-w-sm mx-auto">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No quotes yet</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    {isOwnProfile
                                        ? "Start sharing your favorite quotes with the world!"
                                        : "This user hasn't posted any quotes yet."
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
