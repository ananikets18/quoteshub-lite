@extends('layouts.app')

@section('title', 'Following Feed — QuotesHub')
@section('description', 'Quotes from people you follow on QuotesHub.')

@section('content')
<div class="app-main">
    <div class="feed-container">

        {{-- Header --}}
        <div class="page-header">
            <h1 class="page-title">Feed</h1>
            <p class="page-subtitle">Latest from people you follow</p>
        </div>

        {{-- Feed Tab Switcher --}}
        <div style="display:flex;gap:4px;padding:4px;background:var(--bg-elevated);border-radius:16px;border:1px solid var(--border-subtle);margin-bottom:20px;">
            <a href="{{ route('feed') }}"
               style="flex:1;text-align:center;padding:9px 16px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s ease;color:#64748b;">
                ✨ For You
            </a>
            <a href="{{ route('following.feed') }}"
               style="flex:1;text-align:center;padding:9px 16px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s ease;background:var(--brand);color:#fff;box-shadow:0 4px 16px rgba(141,52,233,0.35);">
                👥 Following
            </a>
        </div>

        @if($followingCount === 0)
            {{-- No follows yet --}}
            <x-empty-state
                icon="🌱"
                title="Your feed is empty"
                message="You're not following anyone yet. Explore the community and follow people to see their quotes here."
                actionText="Explore People"
                actionUrl="{{ route('topics.index') }}"
            />
        @else
            {{-- ═══ INFINITE SCROLL FEED ═══ --}}
            <div
                id="feed-list"
                x-data="feedInfiniteScroll('{{ route('following.feed') }}')"
                x-init="init()"
            >
                {{-- Server-rendered first page --}}
                <div id="feed-ssr" class="flex flex-col gap-4 stagger">
                    @forelse($quotes as $quote)
                        <x-quote-card :quote="$quote" />
                    @empty
                        <x-empty-state
                            icon="✨"
                            title="Nothing new yet"
                            message="The {{ $followingCount }} {{ $followingCount === 1 ? 'person' : 'people' }} you follow haven't posted anything recently."
                            actionText="Browse All Quotes"
                            actionUrl="{{ route('feed') }}"
                        />
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
                        ✨ You've seen all latest quotes from people you follow.
                    </div>
                </template>

                {{-- Scroll sentinel --}}
                <div id="scroll-sentinel" style="height:1px;margin-top:16px;"></div>
            </div>
        @endif

    </div>
</div>
@endsection