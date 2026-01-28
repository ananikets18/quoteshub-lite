import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchBar from '@/Components/SearchBar';
import QuoteCard from '@/Components/QuoteCard';
import { Filter, X, Calendar, TrendingUp, Clock, Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function Index({ auth, quotes, categories, popularTags, filters, collections = [] }) {
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
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Remove empty filters
        const cleanFilters = Object.entries(newFilters)
            .filter(([_, v]) => v !== null && v !== '')
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
        
        router.get('/search', cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const resetFilters = {
            q: filters.q || '',
            category: '',
            tag: '',
            start_date: '',
            end_date: '',
            sort: 'latest',
        };
        setLocalFilters(resetFilters);
        router.get('/search', { q: filters.q || '' });
    };

    const hasActiveFilters = filters.category || filters.tag || filters.start_date || filters.end_date;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Search Quotes" />

            <div className="max-w-7xl mx-auto">
                {/* Search Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        Search Quotes
                    </h1>
                    <div className="flex justify-center">
                        <SearchBar initialValue={filters.q} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filters
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-purple-600 hover:text-purple-700"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="most_saved">Most Saved</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date Range
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        value={filters.start_date || ''}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="Start date"
                                    />
                                    <input
                                        type="date"
                                        value={filters.end_date || ''}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="End date"
                                    />
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Popular Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => handleFilterChange('tag', tag.name)}
                                            className={`px-3 py-1 rounded-full text-xs transition ${
                                                filters.tag === tag.name
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {filters.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                                            Category: {categories.find(c => c.id == filters.category)?.name}
                                            <button
                                                onClick={() => handleFilterChange('category', null)}
                                                className="ml-2 hover:text-purple-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.tag && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                                            Tag: {filters.tag}
                                            <button
                                                onClick={() => handleFilterChange('tag', null)}
                                                className="ml-2 hover:text-purple-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {(filters.start_date || filters.end_date) && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                                            Date: {filters.start_date || 'Start'} - {filters.end_date || 'End'}
                                            <button
                                                onClick={() => {
                                                    handleFilterChange('start_date', null);
                                                    handleFilterChange('end_date', null);
                                                }}
                                                className="ml-2 hover:text-purple-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mb-4">
                            <p className="text-gray-600">
                                {quotes.total} result{quotes.total !== 1 ? 's' : ''} found
                                {filters.q && <span> for "<span className="font-semibold">{filters.q}</span>"</span>}
                            </p>
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
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search or filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
