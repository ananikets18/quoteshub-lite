@extends('layouts.app')

@section('title', 'Verify Your Email — QuotesHub')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4" style="background: var(--bg-base);">
    <div style="width: 100%; max-width: 460px; text-align: center;">

        {{-- Illustration --}}
        <div style="display:inline-flex;align-items:center;justify-content:center;width:80px;height:80px;border-radius:24px;background:linear-gradient(135deg,var(--brand),#c026d3);box-shadow:0 12px 40px var(--brand-glow);margin-bottom:28px;">
            <span style="font-size:38px;">📧</span>
        </div>

        <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">Check your inbox</h1>
        <p style="font-size:15px;color:#64748b;line-height:1.6;margin-bottom:32px;">
            We sent a verification link to your email address.<br>
            Click the link to activate your account and start sharing wisdom.
        </p>

        {{-- Status --}}
        @if (session('status') == 'verification-link-sent')
            <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:14px;padding:14px 20px;margin-bottom:28px;display:flex;align-items:center;justify-content:center;gap:10px;">
                <span style="font-size:18px;">✅</span>
                <p style="font-size:14px;color:#34d399;font-weight:500;">A fresh verification link has been sent to your email!</p>
            </div>
        @endif

        {{-- Actions --}}
        <div style="display:flex;flex-direction:column;gap:12px;">
            {{-- Resend --}}
            <form method="POST" action="{{ route('verification.send') }}">
                @csrf
                <button type="submit" class="btn-brand" style="width:100%;justify-content:center;padding:14px 20px;font-size:15px;border-radius:14px;">
                    <svg style="width:17px;height:17px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Resend Verification Email
                </button>
            </form>

            {{-- Logout --}}
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="btn-ghost" style="width:100%;justify-content:center;padding:13px 20px;font-size:14px;border-radius:14px;">
                    Sign out and use a different account
                </button>
            </form>
        </div>

        <p style="margin-top:24px;font-size:13px;color:#475569;">Can't find the email? Check your spam folder.</p>
    </div>
</div>
@endsection