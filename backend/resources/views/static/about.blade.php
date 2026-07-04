@extends('layouts.app')

@section('title', 'About QuotesHub — Our Story & Mission')
@section('description', 'Learn about QuotesHub — a community dedicated to sharing, discovering, and being inspired by the greatest words ever spoken.')

@section('content')
<div class="app-main">
    <div style="max-width:760px;margin:0 auto;padding:40px 20px 80px;">

        {{-- Hero --}}
        <div style="text-align:center;margin-bottom:56px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:22px;background:linear-gradient(135deg,var(--brand),#c026d3);box-shadow:0 12px 40px var(--brand-glow);margin-bottom:24px;">
                <span style="font-size:34px;">💬</span>
            </div>
            <h1 style="font-size:36px;font-weight:900;color:#f1f5f9;letter-spacing:-1px;margin-bottom:16px;">About QuotesHub</h1>
            <p style="font-size:18px;color:#94a3b8;line-height:1.7;max-width:560px;margin:0 auto;">A community devoted to the art of words — discovering, sharing, and being moved by the greatest quotes in human history.</p>
        </div>

        @php
            $sectionStyle = "margin-bottom:48px;";
            $h2Style = "font-size:22px;font-weight:800;color:#f1f5f9;margin-bottom:14px;letter-spacing:-0.3px;";
            $pStyle = "font-size:15px;color:#94a3b8;line-height:1.8;margin-bottom:14px;";
        @endphp

        {{-- Mission --}}
        <div style="{{ $sectionStyle }}">
            <h2 style="{{ $h2Style }}">🎯 Our Mission</h2>
            <p style="{{ $pStyle }}">QuotesHub was built on the belief that the right words at the right moment can change everything. We're a platform where millions of insights — from ancient stoics to modern thinkers — are curated, shared, and celebrated by a passionate community.</p>
            <p style="{{ $pStyle }}">Our mission is simple: make the wisdom of the world accessible to everyone, and give individuals a place to share the words that moved them.</p>
        </div>

        {{-- Features --}}
        <div style="{{ $sectionStyle }}">
            <h2 style="{{ $h2Style }}">✨ What You Can Do</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;">
                @foreach([
                    ['📜', 'Share Quotes', 'Post your favourite quotes with author and source attribution.'],
                    ['❤️', 'Like & Save', 'Curate your personal library of saved quotes.'],
                    ['📚', 'Create Collections', 'Organise quotes into beautiful themed collections.'],
                    ['👥', 'Follow People', 'Build your feed around voices that inspire you.'],
                    ['🏆', 'Earn Achievements', 'Level up with badges as you engage with the community.'],
                    ['🔍', 'Discover Topics', 'Browse by category, tag or keyword.'],
                ] as [$icon, $title, $desc])
                    <div class="panel-card" style="padding:18px;">
                        <div style="font-size:26px;margin-bottom:10px;">{{ $icon }}</div>
                        <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">{{ $title }}</div>
                        <div style="font-size:13px;color:#64748b;line-height:1.5;">{{ $desc }}</div>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Call to action --}}
        <div style="text-align:center;padding:40px;background:linear-gradient(135deg,rgba(141,52,233,0.12),rgba(192,38,211,0.06));border:1px solid var(--brand-border);border-radius:24px;">
            <h2 style="{{ $h2Style }}">Ready to get started?</h2>
            <p style="{{ $pStyle }}">Join thousands of quote enthusiasts who share their inspiration every day.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                @guest
                    <a href="{{ route('register') }}" class="btn-brand" style="font-size:15px;padding:13px 28px;">Join QuotesHub</a>
                    <a href="{{ route('feed') }}" class="btn-ghost" style="font-size:15px;padding:13px 28px;">Browse Quotes</a>
                @else
                    <a href="{{ route('quotes.create') }}" class="btn-brand" style="font-size:15px;padding:13px 28px;">Share a Quote</a>
                @endguest
            </div>
        </div>

    </div>
</div>
@endsection