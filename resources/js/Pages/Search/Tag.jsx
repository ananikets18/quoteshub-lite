import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import QuoteCard from '@/Components/QuoteCard';
import { Hash } from 'lucide-react';

export default function Tag({ auth, tag, quotes, sort, collections = [] }) {
    const handleSortChange = (newSort) => {
        router.get(`/tag/${tag.name}`, { sort: newSort }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={`#${tag.name}`} showNav={true}>
            <SeoHead title={`#${tag.name} Quotes`} description={`Explore quotes tagged with #${tag.name} on QuotesHub.`} />

            <div className="px-4 sm:px-6 py-6 sm:py-8 pb-20 max-w-6xl mx-auto space-y-6 sm:space-y-8">
                {/* Tag Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-[#5D41E6] dark:text-purple-400" />
                                </div>
                                {tag.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                                {quotes.total} quote{quotes.total !== 1 ? 's' : ''} with this tag
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-full sm:w-auto">
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full sm:w-auto rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#5D41E6] dark:focus:border-purple-500 focus:ring-[#5D41E6] dark:focus:ring-purple-500"
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Most Popular</option>
                                <option value="most_saved">Most Saved</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Quotes Grid */}
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

                        {/* Pagination */}
                        {quotes.links.length > 3 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-6">
                                {quotes.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 rounded-xl ${
                                                link.active
                                                    ? 'bg-[#5D41E6] text-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 sm:p-16 text-center">
                        <div className="max-w-sm mx-auto">
                            <div className="w-20 h-20 mx-auto mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <Hash className="w-10 h-10 text-[#5D41E6] dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No quotes yet</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                No quotes found with this tag.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
