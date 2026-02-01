import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import Pagination from '@/Components/Pagination';
import { Users, UserPlus, UserCheck, ArrowLeft } from 'lucide-react';

export default function Following({ auth, user, following }) {
    const [followingStates, setFollowingStates] = useState(
        following.data.reduce((acc, followedUser) => ({ ...acc, [followedUser.id]: followedUser.is_following }), {})
    );

    const handleToggleFollow = (followedUser) => {
        if (followedUser.is_self) return;

        const isFollowing = followingStates[followedUser.id];
        setFollowingStates({ ...followingStates, [followedUser.id]: !isFollowing });

        router.post(`/users/${followedUser.username}/follow`, {}, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                setFollowingStates({ ...followingStates, [followedUser.id]: isFollowing });
            },
        });
    };

    const avatarUrl = (user) => user.avatar 
        ? `/storage/${user.avatar}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <AppLayout user={auth.user} showNav={true}>
            <SeoHead title={`${user.name} is Following`} description={`See who ${user.name} follows on QuotesHub.`} />

            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 max-w-4xl mx-auto">
                <Link
                    href={`/${user.username}`}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-purple-400 mb-6 font-medium transition-colors hover:gap-3"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>

                <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Users className="w-6 h-6 text-[#5D41E6] dark:text-purple-400" />
                        </div>
                        <span>{user.name} is Following</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-14 font-medium">
                        {following.total} user{following.total !== 1 ? 's' : ''}
                    </p>
                </div>

                {following.data.length > 0 ? (
                    <>
                        <div className="space-y-3 sm:space-y-4">
                            {following.data.map((followedUser) => (
                                <div
                                    key={followedUser.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 flex items-center justify-between hover:shadow-xl hover:scale-[1.01] transition-all"
                                >
                                    <Link
                                        href={`/${followedUser.username}`}
                                        className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0"
                                    >
                                        <img
                                            src={avatarUrl(followedUser)}
                                            alt={followedUser.name}
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 shadow-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white hover:text-[#5D41E6] dark:hover:text-purple-400 truncate transition-colors">
                                                {followedUser.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">@{followedUser.username}</p>
                                            {followedUser.bio && (
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{followedUser.bio}</p>
                                            )}
                                        </div>
                                    </Link>

                                    {!followedUser.is_self && auth.user && (
                                        <button
                                            onClick={() => handleToggleFollow(followedUser)}
                                            className={`ml-3 sm:ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${
                                                followingStates[followedUser.id]
                                                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    : 'bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] hover:shadow-lg text-white'
                                            }`}
                                        >
                                            {followingStates[followedUser.id] ? (
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
                            ))}
                        </div>

                        {/* Pagination */}
                        {following.links.length > 3 && (
                            <Pagination links={following.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Not following anyone yet</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {user.name} isn't following any users yet.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
