import { Head, Link } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import SearchBar from '@/Components/SearchBar';
import QuoteCard from '@/Components/QuoteCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Index({
    auth,
    quotes,
    filters,
    collections = [],
}) {
    const searchQuery = filters.q || '';

    return (
        <AppLayout title="Search Quotes" showNav>
            <SeoHead
                title={`Search: ${searchQuery || 'All Quotes'}`}
                description={`Search results for '${searchQuery || 'quotes'}' on QuotesHub.`}
            />

            <div className="px-4 sm:px-6 py-6 sm:py-8 pb-20 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <div className="max-w-2xl mx-auto">
                    <SearchBar initialValue={searchQuery} />
                </div>

                <div className="flex justify-end max-w-2xl mx-auto">
                    <Link href="/topics" className="text-sm font-semibold text-[#5D41E6] dark:text-purple-400 hover:text-[#4b33c2] dark:hover:text-purple-300 flex items-center gap-1.5 transition-colors group">
                        <span>Browse Topics</span>
                        <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </Link>
                </div>

                {/* Results */}
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {quotes.total} result{quotes.total !== 1 && 's'}
                        {searchQuery && <> for "<span className="font-semibold text-gray-900 dark:text-white">{searchQuery}</span>"</>}
                    </p>

                    {quotes.data.length ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                {quotes.data.map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        auth={auth}
                                        collections={collections}
                                    />
                                ))}
                            </div>

                            {quotes.links.length > 3 && (
                                <div className="flex flex-wrap gap-2 justify-center mt-6">
                                    {quotes.links.map((link, i) =>
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-4 py-2 rounded-xl transition-all ${link.active
                                                    ? 'bg-[#5D41E6] text-white shadow-md'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </Link>
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-4 py-2 rounded-xl opacity-50 text-gray-500 dark:text-gray-500"
                                            >
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 sm:p-16 text-center">
                            <div className="max-w-sm mx-auto">
                                <div className="w-20 h-20 mx-auto mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                    <SearchIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No results found
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    {searchQuery
                                        ? `No quotes found matching "${searchQuery}". Try different keywords.`
                                        : 'Start searching to find inspiring quotes.'
                                    }
                                </p>
                                <Link
                                    href="/topics"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    Browse Topics
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
