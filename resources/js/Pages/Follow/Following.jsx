import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${user.name} is Following`} />

            <div className="max-w-3xl mx-auto">
                <Link
                    href={`/u/${user.username}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-purple-600" />
                        {user.name} is Following
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {following.total} user{following.total !== 1 ? 's' : ''}
                    </p>
                </div>

                {following.data.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {following.data.map((followedUser) => (
                                <div
                                    key={followedUser.id}
                                    className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
                                >
                                    <Link
                                        href={`/u/${followedUser.username}`}
                                        className="flex items-center space-x-4 flex-1 min-w-0"
                                    >
                                        <img
                                            src={avatarUrl(followedUser)}
                                            alt={followedUser.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 hover:text-purple-600 truncate">
                                                {followedUser.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">@{followedUser.username}</p>
                                            {followedUser.bio && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{followedUser.bio}</p>
                                            )}
                                        </div>
                                    </Link>

                                    {!followedUser.is_self && auth.user && (
                                        <button
                                            onClick={() => handleToggleFollow(followedUser)}
                                            className={`ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 rounded-lg transition ${
                                                followingStates[followedUser.id]
                                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
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
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Not following anyone yet</h3>
                        <p className="text-gray-600">
                            {user.name} isn't following any users yet.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
