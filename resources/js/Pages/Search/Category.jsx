import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import QuoteCard from '@/Components/QuoteCard';
import { Folder, TrendingUp, Clock, Bookmark } from 'lucide-react';

export default function Category({ auth, category, quotes, sort, collections = [] }) {
    const handleSortChange = (newSort) => {
        router.get(`/category/${category.slug}`, { sort: newSort }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={category.name} showNav={true}>
            <SeoHead title={`${category.name} Quotes`} description={category.description || `Explore ${category.name} quotes on QuotesHub.`} />

            <div className="max-w-5xl mx-auto">
                {/* Category Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Folder className="w-8 h-8 mr-3 text-purple-600" />
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-gray-600 mt-2">{category.description}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-4">
                                {quotes.total} quote{quotes.total !== 1 ? 's' : ''} in this category
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
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                        <p className="text-gray-600">
                            Be the first to add a quote in this category!
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
