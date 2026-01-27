import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import { TrendingUp, Clock, Star, Filter } from 'lucide-react';

export default function Feed({ quotes: initialQuotes, categories }) {
    const { auth } = usePage().props;
    const [quotes, setQuotes] = useState(initialQuotes.data || []);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('latest');
    const [page, setPage] = useState(1);

    const filters = [
        { id: 'latest', label: 'Latest', icon: Clock },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'featured', label: 'Featured', icon: Star },
    ];

    const loadMore = () => {
        if (loading || !initialQuotes.next_page_url) return;

        setLoading(true);
        setPage(page + 1);

        router.get(
            '/feed',
            { page: page + 1, sort: activeFilter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['quotes'],
                onSuccess: (page) => {
                    setQuotes([...quotes, ...(page.props.quotes.data || [])]);
                    setLoading(false);
                },
            }
        );
    };

    const changeFilter = (filterId) => {
        setActiveFilter(filterId);
        setPage(1);
        setLoading(true);

        router.get(
            '/feed',
            { sort: filterId },
            {
                preserveState: true,
                only: ['quotes'],
                onSuccess: (page) => {
                    setQuotes(page.props.quotes.data || []);
                    setLoading(false);
                },
            }
        );
    };

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 500
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, page]);

    return (
        <AppLayout title="QuotesHub">
            {/* Sticky Header Section */}
            <div className="sticky top-[60px] z-30 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">

                {/* Categories Horizontal Scroll */}
                <div className="bg-white dark:bg-gray-900 px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                className="category-badge flex-shrink-0"
                                style={{
                                    backgroundColor: category.color + '20',
                                    color: category.color,
                                    borderColor: category.color + '40',
                                    borderWidth: '1px',
                                }}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-around max-w-lg mx-auto">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.id;

                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => changeFilter(filter.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${isActive
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quotes Feed */}
            <div className="p-4">
                {quotes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No quotes yet. Be the first to create one!
                        </p>
                    </div>
                ) : (
                    <>
                        {quotes.map((quote) => (
                            <QuoteCard key={quote.id} quote={quote} auth={auth} />
                        ))}

                        {loading && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
