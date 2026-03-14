@extends('layouts.app')

@section('title', 'Privacy Policy — QuotesHub')
@section('description', 'Read the QuotesHub privacy policy to understand how we collect, use, and protect your personal data.')

@section('content')
<div class="app-main">
    <div style="max-width:760px;margin:0 auto;padding:40px 20px 80px;">

        <div style="text-align:center;margin-bottom:48px;">
            <h1 style="font-size:32px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">🔒 Privacy Policy</h1>
            <p style="font-size:15px;color:#64748b;">Last updated: {{ now()->format('F j, Y') }}</p>
        </div>

        @php
            $h2 = "font-size:18px;font-weight:800;color:#f1f5f9;margin-bottom:10px;padding-top:24px;border-top:1px solid var(--border-subtle);";
            $p = "font-size:15px;color:#94a3b8;line-height:1.8;margin-bottom:12px;";
        @endphp

        <div class="panel-card" style="padding:32px;">
            <p style="{{ $p }}">At QuotesHub, we take your privacy seriously. This policy describes how we collect, use, and protect your information when you use our platform.</p>

            <h2 style="{{ $h2 }}">Information We Collect</h2>
            <p style="{{ $p }}">We collect information you provide directly (name, email, username, bio), content you create (quotes, collections), and usage data (pages visited, interactions) to improve our service.</p>

            <h2 style="{{ $h2 }}">How We Use Your Information</h2>
            <p style="{{ $p }}">Your data is used to operate and personalise the platform, send notifications you've opted into, prevent abuse, and improve our services. We do not sell your personal data to third parties.</p>

            <h2 style="{{ $h2 }}">Data Retention</h2>
            <p style="{{ $p }}">We retain your data for as long as your account is active. You may delete your account at any time from Settings, which will permanently remove your profile, quotes, and personal data within 30 days.</p>

            <h2 style="{{ $h2 }}">Cookies</h2>
            <p style="{{ $p }}">We use essential cookies for authentication and preference storage. See our <a href="{{ route('cookies') }}" style="color:var(--brand);">Cookie Policy</a> for full details.</p>

            <h2 style="{{ $h2 }}">Third-Party Services</h2>
            <p style="{{ $p }}">We use third-party services for hosting and analytics. These services have their own privacy policies and we encourage you to review them.</p>

            <h2 style="{{ $h2 }}">Your Rights</h2>
            <p style="{{ $p }}">You have the right to access, correct, or delete your personal data. You can also export your data or restrict processing. Contact us at privacy@quoteshub.app to exercise these rights.</p>

            <h2 style="{{ $h2 }}">Contact</h2>
            <p style="{{ $p }}">Questions about this policy? <a href="{{ route('contact') }}" style="color:var(--brand);">Contact us</a> and we'll respond within 5 business days.</p>
        </div>

    </div>
</div>
@endsection