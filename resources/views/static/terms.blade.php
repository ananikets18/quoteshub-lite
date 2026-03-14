@extends('layouts.app')

@section('title', 'Terms of Service — QuotesHub')
@section('description', 'Read the QuotesHub Terms of Service to understand your rights and responsibilities as a user.')

@section('content')
<div class="app-main">
    <div style="max-width:760px;margin:0 auto;padding:40px 20px 80px;">

        <div style="text-align:center;margin-bottom:48px;">
            <h1 style="font-size:32px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">📃 Terms of Service</h1>
            <p style="font-size:15px;color:#64748b;">Effective date: January 1, 2025 · Last updated: {{ now()->format('F j, Y') }}</p>
        </div>

        @php
            $h2 = "font-size:18px;font-weight:800;color:#f1f5f9;margin-bottom:10px;padding-top:24px;border-top:1px solid var(--border-subtle);";
            $p = "font-size:15px;color:#94a3b8;line-height:1.8;margin-bottom:12px;";
        @endphp

        <div class="panel-card" style="padding:32px;">
            <p style="{{ $p }}">By using QuotesHub, you agree to these Terms of Service. Please read them carefully before using our platform.</p>

            <h2 style="{{ $h2 }}">1. Eligibility</h2>
            <p style="{{ $p }}">You must be at least 13 years old to use QuotesHub. By creating an account, you confirm you meet this requirement.</p>

            <h2 style="{{ $h2 }}">2. Your Account</h2>
            <p style="{{ $p }}">You are responsible for maintaining the security of your account. You agree not to share your password or allow others to access your account. Notify us immediately of any unauthorized access.</p>

            <h2 style="{{ $h2 }}">3. Content You Post</h2>
            <p style="{{ $p }}">You retain ownership of content you post on QuotesHub. By posting, you grant us a non-exclusive, royalty-free licence to display your content on the platform. You are responsible for ensuring you have the right to share any content you post.</p>

            <h2 style="{{ $h2 }}">4. Prohibited Conduct</h2>
            <p style="{{ $p }}">You agree not to use QuotesHub to post illegal, harmful, or misleading content. See our <a href="{{ route('guidelines') }}" style="color:var(--brand);">Community Guidelines</a> for specific examples of prohibited conduct.</p>

            <h2 style="{{ $h2 }}">5. Termination</h2>
            <p style="{{ $p }}">We reserve the right to suspend or terminate your account for violations of these terms. You may also close your account at any time from your Settings.</p>

            <h2 style="{{ $h2 }}">6. Disclaimer</h2>
            <p style="{{ $p }}">QuotesHub is provided "as is" without warranties of any kind. We do not guarantee the accuracy of any quote displayed on the platform.</p>

            <h2 style="{{ $h2 }}">7. Changes to These Terms</h2>
            <p style="{{ $p }}">We may update these terms from time to time. Continued use of QuotesHub after changes are posted constitutes acceptance of the new terms.</p>

            <h2 style="{{ $h2 }}">8. Contact</h2>
            <p style="{{ $p }}">For questions about these terms, please <a href="{{ route('contact') }}" style="color:var(--brand);">contact us</a>.</p>
        </div>

    </div>
</div>
@endsection