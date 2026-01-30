import { useState, useEffect, useRef, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import QuoteCardSkeleton from '@/Components/QuoteCardSkeleton';
import SuggestedUsers from '@/Components/SuggestedUsers';
import useScrollDirection from '@/Hooks/useScrollDirection';
import { TrendingUp, Clock, Star, Sparkles, Loader2 } from 'lucide-react';

export default function Feed({ quotes: initialQuotes, categories, collections = [] }) {
    const { auth } = usePage().props;
    const [quotes, setQuotes] = useState(initialQuotes.data || []);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(auth.user ? 'foryou' : 'latest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(!!initialQuotes.next_page_url);
    const loadingRef = useRef(false);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Scroll direction for dynamic header/nav
    const { scrollDirection, scrollY } = useScrollDirection();

    const filters = auth.user
        ? [
            { id: 'foryou', label: 'For You', icon: Sparkles },
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'featured', label: 'Featured', icon: Star },
        ]
        : [
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'featured', label: 'Featured', icon: Star },
        ];

    const loadMore = useCallback(() => {
        if (loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setLoading(true);

        router.get(
            '/feed',
            { page: page + 1, sort: activeFilter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['quotes'],
                onSuccess: (response) => {
                    const newQuotes = response.props.quotes.data || [];
                    setQuotes(prev => [...prev, ...newQuotes]);
                    setPage(prev => prev + 1);
                    setHasMore(!!response.props.quotes.next_page_url);
                    setLoading(false);
                    loadingRef.current = false;
                },
                onError: () => {
                    setLoading(false);
                    loadingRef.current = false;
                }
            }
        );
    }, [page, activeFilter, hasMore]);

    const changeFilter = (filterId) => {
        if (filterId === activeFilter) return;
        
        setActiveFilter(filterId);
        setPage(1);
        setInitialLoading(true);
        loadingRef.current = true;

        router.get(
            '/feed',
            { sort: filterId },
            {
                preserveState: true,
                only: ['quotes'],
                onSuccess: (response) => {
                    setQuotes(response.props.quotes.data || []);
                    setHasMore(!!response.props.quotes.next_page_url);
                    setInitialLoading(false);
                    loadingRef.current = false;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
                onError: () => {
                    setInitialLoading(false);
                    loadingRef.current = false;
                }
            }
        );
    };

    // Intersection Observer for infinite scroll (better performance)
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '300px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                loadMore();
            }
        }, options);

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMore, hasMore]);

    // Determine if header should be visible
    const isHeaderVisible = scrollDirection === 'up' || scrollY < 50;

    return (
        <AppLayout title="QuotesHub">
            {/* Sticky Header Section - Hides on scroll down */}
            <div className={`sticky top-[60px] z-30 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
                }`}>

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
                <div className="bg-white dark:bg-gray-900 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 px-4 min-w-max">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.id;

                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => changeFilter(filter.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${isActive
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-semibold'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content - Edge to Edge */}
            <div className="max-w-3xl mx-auto">
                {initialLoading ? (
                    <div className="space-y-4 px-4">
                        {[...Array(5)].map((_, i) => (
                            <QuoteCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="text-center py-12 mx-4 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {activeFilter === 'foryou'
                                ? 'Start liking and saving quotes to get personalized recommendations!'
                                : 'No quotes yet. Be the first to create one!'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {quotes.map((quote, index) => (
                            <div key={`quote-${quote.id}`}>
                                <QuoteCard quote={quote} auth={auth} collections={collections} />

                                {/* Insert Suggested Users ONLY ONCE after 5th quote in "For You" feed */}
                                {activeFilter === 'foryou' && auth.user && index === 4 && (
                                    <SuggestedUsers auth={auth} inline={true} />
                                )}
                            </div>
                        ))}

                        {/* Infinite Scroll Sentinel */}
                        <div ref={sentinelRef} className="h-20 flex items-center justify-center">
                            {loading && (
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-sm font-medium">Loading more quotes...</span>
                                </div>
                            )}
                            {!hasMore && quotes.length > 0 && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    You've reached the end 🎉
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
