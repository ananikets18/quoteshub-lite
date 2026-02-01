import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { Hash, ArrowRight, Compass, Sparkles, BookOpen } from 'lucide-react';

export default function Index({ auth, categories, tags }) {
    // Helper for gradients based on color name
    const getGradient = (color) => {
        const gradients = {
            purple: 'from-purple-500 to-indigo-600',
            blue: 'from-blue-400 to-blue-600',
            green: 'from-green-400 to-emerald-600',
            yellow: 'from-yellow-400 to-orange-500',
            orange: 'from-orange-400 to-red-500',
            pink: 'from-pink-400 to-rose-500',
            red: 'from-red-500 to-rose-600',
            indigo: 'from-indigo-400 to-purple-600',
            gray: 'from-gray-500 to-gray-700',
        };
        return gradients[color] || gradients.purple;
    };

    return (
        <AppLayout title="Topics & Categories" showNav={true}>
            <SeoHead title="Topics & Categories" description="Explore quotes by topic and category on QuotesHub." />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
                {/* Header */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700 pt-8 pb-8 px-4 sm:px-6 mb-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm">
                                <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-[#5D41E6] dark:text-purple-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Explore Topics
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-14">
                            Discover quotes by topic or trending tags.
                        </p>
                    </div>
                </div>

                <div className="px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
                    {/* Categories Grid */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-white">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl group hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 bg-gradient-to-br ${getGradient(category.color)}`}
                                >
                                    <div className="relative z-10">
                                        <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300 origin-left drop-shadow-sm">
                                            {category.icon || '✨'}
                                        </div>
                                        <h3 className="font-bold text-base sm:text-lg leading-tight mb-1.5">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/90 text-xs sm:text-sm font-semibold">
                                            {category.quotes_count} quotes
                                        </p>
                                    </div>

                                    {/* Decorative Overlay */}
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-300" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Trending Tags */}
                    {tags.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                                <div className="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Trending Tags</h2>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/tag/${tag.name}`}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm hover:border-[#5D41E6] dark:hover:border-purple-700 hover:shadow-lg transition-all active:scale-95 group"
                                    >
                                        <Hash className="w-4 h-4 text-[#5D41E6] dark:text-purple-400 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                                            {tag.name}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                            {tag.quotes_count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
