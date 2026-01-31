import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { User, MapPin, Link as LinkIcon, Calendar, Heart, Bookmark, Users, FileText, UserPlus, UserCheck, Edit } from 'lucide-react';

export default function Show({ auth, profile, stats, isFollowing, isOwnProfile, quotes, collections = [] }) {
    const [following, setFollowing] = useState(isFollowing);
    const [followersCount, setFollowersCount] = useState(stats.followers_count);
    const [activeTab, setActiveTab] = useState('quotes');

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
                <div className="bg-white rounded-b-lg shadow-sm px-6 pb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 relative">
                        {/* Avatar */}
                        <div className="flex items-end space-x-4">
                            <img
                                src={avatarUrl}
                                alt={profile.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="pb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-gray-600">@{profile.username}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 sm:mt-0">
                            {isOwnProfile ? (
                                <Link
                                    href={route('profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
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
                    <div className="mt-6">
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
                    <div className="mt-6 flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="font-bold text-gray-900">{stats.quotes_count}</span>
                            <span className="text-gray-600 ml-1">Quotes</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">{stats.likes_received}</span>
                            <span className="text-gray-600 ml-1">Likes Received</span>
                        </div>
                        <Link href={`/${profile.username}/followers`} className="hover:underline">
                            <span className="font-bold text-gray-900">{followersCount}</span>
                            <span className="text-gray-600 ml-1">Followers</span>
                        </Link>
                        <Link href={`/${profile.username}/following`} className="hover:underline">
                            <span className="font-bold text-gray-900">{stats.following_count}</span>
                            <span className="text-gray-600 ml-1">Following</span>
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 border-t border-gray-200">
                        <div className="flex space-x-8">
                            <Link
                                href={`/${profile.username}`}
                                className={`py-4 border-b-2 transition ${activeTab === 'quotes'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <FileText className="w-4 h-4 inline mr-2" />
                                Quotes
                            </Link>
                            <Link
                                href={`/${profile.username}/liked`}
                                className={`py-4 border-b-2 transition ${activeTab === 'liked'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Heart className="w-4 h-4 inline mr-2" />
                                Liked
                            </Link>
                            {isOwnProfile && (
                                <Link
                                    href={route('saved')}
                                    className={`py-4 border-b-2 transition ${activeTab === 'saved'
                                        ? 'border-[#5D41E6] text-[#5D41E6]'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Bookmark className="w-4 h-4 inline mr-2" />
                                    Saved
                                </Link>
                            )}
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
