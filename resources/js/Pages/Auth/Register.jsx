import { useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { User, AtSign, Mail, Lock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function Register({ flash, errors: inertiaErrors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const nameRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        // Prevent double submission
        if (processing) {
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            preserveScroll: true,
        });
    };

    // Auto-focus name on mount
    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950 overflow-hidden">
            <SeoHead
                title="Join QuotesHub"
                description="Create an account on QuotesHub today. Start collecting pieces of wisdom and sharing them with the world."
            />

            {/* 1. Brand/Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#5D41E6]">
                {/* Background Decor - Mesh Gradient Effect */}
                <div className="absolute inset-0 bg-[#5D41E6]" />
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse delay-700" />

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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-10 backdrop-blur-sm border border-white/20">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            <span>Join the wisdom movement</span>
                        </div>
                        <h2 className="text-4xl font-serif italic mb-8 leading-tight text-white">
                            "Wisdom begins with wonder."
                        </h2>
                        <div className="h-1 w-12 bg-white/30 mx-auto mb-6 rounded-full" />
                        <p className="text-xl text-purple-200 font-medium tracking-wide uppercase text-sm">
                            — Socrates
                        </p>
                    </div>

                    <div className="mt-20 space-y-4 w-full max-w-xs mx-auto">
                        <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs">01</div>
                            <p className="text-xs font-semibold text-purple-100">Curate your personal wisdom library</p>
                        </div>
                        <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs">02</div>
                            <p className="text-xs font-semibold text-purple-100">Connect with thinkers worldwide</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Register Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative overflow-y-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>

                <div className="max-w-[440px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <ApplicationLogo variant="gradient" className="w-16 h-16 text-[#5D41E6]" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Already have an account? {' '}
                            <Link href={route('login')} className="text-[#5D41E6] font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Error Message for Social Login */}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="name" value="Full Name" className="text-xs font-bold uppercase tracking-wider text-gray-500" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    placeholder="Jane Doe"
                                    className="block w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all text-sm"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="username" value="Username" className="text-xs font-bold uppercase tracking-wider text-gray-500" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                    <AtSign className="w-4 h-4" />
                                </div>
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    placeholder="janedoe"
                                    className="block w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all text-sm"
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.username} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold uppercase tracking-wider text-gray-500" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="you@example.com"
                                    className="block w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all text-sm"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Passwords Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="password" value="Password" className="text-xs font-bold uppercase tracking-wider text-gray-500" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        placeholder="Create a strong password"
                                        className="block w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all text-sm"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="password_confirmation" value="Confirm" className="text-xs font-bold uppercase tracking-wider text-gray-500" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-[#5D41E6] transition-colors text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="Re-enter your password"
                                        className="block w-full pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl focus:ring-[#5D41E6] focus:border-[#5D41E6] transition-all text-sm"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <InputError message={errors.password} />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <PrimaryButton
                                className="w-full justify-center py-3.5 bg-[#5D41E6] hover:bg-[#4b33c2] text-white rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                        Wisdom is the reward you get for a lifetime of listening
                        when you'd have preferred to talk.
                    </p>
                </div>
            </div>
        </div>
    );
}
