@extends('layouts.app')

@section('title', $category->name . ' Quotes — QuotesHub')
@section('description', 'Browse inspiring ' . $category->name . ' quotes curated by the QuotesHub community.')

@section('content')
<div class="app-main" style="display:flex;min-height:100dvh;">
    <div style="flex:1;min-width:0;">
        <div class="feed-container">

            {{-- Category header --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:28px;background:linear-gradient(135deg,rgba(141,52,233,0.1),rgba(192,38,211,0.05));">
                <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                    <div style="font-size:44px;">{{ $category->icon ?? '📚' }}</div>
                    <div style="flex:1;">
                        <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px;color:var(--text-primary, inherit);">{{ $category->name }}</h1>
                        @if($category->description)
                            <p style="font-size:14px;color:#94a3b8;line-height:1.5;">{{ $category->description }}</p>
                        @endif
                        <div style="margin-top:8px;font-size:13px;color:#64748b;">{{ number_format($quotes->total()) }} quotes</div>
                    </div>
                </div>
            </div>

            {{-- Sort controls --}}
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
                <span style="font-size:13px;color:#64748b;font-weight:600;">Sort by:</span>
                @foreach(['latest' => '🕒 Latest', 'popular' => '🔥 Popular', 'most_saved' => '🔖 Most Saved'] as $val => $label)
                    <a href="{{ route('category.show', $category->slug) }}?sort={{ $val }}"
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
                    <x-empty-state icon="📭" title="No quotes in this category yet" message="Be the first to add a quote to {{ $category->name }}!" actionText="Create Quote" actionUrl="{{ route('quotes.create') }}" />
                @endforelse
            </div>

            @if($quotes->hasPages())
                <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
            @endif

        </div>
    </div>
</div>
@endsection