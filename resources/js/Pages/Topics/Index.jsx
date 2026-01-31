import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
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
            <Head title="Topics & Categories" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 pt-8 pb-6 px-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Compass className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Explore
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 ml-1">
                        Discover quotes by topic or trending tags.
                    </p>
                </div>

                <div className="px-4 animate-fade-in">
                    {/* Categories Grid */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Categories</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-white">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={`relative overflow-hidden rounded-2xl p-5 shadow-lg group hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br ${getGradient(category.color)}`}
                                >
                                    <div className="relative z-10">
                                        <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                                            {category.icon || '✨'}
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/80 text-xs font-medium">
                                            {category.quotes_count} quotes
                                        </p>
                                    </div>

                                    {/* Decorative Overlay */}
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Trending Tags */}
                    {tags.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending Tags</h2>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/tag/${tag.name}`}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <Hash className="w-4 h-4 text-purple-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {tag.name}
                                        </span>
                                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
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
