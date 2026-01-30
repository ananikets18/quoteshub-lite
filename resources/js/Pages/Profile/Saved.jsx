import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Bookmark, FolderPlus } from 'lucide-react';

export default function Saved({ auth, quotes, collections = [] }) {
    return (
        <AppLayout title="Saved Quotes">
            <Head title="Saved Quotes" />

            <div className="px-4 py-6 pb-20">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Bookmark className="w-7 h-7 mr-2 text-purple-600 dark:text-purple-400" />
                            Saved Quotes
                        </h1>
                        <Link
                            href={route('collections.index')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                        >
                            <FolderPlus className="w-4 h-4" />
                            Collections
                        </Link>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {quotes.total} quote{quotes.total !== 1 ? 's' : ''} saved
                    </p>
                </div>

                {quotes.data.length > 0 ? (
                    <>
                        <div className="space-y-4 mb-6">
                            {quotes.data.map((quote) => (
                                <QuoteCard 
                                    key={quote.id} 
                                    quote={quote} 
                                    auth={auth}
                                    collections={collections}
                                />
                            ))}
                        </div>

                        {quotes.links && quotes.links.length > 3 && (
                            <Pagination links={quotes.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Bookmark className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved quotes yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start saving your favorite quotes to read them later!
                        </p>
                        <Link
                            href="/feed"
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
