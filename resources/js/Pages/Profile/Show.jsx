import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
            <Head title={`${profile.name} (@${profile.username})`} />

            <div className="max-w-5xl mx-auto">
                {/* Cover Image */}
                <div className="relative h-64 bg-[#5D41E6] rounded-t-lg overflow-hidden">
                    {coverUrl && (
                        <img
                            src={coverUrl}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-b-lg shadow-sm px-6 pb-6 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end relative">
                        {/* Avatar & Name */}
                        <div className="flex items-end">
                            <div className="-mt-12 mr-4 relative z-10">
                                <img
                                    src={avatarUrl}
                                    alt={profile.name}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                            <div className="mb-1">
                                <h1 className="text-3xl font-bold text-gray-900 leading-none">{profile.name}</h1>
                                <p className="text-gray-600">@{profile.username}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 sm:mt-0">
                            {isOwnProfile ? (
                                <div className="flex gap-2">
                                    <Link
                                        href={route('settings')}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 hover:border-red-100 transition shadow-sm"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className={`inline-flex items-center px-4 py-2 rounded-lg transition ${following
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        : 'bg-[#5D41E6] hover:bg-[#4b33c2] text-white'
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
                    <div className="mt-8">
                        {profile.bio && (
                            <p className="text-gray-700 mb-4">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {profile.location && (
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {profile.location}
                                </div>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-[#5D41E6] hover:underline"
                                >
                                    <LinkIcon className="w-4 h-4 mr-1" />
                                    {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-4 gap-4 py-6 border-t border-b border-gray-100 dark:border-gray-800">
                        <div className="text-center group cursor-default">
                            <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] transition-colors">{stats.quotes_count}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Quotes</div>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] transition-colors">{stats.likes_received}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Likes</div>
                        </div>
                        <Link href={`/${profile.username}/followers`} className="text-center group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg -my-2 py-2 transition">
                            <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] transition-colors">{followersCount}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Followers</div>
                        </Link>
                        <Link href={`/${profile.username}/following`} className="text-center group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg -my-2 py-2 transition">
                            <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D41E6] transition-colors">{stats.following_count}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Following</div>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#5D41E6]" />
                                Recent Quotes
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {quotes.data.length} {quotes.data.length === 1 ? 'Quote' : 'Quotes'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quotes Grid */}
                <div className="mt-6">
                    {quotes.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quotes.data.map((quote) => (
                                <QuoteCard
                                    key={quote.id}
                                    quote={quote}
                                    auth={auth}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                            <p className="text-gray-600">
                                {isOwnProfile
                                    ? "Start sharing your favorite quotes with the world!"
                                    : "This user hasn't posted any quotes yet."
                                }
                            </p>
                        </div>
                    )}

                    <Pagination links={quotes.links} />
                </div>
            </div>
        </AppLayout>
    );
}
