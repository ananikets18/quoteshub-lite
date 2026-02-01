import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Users, UserPlus } from 'lucide-react';

export default function Feed({ auth, quotes, followingCount, collections = [] }) {
    return (
        <AppLayout user={auth.user} showNav={true}>
            <SeoHead title="Following Feed" description="Quotes from the people you follow on QuotesHub." />

            <div className="px-4 py-6 pb-20">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
                        <Users className="w-7 h-7 mr-2 text-purple-600 dark:text-purple-400" />
                        Following Feed
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Quotes from the {followingCount} user{followingCount !== 1 ? 's' : ''} you follow
                    </p>
                </div>

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

                        <Pagination links={quotes.links} />
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <UserPlus className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {followingCount === 0 ? 'Not following anyone yet' : 'No quotes yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {followingCount === 0 
                                ? "Follow users to see their quotes in your feed!"
                                : "The users you follow haven't posted any quotes yet."
                            }
                        </p>
                        <Link
                            href={route('feed')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                        >
                            Explore Quotes
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
