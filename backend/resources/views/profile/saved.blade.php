@extends('layouts.app')

@section('title', 'Saved Quotes — QuotesHub')
@section('description', 'Your personal collection of saved quotes on QuotesHub.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 680px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
                <h1 class="page-title">🔖 Saved Quotes</h1>
                <p class="page-subtitle">{{ $quotes->total() }} quote{{ $quotes->total() !== 1 ? 's' : '' }} saved</p>
            </div>
            @if($collections->count() > 0)
                <a href="{{ route('collections.index') }}" class="btn-ghost" style="font-size:13px;padding:8px 16px;">
                    <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    My Collections
                </a>
            @endif
        </div>

        {{-- Collections quick-filter --}}
        @if($collections->count() > 0)
            <div class="mb-4 -mx-2 px-2 overflow-x-auto no-scrollbar">
                <div class="flex gap-2 pb-1" style="width:max-content;">
                    <a href="{{ route('saved') }}" class="category-pill flex-shrink-0"
                       style="{{ !request('collection') ? 'background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.5);' : '' }}">
                        All Saved
                    </a>
                    @foreach($collections as $col)
                        <a href="{{ route('collections.show', $col->slug) }}" class="category-pill flex-shrink-0">
                            {{ $col->name }}
                        </a>
                    @endforeach
                </div>
            </div>
        @endif

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        {{-- Quote list --}}
        <div class="flex flex-col gap-4 stagger">
            @forelse($quotes as $quote)
                <x-quote-card :quote="$quote" />
            @empty
                <x-empty-state
                    icon="🔖"
                    title="No saved quotes yet"
                    message="When you save quotes you love, they'll appear here."
                    actionText="Browse Feed"
                    actionUrl="{{ route('feed') }}"
                />
            @endforelse
        </div>

        {{-- Pagination --}}
        @if($quotes->hasPages())
            <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
        @endif

    </div>
</div>
@endsection