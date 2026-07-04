@extends('layouts.app')

@section('title', 'Cookie Policy — QuotesHub')
@section('description', 'Understand how QuotesHub uses cookies and how you can control them.')

@section('content')
<div class="app-main">
    <div style="max-width:760px;margin:0 auto;padding:40px 20px 80px;">

        <div style="text-align:center;margin-bottom:48px;">
            <h1 style="font-size:32px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">🍪 Cookie Policy</h1>
            <p style="font-size:15px;color:#64748b;">Last updated: {{ now()->format('F j, Y') }}</p>
        </div>

        @php
            $h2 = "font-size:18px;font-weight:800;color:#f1f5f9;margin-bottom:10px;padding-top:24px;border-top:1px solid var(--border-subtle);";
            $p = "font-size:15px;color:#94a3b8;line-height:1.8;margin-bottom:12px;";
        @endphp

        <div class="panel-card" style="padding:32px;">
            <p style="{{ $p }}">QuotesHub uses cookies to improve your browsing experience and keep you logged in. This policy explains what cookies we use and why.</p>

            <h2 style="{{ $h2 }}">What Are Cookies?</h2>
            <p style="{{ $p }}">Cookies are small text files stored on your browser by websites you visit. They help websites remember your preferences and login state.</p>

            <h2 style="{{ $h2 }}">Cookies We Use</h2>
            <div style="border-radius:14px;overflow:hidden;border:1px solid var(--border-subtle);margin-bottom:16px;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="background:var(--bg-elevated);">
                            <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Cookie</th>
                            <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Purpose</th>
                            <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach([
                            ['quoteshub_session', 'Keeps you logged in securely', 'Session'],
                            ['XSRF-TOKEN', 'Prevents cross-site request forgery (security)', 'Session'],
                            ['theme', 'Stores your dark/light mode preference', '1 year'],
                            ['remember_me', 'Keeps you logged in across browser restarts', '30 days'],
                        ] as [$name, $purpose, $duration])
                            <tr style="border-top:1px solid var(--border-subtle);">
                                <td style="padding:12px 16px;font-size:13px;font-family:monospace;color:#c084fc;">{{ $name }}</td>
                                <td style="padding:12px 16px;font-size:13px;color:#94a3b8;">{{ $purpose }}</td>
                                <td style="padding:12px 16px;font-size:13px;color:#64748b;">{{ $duration }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <h2 style="{{ $h2 }}">Controlling Cookies</h2>
            <p style="{{ $p }}">You can disable cookies in your browser settings, but this may affect your ability to log in and use core features of QuotesHub.</p>

            <h2 style="{{ $h2 }}">Questions?</h2>
            <p style="{{ $p }}"><a href="{{ route('contact') }}" style="color:var(--brand);">Contact us</a> if you have any questions about our use of cookies.</p>
        </div>

    </div>
</div>
@endsection