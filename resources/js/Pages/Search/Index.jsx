import { Head, Link, router } from '@inertiajs/react';
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
            <Head title="Search Quotes" />

            <div className="px-4 py-6 pb-20 space-y-6">
                <SearchBar initialValue={localFilters.q} />

                <div className="flex justify-end">
                    <Link href="/topics" className="text-sm font-medium text-#5D41E6 dark:text-purple-400 hover:underline flex items-center gap-1">
                        Browse Topics <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                >
                    <Filter className="w-5 h-5" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                    {hasActiveFilters && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-#5D41E6 text-xs rounded-full">
                            Active
                        </span>
                    )}
                </button>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div
                        className={`${showFilters ? 'block' : 'hidden'
                            } lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6`}
                    >
                        <div className="flex justify-between mb-4">
                            <h2 className="font-semibold flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                            </h2>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-#5D41E6"
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
                                            ? 'bg-#5D41E6 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3 space-y-4">
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
                                                        ? 'bg-#5D41E6 text-white'
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
                            <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl text-center">
                                <h3 className="font-semibold mb-2">
                                    No results found
                                </h3>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-3 bg-#5D41E6 text-white rounded-xl"
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
