@extends('layouts.app')

@section('title', 'Register - QuotesHub')

@section('content')
<div class="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 rounded-3xl" style="background: var(--bg-card); border: 1px solid var(--border-subtle); box-shadow: 0 12px 40px rgba(0,0,0,0.2);">
        <div>
            <h2 class="mt-2 text-center text-3xl font-extrabold" style="color: var(--text-primary, #e2e8f0);">
                Create an account
            </h2>
            <p class="mt-2 text-center text-sm" style="color: #64748b;">
                Join QuotesHub and start sharing wisdom
            </p>
        </div>

        @if ($errors->any())
            <div class="rounded-xl p-4" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);">
                <ul class="list-disc list-inside text-sm font-medium text-red-400">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form class="mt-8 space-y-6" action="{{ route('register.store') }}" method="POST">
            @csrf
            <div class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium" style="color: #94a3b8; margin-bottom: 4px;">Full Name</label>
                    <input id="name" name="name" type="text" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="John Doe" value="{{ old('name') }}">
                </div>

                <div>
                    <label for="username" class="block text-sm font-medium" style="color: #94a3b8; margin-bottom: 4px;">Username</label>
                    <input id="username" name="username" type="text" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="johndoe" value="{{ old('username') }}">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium" style="color: #94a3b8; margin-bottom: 4px;">Email address</label>
                    <input id="email" name="email" type="email" autocomplete="email" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="john@example.com" value="{{ old('email') }}">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium" style="color: #94a3b8; margin-bottom: 4px;">Password</label>
                    <input id="password" name="password" type="password" autocomplete="new-password" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="••••••••">
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-medium" style="color: #94a3b8; margin-bottom: 4px;">Confirm Password</label>
                    <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" required 
                           class="appearance-none block w-full px-4 py-3 rounded-xl focus:outline-none sm:text-sm transition-colors" 
                           style="background: var(--bg-input); border: 1px solid var(--border-muted); color: var(--text-primary, #e2e8f0);"
                           onfocus="this.style.borderColor='var(--brand)'; this.style.boxShadow='0 0 0 2px var(--brand-subtle)'"
                           onblur="this.style.borderColor='var(--border-muted)'; this.style.boxShadow='none'"
                           placeholder="••••••••">
                </div>
            </div>

            <div>
                <button type="submit" 
                        class="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-transform active:scale-95"
                        style="background: var(--brand); box-shadow: 0 4px 14px var(--brand-glow);">
                    Create Account
                </button>
            </div>

            <div class="text-center mt-4">
                <p class="text-sm font-medium" style="color: #64748b;">
                    Already have an account?
                    <a href="{{ route('login') }}" class="font-bold hover:underline ml-1" style="color: var(--brand);">
                        Sign in
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
@endsection
