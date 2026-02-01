import { Link } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import { Quote, Users, Bookmark, Sparkles } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <SeoHead
                title="Welcome"
                description="QuotesHub - The ultimate destination for inspiring quotes. Join our community to discover, share, and organize your favorite wisdom."
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <div className="relative max-w-4xl mx-auto px-6 py-12 lg:py-20">
                    <header className="flex items-center justify-between mb-16 lg:mb-24">
                        <span className="text-2xl font-bold text-primary-600 dark:text-purple-400">
                            QuotesHub
                        </span>
                        <nav className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                            Your daily dose of{' '}
                            <span className="text-primary-600 dark:text-purple-400">wisdom</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            Discover, share, and save inspiring quotes. Join a community of thinkers and dreamers.
                        </p>
                        {!auth?.user && (
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                                <Link
                                    href={route('feed')}
                                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-purple-500 font-semibold transition-colors"
                                >
                                    <Quote className="w-5 h-5 text-primary-600 dark:text-purple-400" />
                                    Browse quotes
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Join free
                                </Link>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Quote className="w-6 h-6 text-primary-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Discover</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Explore quotes by topic, author, or mood. Find what moves you.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Bookmark className="w-6 h-6 text-primary-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Save & organize</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Create collections and keep your favorite quotes in one place.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Share & connect</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Follow others, share quotes, and grow with the community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="mt-24 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p className="mb-4">QuotesHub &copy; {new Date().getFullYear()}</p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link href={route('about')} className="hover:text-primary-600 dark:hover:text-purple-400 transition-colors">
                                About
                            </Link>
                            <Link href={route('privacy')} className="hover:text-primary-600 dark:hover:text-purple-400 transition-colors">
                                Privacy
                            </Link>
                            <Link href={route('terms')} className="hover:text-primary-600 dark:hover:text-purple-400 transition-colors">
                                Terms
                            </Link>
                            <Link href={route('contact')} className="hover:text-primary-600 dark:hover:text-purple-400 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
