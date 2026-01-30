import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import { Users, UserPlus, UserCheck, ArrowLeft } from 'lucide-react';

export default function Followers({ auth, user, followers }) {
    const [followingStates, setFollowingStates] = useState(
        followers.data.reduce((acc, follower) => ({ ...acc, [follower.id]: follower.is_following }), {})
    );

    const handleToggleFollow = (follower) => {
        if (follower.is_self) return;

        const isFollowing = followingStates[follower.id];
        setFollowingStates({ ...followingStates, [follower.id]: !isFollowing });

        router.post(`/users/${follower.username}/follow`, {}, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                setFollowingStates({ ...followingStates, [follower.id]: isFollowing });
            },
        });
    };

    const avatarUrl = (user) => user.avatar 
        ? `/storage/${user.avatar}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <AppLayout user={auth.user} showNav={true}>
            <Head title={`${user.name}'s Followers`} />

            <div className="px-4 py-6 pb-20">
                <Link
                    href={`/${user.username}`}
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
                        <Users className="w-7 h-7 mr-2 text-purple-600 dark:text-purple-400" />
                        {user.name}'s Followers
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {followers.total} follower{followers.total !== 1 ? 's' : ''}
                    </p>
                </div>

                {followers.data.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {followers.data.map((follower) => (
                                <div
                                    key={follower.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between hover:shadow-md transition-all"
                                >
                                    <Link
                                        href={`/${follower.username}`}
                                        className="flex items-center space-x-4 flex-1 min-w-0"
                                    >
                                        <img
                                            src={avatarUrl(follower)}
                                            alt={follower.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 truncate transition-colors">
                                                {follower.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">@{follower.username}</p>
                                            {follower.bio && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{follower.bio}</p>
                                            )}
                                        </div>
                                    </Link>

                                    {!follower.is_self && auth.user && (
                                        <button
                                            onClick={() => handleToggleFollow(follower)}
                                            className={`ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 rounded-full font-medium transition-all ${
                                                followingStates[follower.id]
                                                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white'
                                            }`}
                                        >
                                            {followingStates[follower.id] ? (
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
                        {followers.links.length > 3 && (
                            <Pagination links={followers.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No followers yet</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {user.name} doesn't have any followers yet.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
