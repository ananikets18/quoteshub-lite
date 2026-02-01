import { Head, Link, router } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import SearchBar from '@/Components/SearchBar';
import QuoteCard from '@/Components/QuoteCard';
import { Filter, X, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    auth,
    quotes,
    categories,
    popularTags,
    filters,
    collections = [],
}) {
    const [showFilters, setShowFilters] = useState(false);

    const [localFilters, setLocalFilters] = useState({
        q: filters.q || '',
        category: filters.category || '',
        tag: filters.tag || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        sort: filters.sort || 'latest',
    });

    const handleFilterChange = (key, value) => {
        const next = { ...localFilters, [key]: value };
        setLocalFilters(next);

        const clean = Object.fromEntries(
            Object.entries(next).filter(([_, v]) => v !== '' && v !== null)
        );

        router.get('/search', clean, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const clearFilters = () => {
        const reset = {
            q: localFilters.q,
            category: '',
            tag: '',
            start_date: '',
            end_date: '',
            sort: 'latest',
        };

        setLocalFilters(reset);
        router.get('/search', { q: reset.q });
    };

    const hasActiveFilters =
        localFilters.category ||
        localFilters.tag ||
        localFilters.start_date ||
        localFilters.end_date ||
        localFilters.sort !== 'latest';

    return (
        <AppLayout title="Search Quotes" showNav>
            <SeoHead
                title={`Search: ${localFilters.q || 'All Quotes'}`}
                description={`Search results for '${localFilters.q || 'quotes'}' on QuotesHub. Filter by category, tag, and more.`}
            />

            <div className="px-4 sm:px-6 py-6 sm:py-8 pb-20 max-w-6xl mx-auto space-y-6 sm:space-y-8">
                <div className="max-w-2xl mx-auto">
                    <SearchBar initialValue={localFilters.q} />
                </div>

                <div className="flex justify-end max-w-2xl mx-auto">
                    <Link href="/topics" className="text-sm font-semibold text-[#5D41E6] dark:text-purple-400 hover:text-[#4b33c2] dark:hover:text-purple-300 flex items-center gap-1.5 transition-colors group">
                        <span>Browse Topics</span>
                        <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </Link>
                </div>

                {/* Mobile Filter Toggle */}
                {quotes.total > 0 && (
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all font-semibold"
                    >
                        <Filter className="w-5 h-5" />
                        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        {hasActiveFilters && (
                            <span className="ml-2 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-[#5D41E6] dark:text-purple-400 text-xs font-bold rounded-full">
                                Active
                            </span>
                        )}
                    </button>
                )}

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    {quotes.total > 0 && (
                        <div
                            className={`${showFilters ? 'block' : 'hidden'
                                } lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 h-fit sticky top-24`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2.5">
                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <Filter className="w-5 h-5 text-[#5D41E6] dark:text-purple-400" />
                                    </div>
                                    <span>Filters</span>
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm font-semibold text-[#5D41E6] dark:text-purple-400 hover:text-[#4b33c2] dark:hover:text-purple-300 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <label className="block text-sm mb-2">Sort By</label>
                                <select
                                    value={localFilters.sort}
                                    onChange={(e) =>
                                        handleFilterChange('sort', e.target.value)
                                    }
                                    className="w-full rounded-xl"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="most_saved">Most Saved</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm mb-2">
                                    Category
                                </label>
                                <select
                                    value={localFilters.category}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'category',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <label className="block text-sm mb-2 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Date Range
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'start_date',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl mb-2"
                                />
                                <input
                                    type="date"
                                    value={localFilters.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'end_date',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm mb-2">
                                    Popular Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() =>
                                                handleFilterChange('tag', tag.name)
                                            }
                                            className={`px-3 py-1 rounded-full text-xs ${localFilters.tag === tag.name
                                                ? 'bg-[#5D41E6] text-white'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                                }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <div className={`${quotes.total > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
                        <p className="text-sm text-gray-600">
                            {quotes.total} result
                            {quotes.total !== 1 && 's'}
                        </p>

                        {quotes.data.length ? (
                            <>
                                {quotes.data.map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        auth={auth}
                                        collections={collections}
                                    />
                                ))}

                                {quotes.links.length > 3 && (
                                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                                        {quotes.links.map((link, i) =>
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                    className={`px-4 py-2 rounded-xl ${link.active
                                                        ? 'bg-[#5D41E6] text-white'
                                                        : 'bg-white dark:bg-gray-800'
                                                        }`}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    className="px-4 py-2 rounded-xl opacity-50"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 sm:p-16 text-center">
                                <div className="max-w-sm mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Filter className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        Try adjusting your filters or search terms
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
