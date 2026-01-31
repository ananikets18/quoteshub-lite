import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Privacy() {
    return (
        <AppLayout title="Privacy Policy">
            <Head title="Privacy Policy" />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

                    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        At QuotesHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Information We Collect</h2>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Account information (name, email, username)</li>
                        <li>Content you create (quotes, collections, comments)</li>
                        <li>Usage data (likes, saves, follows)</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">How We Use Your Information</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We use your information to providing and improving our services, personalizing your experience, and communicating with you about updates and community news.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Data Security</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Contact Us</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        If you have any questions about this Privacy Policy, please contact us at privacy@quoteshub.com.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
