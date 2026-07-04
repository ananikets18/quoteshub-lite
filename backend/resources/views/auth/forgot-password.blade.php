@extends('layouts.app')

@section('title', 'Forgot Password — QuotesHub')
@section('description', 'Reset your QuotesHub password to regain access to your account.')

@section('content')
<div class="min-h-screen flex items-center justify-center   py-12 px-4" style="background: var(--bg-base);">
    <div style="width: 100%; max-width: 420px;">

        {{-- Logo --}}
        <div style="text-align:center; margin-bottom: 32px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:18px;background:var(--brand);box-shadow:0 8px 32px var(--brand-glow);margin-bottom:20px;">
                <span style="font-size:26px;">🔑</span>
            </div>
            <h1 style="font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:8px;">Forgot your password?</h1>
            <p style="font-size:14px;color:#64748b;line-height:1.5;">No worries — enter your email and we'll send you a reset link.</p>
        </div>

        {{-- Status message --}}
        @if (session('status'))
            <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:14px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
                <span style="font-size:18px;">✅</span>
                <p style="font-size:14px;color:#34d399;font-weight:500;">{{ session('status') }}</p>
            </div>
        @endif

        {{-- Errors --}}
        @if ($errors->any())
            <div style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:14px 16px;margin-bottom:20px;">
                @foreach ($errors->all() as $error)
                    <p style="font-size:14px;color:#f87171;font-weight:500;">{{ $error }}</p>
                @endforeach
            </div>
        @endif

        {{-- Card --}}
        <div class="panel-card" style="padding:28px;">
            <form method="POST" action="{{ route('password.email') }}">
                @csrf

                <div style="margin-bottom:20px;">
                    <label for="email" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autofocus
                        placeholder="you@example.com"
                        style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >
                </div>

                <button
                    type="submit"
                    class="btn-brand"
                    style="width:100%;justify-content:center;padding:13px 20px;font-size:15px;border-radius:13px;"
                >
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Send Reset Link
                </button>
            </form>
        </div>

        {{-- Back to login --}}
        <p style="text-align:center;margin-top:20px;font-size:14px;color:#64748b;">
            Remembered it?
            <a href="{{ route('login') }}" style="color:var(--brand);font-weight:600;text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Sign in →</a>
        </p>
    </div>
</div>
@endsection