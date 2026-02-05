import { useForm } from '@inertiajs/react';
import { CheckCircle, AlertCircle, Shield } from 'lucide-react';

export default function UpdatePasswordForm() {
    const {
        data,
        setData,
        put,
        errors,
        processing,
        recentlySuccessful,
        reset,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* Security Tip */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Use a strong password with at least 8 characters, including letters,
                        numbers, and symbols.
                    </p>
                </div>
            </div>

            {/* Current Password */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                    Current Password *
                </label>
                <input
                    type="password"
                    value={data.current_password}
                    placeholder="Enter your current password"
                    onChange={(e) =>
                        setData('current_password', e.target.value)
                    }
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.current_password && (
                    <p className="mt-1 text-sm text-red-600 flex gap-1 items-center">
                        <AlertCircle className="w-4 h-4" />
                        {errors.current_password}
                    </p>
                )}
            </div>

            {/* New Password */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                    New Password *
                </label>
                <input
                    type="password"
                    value={data.password}
                    placeholder="Create a strong password"
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex gap-1 items-center">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                    Confirm New Password *
                </label>
                <input
                    type="password"
                    value={data.password_confirmation}
                    placeholder="Re-enter your new password"
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600 flex gap-1 items-center">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 rounded-lg text-white font-semibold bg-[#5D41E6] hover:bg-[#4a31c9] active:bg-[#3d28a8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    {processing ? 'Updating...' : 'Update Password'}
                </button>

                {recentlySuccessful && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Password updated!
                    </span>
                )}
            </div>
        </form>
    );
}
