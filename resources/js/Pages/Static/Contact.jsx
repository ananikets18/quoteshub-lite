import { Head, useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import { Mail, MessageSquare, Twitter } from 'lucide-react';

export default function Contact() {
    return (
        <AppLayout title="Contact Us">
            <SeoHead
                title="Contact Us"
                description="Have a question or feedback? Reach out to the QuotesHub team. We'd love to hear from you."
            />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Have a question, suggestion, or just want to say hi? We'd love to hear from you.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
                        {/* Email */}
                        <a href="mailto:thequoteshubteam@gmail.com" className="block p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#5D41E6] dark:hover:border-[#5D41E6] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-[#5D41E6] dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">thequoteshubteam@gmail.com</p>
                        </a>

                        {/* Twitter */}
                        <a href="https://twitter.com/quoteshub" target="_blank" rel="noopener noreferrer" className="block p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Twitter className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Twitter</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@quoteshub</p>
                        </a>

                        {/* Community */}
                        <a href="/feed" className="block p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-500 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Community</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Join the discussion</p>
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
