import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { User, Lock, ArrowLeft } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AppLayout title="Profile Settings">
            <Head title="Profile Settings" />

            <div className="px-4 py-6 pb-20">
                {/* Header */}
                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account information and security
                    </p>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Profile Information
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update your account profile and email address
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Update Password
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Ensure your account uses a strong password
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
