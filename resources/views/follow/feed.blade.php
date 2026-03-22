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
            <div class="flex flex-col gap-4 stagger">
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

            @if($quotes->hasPages())
                <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
            @endif
        @endif

    </div>
</div>
@endsection