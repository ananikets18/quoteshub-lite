import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import QuoteCard from '@/Components/QuoteCard';
import { Hash, TrendingUp, Clock, Bookmark } from 'lucide-react';

export default function Tag({ auth, tag, quotes, sort, collections = [] }) {
    const handleSortChange = (newSort) => {
        router.get(`/tag/${tag.name}`, { sort: newSort }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={`#${tag}`} showNav={true}>
            <SeoHead title={`#${tag.name} Quotes`} description={`Explore quotes tagged with #${tag.name} on QuotesHub.`} />

            <div className="max-w-5xl mx-auto">
                {/* Tag Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Hash className="w-8 h-8 mr-2 text-purple-600" />
                                {tag.name}
                            </h1>
                            <p className="text-sm text-gray-500 mt-4">
                                {quotes.total} quote{quotes.total !== 1 ? 's' : ''} with this tag
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div>
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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

                        {/* Pagination */}
                        {quotes.links.length > 3 && (
                            <div className="mt-6 flex justify-center space-x-2">
                                {quotes.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 rounded-lg ${
                                                link.active
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                        <p className="text-gray-600">
                            No quotes found with this tag.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
