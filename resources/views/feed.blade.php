@extends('layouts.app')

@section('title', 'Home — QuotesHub')
@section('description', 'Discover inspiring quotes from great minds. Your daily dose of wisdom and motivation on QuotesHub.')

@section('content')
{{-- By using class="app-main", this content sits right of the desktop sidebar
     (sidebar is rendered by layouts/navigation.blade.php which is always included) --}}
<div class="app-main" style="display:flex; min-height:100dvh;">

    {{-- Center feed --}}
    <div style="flex:1;min-width:0;">
        <div class="feed-container">

            {{-- Flash messages --}}
            @if(session('success'))
                <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
                     style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #34d399;">
                    ✓ {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium"
                     style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #f87171;">
                    {{ session('error') }}
                </div>
            @endif

            {{-- Page header --}}
            <div class="page-header">
                <h1 class="page-title">For You</h1>
                <p class="page-subtitle">Curated wisdom from the community</p>
            </div>

            {{-- Mobile-only: Categories scroll strip --}}
            <div class="lg:hidden mb-4 -mx-3 px-3 overflow-x-auto no-scrollbar">
                <div class="flex gap-2 pb-1" style="width:max-content;">
                    <a href="{{ route('feed') }}"
                       class="category-pill flex-shrink-0"
                       style="{{ request()->routeIs('feed') ? 'background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.5);' : '' }}">
                        🏠 All
                    </a>
                    @foreach($categories->take(10) as $cat)
                        <a href="{{ route('category.show', $cat->slug) }}"
                           class="category-pill flex-shrink-0">
                            {{ $cat->icon ?? '●' }} {{ $cat->name }}
                        </a>
                    @endforeach
                </div>
            </div>

            {{-- Quote cards --}}
            <div class="flex flex-col gap-4 stagger">
                @forelse($quotes as $quote)
                    <x-quote-card :quote="$quote" />
                @empty
                    <x-empty-state
                        icon="📭"
                        title="Nothing here yet"
                        message="Be the first to share an inspiring quote with the community!"
                        @auth
                            actionText="Create First Quote"
                            actionUrl="{{ route('quotes.create') }}"
                        @endauth
                    />
                @endforelse
            </div>

            {{-- Pagination --}}
            @if($quotes->hasPages())
                <div class="mt-8 flex justify-center">
                    {{ $quotes->links() }}
                </div>
            @endif

        </div>
    </div>

    {{-- Right panel (only on xl screens) --}}
    <aside class="app-right-panel hidden xl:flex flex-col">

        {{-- Search --}}
        <div x-data="searchBar()">
            <div class="search-bar" style="margin-bottom:12px;">
                <svg class="search-bar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" x-model="query" @input="onInput" placeholder="Search quotes, people..." x-ref="searchInput">
            </div>
            <div x-show="isOpen && results.length > 0" @click.away="close()" x-transition
                 class="rounded-xl overflow-hidden mb-4"
                 style="background: var(--bg-elevated); border: 1px solid var(--border-muted);">
                <template x-for="result in results" :key="result.id">
                    <div @click="selectResult(result)"
                         class="px-4 py-3 cursor-pointer border-b last:border-b-0 hover:opacity-80"
                         style="border-color: var(--border-subtle);">
                        <div class="text-sm font-medium" style="color:#e2e8f0;" x-html="highlightMatch(result.title, query)"></div>
                        <div class="text-xs mt-0.5" style="color:#64748b;" x-text="result.type"></div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Trending categories --}}
        <div class="panel-card">
            <div class="panel-card-header">🔥 Trending Categories</div>
            <div class="panel-card-body">
                @foreach($categories->take(8) as $category)
                    <a href="{{ route('category.show', $category->slug) }}" class="panel-category-item">
                        <span>{{ $category->icon ?? '●' }} {{ $category->name }}</span>
                        <span class="panel-category-count">{{ $category->quotes_count }}</span>
                    </a>
                @endforeach
            </div>
        </div>

        {{-- Suggested users --}}
        @if(($suggestedUsers ?? collect())->count() > 0)
            <div class="panel-card">
                <div class="panel-card-header">✨ People to Follow</div>
                <div class="panel-card-body">
                    @foreach($suggestedUsers->take(5) as $user)
                        <div class="flex items-center gap-2" style="padding:4px 0;">
                            <a href="{{ route('profile.show', $user->username) }}"
                               class="flex items-center gap-2 flex-1 min-w-0 text-decoration-none">
                                <img src="{{ $user->avatar ?? '/images/default-avatar.png' }}"
                                     alt="{{ $user->name }}"
                                     class="panel-user-avatar" style="border-radius:10px;">
                                <div class="flex-1 min-w-0">
                                    <div class="panel-user-name truncate">{{ $user->name }}</div>
                                    <div class="panel-user-sub">{{ $user->quotes_count ?? 0 }} quotes</div>
                                </div>
                            </a>
                            @auth
                                <div x-data="followButton('{{ $user->username }}', {{ json_encode($user->is_following ?? false) }})">
                                    <button @click="toggle()" :disabled="loading"
                                            class="btn-follow" :class="isFollowing ? 'following' : ''"
                                            x-text="buttonText">
                                    </button>
                                </div>
                            @endauth
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        {{-- Footer --}}
        <div style="margin-top:auto; padding:8px 4px; display:flex;flex-wrap:wrap;gap:8px;">
            @foreach([['About','about'],['Privacy','privacy'],['Terms','terms'],['Guidelines','guidelines']] as $link)
                <a href="{{ route($link[1]) }}"
                   style="font-size:11px;color:#475569;text-decoration:none;"
                   onmouseover="this.style.color='#94a3b8'"
                   onmouseout="this.style.color='#475569'">{{ $link[0] }}</a>
            @endforeach
        </div>
        <div style="font-size:11px;color:#334155;padding:0 4px;">© {{ date('Y') }} QuotesHub</div>
    </aside>
</div>
@endsection
