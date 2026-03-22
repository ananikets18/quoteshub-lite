@extends('layouts.app')

@section('title', $authorName . ' Quotes — QuotesHub')
@section('description', 'Discover ' . $totalQuotes . ' inspiring quotes by ' . $authorName . ' on QuotesHub.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width:680px;">

        {{-- Back --}}
        <a href="{{ url()->previous() }}"
           style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:#64748b;text-decoration:none;margin-bottom:20px;transition:color 0.2s;"
           onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
            <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back
        </a>

        {{-- Author header --}}
        <div class="panel-card" style="margin-bottom:24px;padding:28px 24px;text-align:center;background:var(--grad-brand);border:none;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:rgba(10,10,20,0.55);backdrop-filter:blur(2px);"></div>
            <div style="position:relative;z-index:1;">
                <div style="width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:32px;border:2px solid rgba(255,255,255,0.2);">
                    ✍️
                </div>
                <h1 style="font-size:24px;font-weight:800;color:#fff;letter-spacing:-0.5px;margin-bottom:6px;">{{ $authorName }}</h1>
                <p style="font-size:14px;color:rgba(255,255,255,0.7);">{{ $totalQuotes }} {{ Str::plural('quote', $totalQuotes) }} on QuotesHub</p>
            </div>
        </div>

        {{-- Sort bar --}}
        <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
            @foreach(['latest' => '🕐 Latest', 'popular' => '🔥 Popular', 'trending' => '📈 Trending'] as $val => $label)
                <a href="{{ request()->fullUrlWithQuery(['sort' => $val]) }}"
                   style="padding:7px 16px;border-radius:22px;font-size:13px;font-weight:600;text-decoration:none;transition:all 0.2s ease;
                          {{ request()->get('sort', 'latest') === $val ? 'background:var(--brand);color:#fff;box-shadow:0 4px 12px rgba(141,52,233,0.35);' : 'background:var(--bg-elevated);color:#64748b;border:1px solid var(--border-subtle);' }}">
                    {{ $label }}
                </a>
            @endforeach
        </div>

        {{-- ═══ INFINITE SCROLL FEED ═══ --}}
        <div
            id="feed-list"
            x-data="feedInfiniteScroll('{{ route('author.show', urlencode($authorName)) }}', {{ json_encode(request()->only(['sort'])) }})"
            x-init="init()"
        >
            {{-- Server-rendered first page --}}
            <div id="feed-ssr" class="flex flex-col gap-4 stagger">
                @forelse($quotes as $quote)
                    <x-quote-card :quote="$quote" />
                @empty
                    <x-empty-state icon="📭" title="No quotes found" message="There are no published quotes by {{ $authorName }} yet." />
                @endforelse
            </div>

            {{-- Dynamically appended cards --}}
            <div class="flex flex-col gap-4" id="feed-dynamic"></div>

            {{-- Loading skeleton --}}
            <template x-if="loading">
                <div class="flex flex-col gap-4 mt-4">
                    <template x-for="i in 3" :key="i">
                        <div class="quote-card-new" style="padding:20px;">
                            <div class="skeleton" style="height:12px;width:60%;border-radius:8px;margin-bottom:12px;"></div>
                            <div class="skeleton" style="height:18px;width:100%;border-radius:8px;margin-bottom:8px;"></div>
                            <div class="skeleton" style="height:18px;width:80%;border-radius:8px;"></div>
                        </div>
                    </template>
                </div>
            </template>

            {{-- All-done message --}}
            <template x-if="!hasMore && !loading && {{ $quotes->count() }} > 0">
                <div style="text-align:center;padding:32px 16px;color:#475569;font-size:13px;">
                    ✨ You've seen all quotes by {{ $authorName }}.
                </div>
            </template>

            {{-- Scroll sentinel --}}
            <div id="scroll-sentinel" style="height:1px;margin-top:16px;"></div>
        </div>

        {{-- Related authors --}}
        @if($relatedAuthors->count() > 0)
            <div class="panel-card" style="margin-top:32px;">
                <div class="panel-card-header">✨ Discover More Authors</div>
                <div class="panel-card-body" style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;">
                    @foreach($relatedAuthors as $related)
                        <a href="{{ route('author.show', urlencode($related)) }}"
                           style="padding:6px 14px;border-radius:22px;font-size:13px;font-weight:600;text-decoration:none;
                                  background:var(--brand-subtle);color:var(--brand);border:1px solid var(--brand-border);
                                  transition:all 0.2s ease;"
                           onmouseover="this.style.background='var(--brand-muted)'"
                           onmouseout="this.style.background='var(--brand-subtle)'">
                            {{ $related }}
                        </a>
                    @endforeach
                </div>
            </div>
        @endif

    </div>
</div>
@endsection
