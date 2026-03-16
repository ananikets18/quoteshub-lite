@extends('layouts.app')

@section('title', '#' . $tag->name . ' — QuotesHub')
@section('description', 'Browse quotes tagged with #' . $tag->name . ' on QuotesHub.')

@section('content')
<div class="app-main" style="display:flex;min-height:100dvh;">
    <div style="flex:1;min-width:0;">
        <div class="feed-container">

            {{-- Tag header --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:28px;">
                <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                    <div style="font-size:32px;font-weight:800;color:var(--brand);font-family:'Playfair Display',serif;">#</div>
                    <div>
                        <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px;color:var(--text-primary, inherit);">{{ $tag->name }}</h1>
                        <div style="font-size:13px;color:#64748b;">{{ number_format($quotes->total()) }} quotes with this tag</div>
                    </div>
                </div>
            </div>

            {{-- Sort --}}
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
                <span style="font-size:13px;color:#64748b;font-weight:600;">Sort by:</span>
                @foreach(['latest' => '🕒 Latest', 'popular' => '🔥 Popular', 'most_saved' => '🔖 Most Saved'] as $val => $label)
                    <a href="{{ route('tag.show', $tag->name) }}?sort={{ $val }}"
                       class="category-pill"
                       style="{{ $sort === $val ? 'background:rgba(141,52,246,0.25);border-color:var(--brand);color:#d8b4fe;' : '' }}">
                        {{ $label }}
                    </a>
                @endforeach
            </div>

            {{-- Quotes --}}
            <div class="flex flex-col gap-4 stagger">
                @forelse($quotes as $quote)
                    <x-quote-card :quote="$quote" />
                @empty
                    <x-empty-state icon="🏷️" title="No quotes with this tag yet" message="Add this tag when creating your next quote!" actionText="Create Quote" actionUrl="{{ route('quotes.create') }}" />
                @endforelse
            </div>

            @if($quotes->hasPages())
                <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
            @endif

        </div>
    </div>
</div>
@endsection