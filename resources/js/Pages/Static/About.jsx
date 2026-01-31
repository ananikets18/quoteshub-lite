import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    return (
        <AppLayout title="About Us">
            <Head title="About Us" />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5D41E6] to-[#4b33c2] mb-6">
                        About QuotesHub
                    </h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Welcome to QuotesHub, your daily source of inspiration, wisdom, and motivation. We believe that words have the power to change lives, and our mission is to curate the most impactful quotes from history's greatest minds.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        To create a community where wisdom is shared, celebrated, and preserved. Whether you're looking for motivation to start your day, comfort during tough times, or just a spark of creativity, QuotesHub is here for you.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Join Our Community</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        QuotesHub is more than just a collection of texts; it's a vibrant community of thinkers, dreamers, and doers. Create collections, share your favorite quotes, and connect with others who share your passion for words.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
