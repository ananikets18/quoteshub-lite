import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Guidelines() {
    return (
        <AppLayout title="Community Guidelines">
            <Head title="Community Guidelines" />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Community Guidelines</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        QuotesHub is a positive community focused on inspiration and growth. To keep this a safe and welcoming space for everyone, we ask that you follow these guidelines.
                    </p>

                    <div className="grid gap-6 mt-8">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                            <h3 className="font-semibold text-[#5D41E6] dark:text-purple-400 mb-2">Be Respectful</h3>
                            <p className="text-gray-600 dark:text-gray-300">Treat others with kindness and respect. Harassment, hate speech, and bullying are strictly prohibited.</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Share Authentically</h3>
                            <p className="text-gray-600 dark:text-gray-300">Post quotes that meaningful to you. Ensure accuracy when attributing quotes to authors.</p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Keep it Clean</h3>
                            <p className="text-gray-600 dark:text-gray-300">Avoid posting explicit or sexually suggestive content. Let's keep QuotesHub suitable for a diverse audience.</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Reporting Violations</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        If you see content that violates these guidelines, please use the report function on the quote or user profile to alert our moderation team.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
