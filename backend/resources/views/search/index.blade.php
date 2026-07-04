@extends('layouts.app')

@section('title', ($filters['q'] ?? false) ? '"' . $filters['q'] . '" — Search QuotesHub' : 'Search — QuotesHub')
@section('description', 'Search for inspiring quotes, authors, and people on QuotesHub.')

@section('content')
<div class="app-main" style="display:flex;min-height:100dvh;">
    <div style="flex:1;min-width:0;">
        <div class="feed-container">

            {{-- Header --}}
            <div class="page-header">
                <h1 class="page-title">🔍 Search</h1>
                <p class="page-subtitle">Discover quotes, authors and people</p>
            </div>

            {{-- Search form --}}
            <form method="GET" action="{{ route('search') }}" style="margin-bottom:24px;">
                <div style="display:flex;gap:10px;">
                    <div style="flex:1;position:relative;">
                        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:#64748b;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            name="q"
                            value="{{ $filters['q'] ?? '' }}"
                            placeholder="Search quotes, authors, or people..."
                            autofocus
                            style="width:100%;padding:13px 16px 13px 44px;background:var(--bg-elevated);border:1px solid var(--border-muted);border-radius:14px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"
                            onfocus="this.style.borderColor='var(--brand)'"
                            onblur="this.style.borderColor='var(--border-muted)'"
                        >
                    </div>
                    <button type="submit" class="btn-brand" style="padding:13px 22px;border-radius:14px;">Search</button>
                </div>
            </form>

            {{-- Error --}}
            @if(isset($error))
                <div class="mb-4 px-4 py-3 rounded-2xl text-sm" style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);color:#f87171;">{{ $error }}</div>
            @endif

            {{-- Results header --}}
            @if($filters['q'] ?? false)
                <div style="font-size:14px;color:#64748b;margin-bottom:16px;">
                    @if(method_exists($quotes, 'total'))
                        <span style="color:#e2e8f0;font-weight:600;">{{ $quotes->total() }}</span> results for "<span style="color:#a78bfa;">{{ $filters['q'] }}</span>"
                    @endif
                </div>
            @endif

            {{-- Results --}}
            <div class="flex flex-col gap-4 stagger">
                @if(method_exists($quotes, 'getCollection'))
                    @forelse($quotes as $quote)
                        <x-quote-card :quote="$quote" />
                    @empty
                        <x-empty-state
                            icon="🔍"
                            title="{{ ($filters['q'] ?? false) ? 'No results for "' . $filters['q'] . '"' : 'Start searching' }}"
                            message="{{ ($filters['q'] ?? false) ? 'Try different keywords or browse categories.' : 'Enter a keyword above to search the quote library.' }}"
                        />
                    @endforelse
                @endif
            </div>

            {{-- Pagination --}}
            @if(method_exists($quotes, 'hasPages') && $quotes->hasPages())
                <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
            @endif

        </div>
    </div>
</div>
@endsection