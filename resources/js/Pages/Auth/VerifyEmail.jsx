import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, Loader2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing, errors } = useForm({});
    const [rateLimitTime, setRateLimitTime] = useState(0);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="w-full sm:max-w-md mx-auto overflow-hidden bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700">
                {/* Decorative Header */}
                <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-gradient-x" />

                <div className="p-8">
                    {/* Icon & Title */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 group">
                            <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Check your inbox
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                            We've sent a verification link to your email address. Please click the link to verify your account.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                A new verification link has been sent to the email address you provided during registration.
                            </p>
                        </div>
                    )}

                    {/* Error / Rate Limit Message */}
                    {errors.email && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium whitespace-pre-line">
                                {errors.email}
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    <span>Resend Verification Email</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
                            >
                                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                <span>Log Out</span>
                            </Link>

                            <Link
                                href="/"
                                className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium group"
                            >
                                <span>Back to Home</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                &copy; {new Date().getFullYear()} QuotesHub. All rights reserved.
            </p>
        </GuestLayout>
    );
}
