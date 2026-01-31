import { Head } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';

export default function Cookies() {
    return (
        <AppLayout title="Cookie Policy">
            <SeoHead
                title="Cookie Policy"
                description="Learn about how QuotesHub uses cookies and similar technologies to improve your experience."
            />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cookie Policy</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        QuotesHub uses cookies to improve your experience. By using our service, you consent to our use of cookies.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">What are cookies?</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you interact with our site.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">How we use cookies</h2>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Authentication: To keep you logged in.</li>
                        <li>Preferences: To remember your theme and language settings.</li>
                        <li>Analytics: To understand how our service is used.</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
