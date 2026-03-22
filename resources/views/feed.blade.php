@extends('layouts.app')

@section('title', 'Home — QuotesHub')
@section('description', 'Discover inspiring quotes from great minds. Your daily dose of wisdom and motivation on QuotesHub.')

@section('content')
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
                <h1 class="page-title">Feed</h1>
                <p class="page-subtitle">Discover and connect with the community</p>
            </div>

            {{-- Feed Tab Switcher --}}
            @auth
            <div style="display:flex;gap:4px;padding:4px;background:var(--bg-elevated);border-radius:16px;border:1px solid var(--border-subtle);margin-bottom:16px;">
                <a href="{{ route('feed') }}"
                   style="flex:1;text-align:center;padding:9px 16px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s ease;
                          {{ !request()->routeIs('following.feed') ? 'background:var(--brand);color:#fff;box-shadow:0 4px 16px rgba(141,52,233,0.35);' : 'color:#64748b;' }}">
                    ✨ For You
                </a>
                <a href="{{ route('following.feed') }}"
                   style="flex:1;text-align:center;padding:9px 16px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s ease;
                          {{ request()->routeIs('following.feed') ? 'background:var(--brand);color:#fff;box-shadow:0 4px 16px rgba(141,52,233,0.35);' : 'color:#64748b;' }}">
                    👥 Following
                </a>
            </div>
            @endauth

            {{-- Sort / Filter bar --}}
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
                @foreach(['latest' => '🕐 Latest', 'trending' => '📈 Trending', 'popular' => '🔥 Popular'] as $val => $label)
                    <a href="{{ request()->fullUrlWithQuery(['sort' => $val]) }}"
                       style="padding:7px 16px;border-radius:22px;font-size:13px;font-weight:600;text-decoration:none;transition:all 0.2s ease;
                              {{ request()->get('sort', 'latest') === $val
                                  ? 'background:var(--brand);color:#fff;box-shadow:0 4px 12px rgba(141,52,233,0.35);'
                                  : 'background:var(--bg-elevated);color:#64748b;border:1px solid var(--border-subtle);' }}">
                        {{ $label }}
                    </a>
                @endforeach
            </div>

            {{-- Mobile-only: Categories scroll strip --}}
            <div class="lg:hidden mb-4 -mx-3 px-3 overflow-x-auto no-scrollbar">
                <div class="flex gap-2 pb-1" style="width:max-content;">
                    <a href="{{ route('feed') }}"
                       class="category-pill flex-shrink-0"
                       style="{{ !request()->has('category') ? 'background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.5);' : '' }}">
                        🏠 All
                    </a>
                    @foreach($categories->take(10) as $cat)
                        <a href="{{ route('feed', ['category' => $cat->slug]) }}"
                           class="category-pill flex-shrink-0"
                           style="{{ request()->get('category') === $cat->slug ? 'background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.5);' : '' }}">
                            {{ $cat->icon ?? '●' }} {{ $cat->name }}
                        </a>
                    @endforeach
                </div>
            </div>

            {{-- ═══ INFINITE SCROLL FEED ═══ --}}
            <div
                id="feed-list"
                x-data="feedInfiniteScroll('{{ route('feed') }}', {{ json_encode(request()->only(['sort', 'category'])) }})"
                x-init="init()"
            >
                {{-- Server-rendered first page (no-JS / fast initial paint) --}}
                <div id="feed-ssr" class="flex flex-col gap-4 stagger">
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

                {{-- Dynamically appended cards go here --}}
                <template x-if="items.length > 0">
                    <div class="flex flex-col gap-4" id="feed-dynamic">
                        <template x-for="q in items" :key="q.id">
                            <div x-html="q._rendered"></div>
                        </template>
                    </div>
                </template>

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
                <template x-if="!hasMore && !loading && (items.length > 0 || {{ $quotes->count() }} > 0)">
                    <div style="text-align:center;padding:32px 16px;color:#475569;font-size:13px;">
                        ✨ You've seen all the quotes for now. Check back soon!
                    </div>
                </template>

                {{-- Scroll sentinel — IntersectionObserver watches this --}}
                <div id="scroll-sentinel" style="height:1px;margin-top:16px;"></div>
            </div>

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
