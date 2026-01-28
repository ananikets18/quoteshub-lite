import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Users, UserPlus } from 'lucide-react';

export default function Feed({ auth, quotes, followingCount, collections = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Following Feed" />

            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-purple-600" />
                        Following Feed
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Quotes from the {followingCount} user{followingCount !== 1 ? 's' : ''} you follow
                    </p>
                </div>

                {quotes.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quotes.data.map((quote) => (
                                <QuoteCard 
                                    key={quote.id} 
                                    quote={quote} 
                                    auth={auth}
                                    collections={collections}
                                />
                            ))}
                        </div>

                        <Pagination links={quotes.links} />
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {followingCount === 0 ? 'Not following anyone yet' : 'No quotes yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {followingCount === 0 
                                ? "Follow users to see their quotes in your feed!"
                                : "The users you follow haven't posted any quotes yet."
                            }
                        </p>
                        <Link
                            href={route('feed')}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            Explore Quotes
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
