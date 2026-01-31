import { Link } from '@inertiajs/react';
import { X, LogIn, UserPlus, Heart, Bookmark, Share2 } from 'lucide-react';

export default function AuthPromptModal({ show, onClose, action = 'like' }) {
    if (!show) return null;

    const actions = {
        like: {
            icon: Heart,
            title: 'Like this quote?',
            description: 'Sign in to like quotes and get personalized recommendations.',
        },
        save: {
            icon: Bookmark,
            title: 'Save this quote?',
            description: 'Sign in to save quotes to your collections and access them anytime.',
        },
        share: {
            icon: Share2,
            title: 'Share this quote?',
            description: 'Sign in to share quotes and track your shares.',
        },
        create: {
            icon: UserPlus,
            title: 'Create a quote?',
            description: 'Sign in to share your favorite quotes with the community.',
        },
    };

    const config = actions[action] || actions.like;
    const Icon = config.icon;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {config.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {config.description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <UserPlus className="w-5 h-5" />
                            Create Account
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                        Join thousands of quote lovers on QuotesHub
                    </p>
                </div>
            </div>
        </>
    );
}
