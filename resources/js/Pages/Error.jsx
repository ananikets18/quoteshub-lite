import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft } from 'lucide-react';

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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-center">
            <Head title={title} />

            <div className="space-y-6 max-w-md w-full">
                {/* Minimal Brand */}
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5D41E6] to-[#4b33c2]">
                    QuotesHub
                </h1>

                <div className="py-8">
                    <h2 className="text-8xl font-bold text-gray-200 dark:text-gray-800 select-none">
                        {status}
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                        {status === 404 ? "Page Not Found" : "Something Went Wrong"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#5D41E6] hover:bg-[#4b33c2] rounded-lg transition-colors shadow-sm"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
