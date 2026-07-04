@extends('layouts.app')

@section('title', 'Community Guidelines — QuotesHub')
@section('description', 'Read the QuotesHub community guidelines to understand what we expect from all members.')

@section('content')
<div class="app-main">
    <div style="max-width:760px;margin:0 auto;padding:40px 20px 80px;">

        <div style="text-align:center;margin-bottom:48px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.1));border:1px solid rgba(16,185,129,0.3);margin-bottom:20px;">
                <span style="font-size:30px;">📋</span>
            </div>
            <h1 style="font-size:32px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">Community Guidelines</h1>
            <p style="font-size:15px;color:#64748b;">Last updated: {{ now()->format('F Y') }}</p>
        </div>

        @php
            $h2 = "font-size:20px;font-weight:800;color:#f1f5f9;margin-bottom:12px;margin-top:36px;";
            $p = "font-size:15px;color:#94a3b8;line-height:1.8;margin-bottom:12px;";
        @endphp

        <div class="panel-card" style="padding:32px;">
            <p style="{{ $p }}">QuotesHub is a place for inspiration, not division. To keep our community uplifting and safe for everyone, please follow these guidelines.</p>

            <h2 style="{{ $h2 }}">✅ What We Encourage</h2>
            <ul style="{{ $p }} list-none;padding:0;">
                @foreach(['Share accurate, attributed quotes from real authors or verified sources.', 'Engage respectfully with other members.', 'Use categories and tags thoughtfully to help others discover quotes.', 'Report content that violates these guidelines using the report button.', 'Write helpful, constructive feedback.'] as $item)
                    <li style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:#34d399;font-weight:700;flex-shrink:0;">✓</span>{{ $item }}</li>
                @endforeach
            </ul>

            <h2 style="{{ $h2 }}">🚫 What We Prohibit</h2>
            <ul style="{{ $p }} list-none;padding:0;">
                @foreach(['Posting fabricated, misattributed, or deliberately misleading quotes.', 'Hate speech, harassment, or discrimination of any kind.', 'Spam, self-promotion, or repetitive content.', 'Sharing content that promotes violence or illegal activity.', 'Creating multiple accounts to circumvent bans.', 'Impersonating other users, public figures, or QuotesHub staff.'] as $item)
                    <li style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:#f87171;font-weight:700;flex-shrink:0;">✗</span>{{ $item }}</li>
                @endforeach
            </ul>

            <h2 style="{{ $h2 }}">⚖️ Enforcement</h2>
            <p style="{{ $p }}">Violations of these guidelines may result in content removal, a warning, temporary suspension, or a permanent ban — depending on the severity and frequency of the violation. Our moderation team reviews all reports.</p>

            <h2 style="{{ $h2 }}">📬 Questions?</h2>
            <p style="{{ $p }}">If you have questions about these guidelines or want to appeal a moderation decision, please <a href="{{ route('contact') }}" style="color:var(--brand);">contact us</a>.</p>
        </div>

    </div>
</div>
@endsection