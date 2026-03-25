@extends('layouts.app')

@section('title', 'Login - QuotesHub')

@section('content')
<div class="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 rounded-3xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle); box-shadow: 0 12px 40px rgba(0,0,0,0.2);">
        <div>
            <h2 class="mt-2 text-center text-3xl font-extrabold" style="color: var(--text-primary, #e2e8f0);">
                Welcome Back
            </h2>
            <p class="mt-2 text-center text-sm" style="color: #64748b;">
                Sign in to continue to QuotesHub
            </p>
        </div>

        @if ($status)
            <div class="rounded-xl p-4" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
                <p class="text-sm font-medium" style="color: #34d399;">{{ $status }}</p>
            </div>
        @endif

        @if ($errors->any())
            <div class="rounded-xl p-4" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);">
                <ul class="list-disc list-inside text-sm font-medium text-red-400">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form class="mt-8 space-y-6" action="{{ route('login.store') }}" method="POST">
            @csrf
            <div class="space-y-4">
                <div>
                    <label for="email" class="sr-only">Email address</label>
                    <input id="email" name="email" type="email" autocomplete="email" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="Email address" value="{{ old('email') }}">
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input id="password" name="password" type="password" autocomplete="current-password" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="Password">
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input id="remember" name="remember" type="checkbox" 
                           class="h-4 w-4 rounded" style="accent-color: var(--brand); border-color: var(--border-muted);">
                    <label for="remember" class="ml-2 block text-sm font-medium" style="color: #94a3b8;">
                        Remember me
                    </label>
                </div>

                @if ($canResetPassword)
                    <div class="text-sm">
                        <a href="{{ route('password.request') }}" class="font-medium hover:underline transition-colors" style="color: var(--brand);">
                            Forgot password?
                        </a>
                    </div>
                @endif
            </div>

            <div>
                <button type="submit" 
                        class="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-transform active:scale-95"
                        style="background: var(--brand); box-shadow: 0 4px 14px var(--brand-glow);">
                    Sign in
                </button>
            </div>

            <div class="text-center mt-4">
                <p class="text-sm font-medium" style="color: #64748b;">
                    Don't have an account?
                    <a href="{{ route('register') }}" class="font-bold hover:underline ml-1" style="color: var(--brand);">
                        Create one now
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
@endsection
