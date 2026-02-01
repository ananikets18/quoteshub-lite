import { Head } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';

export default function Terms() {
    return (
        <AppLayout title="Terms of Service">
            <SeoHead
                title="Terms of Service"
                description="Read our terms of service to understand your rights and responsibilities when using QuotesHub."
            />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>

                    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Please read these Terms of Service carefully before using QuotesHub. By accessing or using our service, you agree to be bound by these terms.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">1. Acceptance of Terms</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        By accessing QuotesHub, you agree to comply with these terms, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2. User Content</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        You retain ownership of any content you post to QuotesHub, but you grant us a license to use, store, and display that content in connection with the service. You are responsible for ensuring you have the rights to post any content.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3. Prohibited Conduct</h2>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Harassing or bullying other users</li>
                        <li>Posting hate speech or discriminatory content</li>
                        <li>Spamming or posting irrelevant content</li>
                        <li>Attempting to compromise the security of the service</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4. Termination</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5. Contact Us</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        If you have any questions about these Terms of Service, please contact us at <a href="mailto:thequoteshubteam@gmail.com" className="text-[#5D41E6] hover:underline">thequoteshubteam@gmail.com</a>.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
