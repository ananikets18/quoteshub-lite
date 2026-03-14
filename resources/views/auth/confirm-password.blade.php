@extends('layouts.app')

@section('title', 'Confirm Password — QuotesHub')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4" style="background: var(--bg-base);">
    <div style="width: 100%; max-width: 420px;">

        <div style="text-align:center; margin-bottom: 32px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:18px;background:var(--brand);box-shadow:0 8px 32px var(--brand-glow);margin-bottom:20px;">
                <span style="font-size:26px;">🛡️</span>
            </div>
            <h1 style="font-size:26px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:8px;">Confirm your password</h1>
            <p style="font-size:14px;color:#64748b;line-height:1.5;">This is a secure area. Please confirm your password before continuing.</p>
        </div>

        @if ($errors->any())
            <div style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:14px 16px;margin-bottom:20px;">
                @foreach ($errors->all() as $error)
                    <p style="font-size:14px;color:#f87171;font-weight:500;">{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <div class="panel-card" style="padding:28px;">
            <form method="POST" action="{{ route('password.confirm') }}">
                @csrf

                <div style="margin-bottom:24px;">
                    <label for="password" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        placeholder="Enter your current password"
                        style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >
                </div>

                <button type="submit" class="btn-brand" style="width:100%;justify-content:center;padding:13px 20px;font-size:15px;border-radius:13px;">
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    Confirm &amp; Continue
                </button>
            </form>
        </div>
    </div>
</div>
@endsection