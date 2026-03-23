@extends('layouts.guest-landing')

@section('content')
<div class="hero-pattern"></div>

<div class="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-32 pb-20">
    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); padding: 6px 16px; border-radius: 9999px; color: #c4b5fd; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
        ✨ Over {{ number_format(max($stats['quotes'], 100)) }} quotes curated
    </div>
    
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight" style="line-height: 1.1; max-width: 900px; color: white;">
        Discover words that <br/>
        <span style="background: linear-gradient(to right, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">move the world.</span>
    </h1>
    
    <p class="mt-8 text-lg md:text-xl" style="color: #94a3b8; max-width: 600px;">
        QuotesHub is the premium community for thinkers, writers, and dreamers. Save, share, and discuss the profound wisdom of humanity.
    </p>

    <div class="mt-10 flex flex-col sm:flex-row gap-4">
        <a href="{{ route('register') }}" class="landing-btn text-lg" style="padding: 14px 32px;">Start Exploring Free</a>
        <a href="{{ route('feed') }}" class="landing-btn-secondary text-lg" style="padding: 14px 32px;">Browse as Guest</a>
    </div>

    {{-- Stats Row --}}
    <div class="mt-20 flex gap-8 md:gap-16 justify-center items-center border-t border-slate-800 pt-10" style="color: #cbd5e1;">
        <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ number_format($stats['users']) }}</div>
            <div class="text-sm font-medium mt-1">Curators</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ number_format($stats['quotes']) }}</div>
            <div class="text-sm font-medium mt-1">Quotes</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ number_format($stats['saves']) }}</div>
            <div class="text-sm font-medium mt-1">Saves</div>
        </div>
    </div>
</div>

{{-- Featured Quotes Section --}}
<div style="background: #0b1120; border-top: 1px solid rgba(255,255,255,0.05); padding: 80px 24px;">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white">Trending right now</h2>
            <p style="color: #94a3b8; margin-top: 12px;">Wisdom resonating with the community today.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @foreach($featuredQuotes as $quote)
                <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px; transition: transform 0.3s;" class="hover:-translate-y-2">
                    <p class="text-xl italic font-semibold" style="color: #f1f5f9; line-height: 1.6;">"{{ $quote->content }}"</p>
                    <div style="margin-top: 24px; display: flex; align-items: center; justify-content: space-between;">
                        <div class="text-sm text-slate-400 font-medium">— {{ $quote->author }}</div>
                        <div class="flex items-center gap-1 text-xs font-semibold" style="color: #8b5cf6;">
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                            {{ number_format($quote->likes_count) }}
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <div class="mt-12 text-center">
            <a href="{{ route('feed') }}" class="landing-btn-secondary inline-block">See more in Feed →</a>
        </div>
    </div>
</div>

{{-- Categories Section --}}
<div style="padding: 80px 24px; position: relative;">
    <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-10">Explore by Topic</h2>
        <div class="flex flex-wrap justify-center gap-4">
            @foreach($topCategories as $cat)
                <a href="{{ route('category.show', $cat->slug) }}" 
                   style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; border-radius: 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; transition: background 0.2s;"
                   class="hover:bg-slate-800">
                    <span class="text-2xl">{{ $cat->icon ?? '●' }}</span>
                    <div class="text-left">
                        <div class="text-white font-bold">{{ $cat->name }}</div>
                        <div class="text-xs text-slate-400 mt-1">{{ number_format($cat->quotes_count) }} quotes</div>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</div>

{{-- CTA --}}
<div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border-top: 1px solid rgba(139, 92, 246, 0.2); border-bottom: 1px solid rgba(139, 92, 246, 0.2); padding: 80px 24px; text-align: center;">
    <h2 class="text-4xl font-bold text-white mb-6">Ready to collect wisdom?</h2>
    <p class="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">Create your personal library of quotes, organize them into collections, and connect with people who share your perspectives.</p>
    <a href="{{ route('register') }}" class="landing-btn text-lg" style="padding: 16px 40px; display: inline-block;">Create Free Account</a>
</div>
@endsection
