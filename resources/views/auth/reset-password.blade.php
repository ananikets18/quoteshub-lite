@extends('layouts.app')

@section('title', 'Reset Password — QuotesHub')
@section('description', 'Set a new secure password for your QuotesHub account.')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4" style="background: var(--bg-base);">
    <div style="width: 100%; max-width: 420px;">

        {{-- Logo --}}
        <div style="text-align:center; margin-bottom: 32px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:18px;background:var(--brand);box-shadow:0 8px 32px var(--brand-glow);margin-bottom:20px;">
                <span style="font-size:26px;">🔐</span>
            </div>
            <h1 style="font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:8px;">Set new password</h1>
            <p style="font-size:14px;color:#64748b;">Choose a strong password you haven't used before.</p>
        </div>

        {{-- Errors --}}
        @if ($errors->any())
            <div style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:14px 16px;margin-bottom:20px;">
                @foreach ($errors->all() as $error)
                    <p style="font-size:14px;color:#f87171;font-weight:500;">{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <div class="panel-card" style="padding:28px;">
            <form method="POST" action="{{ route('password.store') }}">
                @csrf
                <input type="hidden" name="token" value="{{ $token }}">

                {{-- Email --}}
                <div style="margin-bottom:18px;">
                    <label for="email" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value="{{ old('email', $email) }}"
                        required
                        autofocus
                        autocomplete="email"
                        placeholder="you@example.com"
                        style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >
                </div>

                {{-- New password --}}
                <div style="margin-bottom:18px;">
                    <label for="password" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">New Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autocomplete="new-password"
                        placeholder="••••••••"
                        style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >
                </div>

                {{-- Confirm password --}}
                <div style="margin-bottom:24px;">
                    <label for="password_confirmation" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        required
                        autocomplete="new-password"
                        placeholder="••••••••"
                        style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >
                </div>

                <button type="submit" class="btn-brand" style="width:100%;justify-content:center;padding:13px 20px;font-size:15px;border-radius:13px;">
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Reset Password
                </button>
            </form>
        </div>

        <p style="text-align:center;margin-top:20px;font-size:14px;color:#64748b;">
            <a href="{{ route('login') }}" style="color:var(--brand);font-weight:600;text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">← Back to login</a>
        </p>
    </div>
</div>
@endsection