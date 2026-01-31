import { Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Bookmark, FolderPlus } from 'lucide-react';

export default function Saved({ auth, quotes, collections = [] }) {
    const [visibleQuotes, setVisibleQuotes] = useState(quotes.data.map(q => q.id));

    const handleUnsave = (quoteId) => {
        setVisibleQuotes(prev => prev.filter(id => id !== quoteId));
    };

    return (
        <AppLayout title="Saved Quotes">
            <SeoHead title="Saved Quotes" description="Your saved quotes and collections on QuotesHub." />

            <div className="px-4 py-6 pb-20">
                {/* Header with Collections Button */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        {visibleQuotes.length} quote{visibleQuotes.length !== 1 ? 's' : ''} saved
                    </p>
                    <Link
                        href={route('collections.index')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5D41E6] hover:bg-[#4b33c2] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Collections
                    </Link>
                </div>

                {visibleQuotes.length > 0 ? (
                    <>
                        <div className="space-y-4 mb-6">
                            {quotes.data
                                .filter(quote => visibleQuotes.includes(quote.id))
                                .map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        auth={auth}
                                        collections={collections}
                                        onUnsave={handleUnsave}
                                        showSavedContext={true}
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
                            className="inline-flex items-center px-6 py-3 bg-[#5D41E6] hover:bg-[#4b33c2] text-white font-semibold rounded-full hover:shadow-lg transition-all"
                        >
                            Explore Quotes
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
