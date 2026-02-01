import { Head, Link } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function Error({ status }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status] || 'Error';

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are not authorized to access this page.',
    }[status] || 'An unexpected error occurred.';

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <SeoHead title={title} description={description} />

            {/* Header with Brand */}
            <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5D41E6] to-[#7C3AED] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5D41E6] to-[#7C3AED]">
                            QuotesHub
                        </span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
                <div className="space-y-8 max-w-2xl w-full">
                    {/* Error Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
                        {/* Large Status Code */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-48 bg-gradient-to-br from-[#5D41E6]/10 to-[#7C3AED]/10 rounded-full blur-3xl"></div>
                            </div>
                            <h2 className="relative text-7xl sm:text-8xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#5D41E6] to-[#7C3AED] select-none py-4">
                                {status}
                            </h2>
                        </div>

                        {/* Error Message */}
                        <div className="mt-8 space-y-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {status === 404 ? "Page Not Found" : 
                                 status === 403 ? "Access Forbidden" :
                                 status === 503 ? "Service Unavailable" :
                                 "Something Went Wrong"}
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </button>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#5D41E6] to-[#7C3AED] hover:from-[#4b33c2] hover:to-[#6b2dc4] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>

                    {/* Additional Help Text */}
                    {status === 404 && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Looking for something? Try searching from the{' '}
                                <Link href="/" className="font-medium text-[#5D41E6] hover:text-[#4b33c2] transition-colors">
                                    homepage
                                </Link>
                                {' '}or check out{' '}
                                <Link href="/topics" className="font-medium text-[#5D41E6] hover:text-[#4b33c2] transition-colors">
                                    trending topics
                                </Link>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer with Copyright */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#5D41E6] to-[#7C3AED] flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-medium">QuotesHub</span>
                        </div>
                        <div className="text-center sm:text-right">
                            <p>© {currentYear} QuotesHub. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
