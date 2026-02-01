import { useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Mail, Lock, ArrowLeft, ArrowRight, Github, Chrome } from 'lucide-react';

export default function Login({ status, canResetPassword, flash, errors: inertiaErrors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const rememberRef = useRef(null);
    const submitRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        // Prevent double submission
        if (processing) {
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
            preserveScroll: true,
        });
    };

    // Auto-focus email on mount
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950 overflow-hidden">
            <SeoHead
                title="Login"
                description="Welcome back! Login to your QuotesHub account to share, save, and discover inspiring quotes."
            />

            {/* 1. Brand/Visual Side (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#5D41E6]">
                {/* Background Decor - Mesh Gradient Effect */}
                <div className="absolute inset-0 bg-[#5D41E6]" />
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse delay-700" />

                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

                {/* Content Overlay */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center p-16 text-white text-center">
                    <Link href="/" className="mb-16 flex items-center gap-4 group transition-all hover:scale-105">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                            <ApplicationLogo variant="gradient" className="w-12 h-12 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter uppercase"> QuotesHub </span>
                    </Link>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-serif italic mb-8 leading-tight text-purple-50">
                            "The only way to do great work is to love what you do."
                        </h2>
                        <div className="h-1 w-12 bg-purple-400 mx-auto mb-6 rounded-full" />
                        <p className="text-xl text-purple-200 font-medium tracking-wide uppercase text-sm">
                            — Steve Jobs
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-24 grid grid-cols-3 gap-12 border-t border-white/10 pt-12">
                        <div>
                            <div className="text-2xl font-bold">10k+</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-purple-300 font-bold mt-1">Wisdom</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">50k+</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-purple-300 font-bold mt-1">Users</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">100+</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-purple-300 font-bold mt-1">Topics</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Login Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative overflow-y-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>

                <div className="max-w-[420px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <ApplicationLogo variant="gradient" className="w-16 h-16 text-[#5D41E6]" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Don't have an account? {' '}
                            <Link href={route('register')} className="text-[#5D41E6] font-semibold hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium border border-green-100 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
                            {status}
                        </div>
                    )}

                    {/* Error Message for Social Login */}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="email" value="Email Address" className="text-sm font-semibold" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="you@example.com"
                                    className="block w-full pl-11 py-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <InputLabel htmlFor="password" value="Password" className="text-sm font-semibold" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-semibold text-[#5D41E6] hover:underline"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Enter your password"
                                    className="block w-full pl-11 py-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center group cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-md border-gray-300 text-[#5D41E6] shadow-sm focus:ring-[#5D41E6]"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <PrimaryButton
                            className="w-full justify-center py-3.5 bg-[#5D41E6] hover:bg-[#4b33c2] text-white rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </PrimaryButton>
                    </form>

                    <p className="mt-10 text-center text-xs text-gray-400 dark:text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
