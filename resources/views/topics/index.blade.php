@extends('layouts.app')

@section('title', 'Explore Topics — QuotesHub')
@section('description', 'Explore categories and trending tags on QuotesHub to discover the quotes that resonate with you.')

@section('content')
<div class="app-main" style="display:flex;min-height:100dvh;">
    <div style="flex:1;min-width:0;">
        <div class="feed-container" style="max-width:860px;">

            {{-- Header --}}
            <div class="page-header">
                <h1 class="page-title">🗺️ Explore Topics</h1>
                <p class="page-subtitle">Browse by category or trending tags</p>
            </div>

            {{-- Categories grid --}}
            <div style="margin-bottom:36px;">
                <h2 style="font-size:14px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Categories</h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
                    @foreach($categories as $cat)
                        @php
                            $colorMap = [
                                'purple' => 'rgba(139,92,246,0.12)',
                                'blue' => 'rgba(59,130,246,0.12)',
                                'green' => 'rgba(16,185,129,0.12)',
                                'yellow' => 'rgba(245,158,11,0.12)',
                                'orange' => 'rgba(249,115,22,0.12)',
                                'pink' => 'rgba(236,72,153,0.12)',
                                'red' => 'rgba(239,68,68,0.12)',
                                'indigo' => 'rgba(99,102,241,0.12)',
                            ];
                            $bgColor = $colorMap[$cat->color ?? 'purple'] ?? 'rgba(139,92,246,0.12)';
                        @endphp
                        <a href="{{ route('category.show', $cat->slug) }}"
                           class="panel-card anim-fade-up"
                           style="padding:20px;text-decoration:none;text-align:center;background:{{ $bgColor }};transition:transform 0.2s ease,box-shadow 0.2s ease;"
                           onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.3)'"
                           onmouseout="this.style.transform='';this.style.boxShadow=''">
                            <div style="font-size:32px;margin-bottom:8px;">{{ $cat->icon ?? '📚' }}</div>
                            <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">{{ $cat->name }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ number_format($cat->quotes_count) }} quotes</div>
                        </a>
                    @endforeach
                </div>
            </div>

            {{-- Trending Tags --}}
            @if($tags->isNotEmpty())
                <div>
                    <h2 style="font-size:14px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">🔥 Trending Tags</h2>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;">
                        @foreach($tags as $tag)
                            <a href="{{ route('tag.show', $tag->name) }}"
                               style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:99px;background:var(--bg-card);border:1px solid var(--border-muted);font-size:13px;font-weight:600;color:#94a3b8;text-decoration:none;transition:all 0.2s ease;"
                               onmouseover="this.style.borderColor='var(--brand)';this.style.color='#d8b4fe';this.style.background='var(--brand-subtle)'"
                               onmouseout="this.style.borderColor='var(--border-muted)';this.style.color='#94a3b8';this.style.background='var(--bg-card)'">
                                <span style="color:#475569;">#</span>{{ $tag->name }}
                                <span style="font-size:11px;color:#475569;font-weight:500;">{{ $tag->quotes_count }}</span>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

        </div>
    </div>
</div>
@endsection