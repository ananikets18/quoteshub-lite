import { useState, useEffect, useRef, useCallback } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import QuoteCardSkeleton from '@/Components/QuoteCardSkeleton';
import SuggestedUsers from '@/Components/SuggestedUsers';
import useScrollDirection from '@/Hooks/useScrollDirection';
import { TrendingUp, Clock, Sparkles, Loader2, ChevronRight } from 'lucide-react';

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
            { id: 'foryou', label: 'For You', icon: Sparkles, description: 'Personalized feed' },
            { id: 'latest', label: 'Latest', icon: Clock, description: 'Recent quotes' },
            { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Popular now' },
        ]
        : [
            { id: 'latest', label: 'Latest', icon: Clock, description: 'Recent quotes' },
            { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Popular now' },
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

    const getCategoryColor = (color) => {
        // Fallback or mapping for pill styles
        const colors = {
            purple: 'bg-purple-100/50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30',
            blue: 'bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
            green: 'bg-green-100/50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
            yellow: 'bg-yellow-100/50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
            orange: 'bg-orange-100/50 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30',
            pink: 'bg-pink-100/50 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30',
            red: 'bg-red-100/50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
            indigo: 'bg-indigo-100/50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30',
        };
        return colors[color] || colors.purple;
    };

    const handleCategoryClick = (categorySlug) => {
        router.visit(`/category/${categorySlug}`);
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
        <AppLayout title="Feed" showLogo={true}>
            <SeoHead
                title="Feed"
                description="Your personalized feed of inspiring quotes. Discover, like, and share wisdom from around the world."
            />
            {/* Sticky Header Section - Hides on scroll down */}
            <div className={`sticky top-[60px] z-30 bg-gray-50 dark:bg-gray-900 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
                }`}>

                {/* Filter Tabs - Enhanced Design */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-2">
                            {filters.map((filter) => {
                                const Icon = filter.icon;
                                const isActive = activeFilter === filter.id;

                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => changeFilter(filter.id)}
                                        className={`flex-1 group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                            <span className="whitespace-nowrap">{filter.label}</span>
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Categories Horizontal Scroll - Enhanced */}
                {categories && categories.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="max-w-3xl mx-auto px-4 py-3">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                {categories?.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.slug)}
                                        className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm border ${getCategoryColor(category.color)}`}
                                    >
                                        <span className="text-sm">{category.icon}</span>
                                        <span>{category.name}</span>
                                        <ChevronRight className="w-3 h-3 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto">
                {/* Welcome Banner for New Users */}
                {auth.user && activeFilter === 'foryou' && quotes.length === 0 && !initialLoading && (
                    <div className="mx-4 mt-4 mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Welcome to QuotesHub! 🎉</h3>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    Start exploring quotes, like and save your favorites to get personalized recommendations tailored just for you!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {initialLoading ? (
                    <div className="space-y-0 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <QuoteCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="mx-4 mt-8 mb-12">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                                {activeFilter === 'foryou' ? (
                                    <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                ) : activeFilter === 'trending' ? (
                                    <TrendingUp className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                ) : (
                                    <Clock className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {activeFilter === 'foryou' ? 'No Personalized Quotes Yet' : 'No Quotes Found'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                                {activeFilter === 'foryou'
                                    ? 'Start liking and saving quotes to get personalized recommendations!'
                                    : 'No quotes available at the moment. Check back soon or create your own!'}
                            </p>
                            {!auth.user && (
                                <button
                                    onClick={() => router.visit('/register')}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Quotes List */}
                        <div className="mt-4">
                            {quotes.map((quote, index) => (
                                <div key={`quote-${quote.id}`}>
                                    <QuoteCard quote={quote} auth={auth} collections={collections} />

                                    {/* Insert Suggested Users ONLY ONCE after 5th quote in "For You" feed */}
                                    {activeFilter === 'foryou' && auth.user && index === 4 && (
                                        <SuggestedUsers auth={auth} inline={true} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Infinite Scroll Sentinel */}
                        <div ref={sentinelRef} className="h-24 flex items-center justify-center mb-4">
                            {loading && (
                                <div className="flex flex-col items-center gap-3 py-8">
                                    <div className="relative">
                                        <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                                        <div className="absolute inset-0 w-8 h-8 border-2 border-purple-200 dark:border-purple-800 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Loading more quotes...
                                    </span>
                                </div>
                            )}
                            {!hasMore && quotes.length > 0 && (
                                <div className="py-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            You've reached the end
                                        </span>
                                        <span className="text-lg">🎉</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
