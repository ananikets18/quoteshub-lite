@extends('layouts.app')

@section('title', $profile->name . ' (@' . $profile->username . ') — QuotesHub')
@section('description', $profile->bio ?? 'Discover inspiring quotes shared by ' . $profile->name . ' on QuotesHub.')
@section('og_title', $profile->name . ' on QuotesHub')
@section('og_description', $profile->bio ?? 'View profile and quotes by ' . $profile->name)

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 720px;">

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif
        @if(session('error'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;">{{ session('error') }}</div>
        @endif

        {{-- Profile header card --}}
        <div class="panel-card anim-fade-up" style="margin-bottom:20px;overflow:visible;">

            {{-- Cover image --}}
            <div style="height:140px;background:linear-gradient(135deg,rgba(141,52,233,0.4),rgba(192,38,211,0.3),rgba(59,130,246,0.2));border-radius:18px 18px 0 0;position:relative;">
                @if($profile->cover_image)
                    <img src="{{ Storage::url($profile->cover_image) }}" alt="Cover" style="width:100%;height:100%;object-fit:cover;border-radius:18px 18px 0 0;">
                @endif

                {{-- Avatar (overlaps cover) --}}
                <div style="position:absolute;bottom:-36px;left:20px;">
                    <img
                        src="{{ $profile->avatar ?? '/images/default-avatar.png' }}"
                        alt="{{ $profile->name }}"
                        style="width:80px;height:80px;border-radius:20px;object-fit:cover;border:3px solid var(--bg-card);box-shadow:0 4px 20px rgba(0,0,0,0.5);"
                    >
                </div>
            </div>

            {{-- Profile info area --}}
            <div style="padding:52px 20px 20px;">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                    <div>
                        <h1 style="font-size:22px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;margin-bottom:2px;">{{ $profile->name }}</h1>
                        <div style="font-size:14px;color:#64748b;margin-bottom:8px;">@{{ $profile->username }}</div>
                        @if($profile->bio)
                            <p style="font-size:14px;color:#94a3b8;line-height:1.6;max-width:520px;">{{ $profile->bio }}</p>
                        @endif
                        @if($profile->location)
                            <div style="margin-top:8px;display:flex;align-items:center;gap:6px;font-size:13px;color:#64748b;">
                                <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {{ $profile->location }}
                            </div>
                        @endif
                        @if($profile->website)
                            <div style="margin-top:4px;">
                                <a href="{{ $profile->website }}" target="_blank" rel="noopener" style="font-size:13px;color:var(--brand);text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">🔗 {{ $profile->website }}</a>
                            </div>
                        @endif
                    </div>

                    {{-- Action buttons --}}
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        @auth
                            @if($isOwnProfile)
                                <a href="{{ route('profile.edit') }}" class="btn-ghost" style="font-size:13px;padding:8px 16px;">
                                    <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                    Edit Profile
                                </a>
                            @else
                                <div x-data="followButton('{{ $profile->username }}', {{ json_encode($isFollowing) }})">
                                    <button @click="toggle()" :disabled="loading" class="btn-brand" :class="isFollowing ? 'bg-transparent border border-brand-border text-brand' : ''" style="font-size:13px;padding:9px 20px;" x-text="buttonText"></button>
                                </div>
                            @endif
                        @endauth
                    </div>
                </div>

                {{-- Stats row --}}
                <div style="display:flex;gap:24px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border-subtle);flex-wrap:wrap;">
                    @foreach([
                        ['Quotes', $stats['quotes_count']],
                        ['Followers', $stats['followers_count'], 'profile.followers', $profile->username],
                        ['Following', $stats['following_count'], 'profile.following', $profile->username],
                        ['Likes received', $stats['likes_received']],
                    ] as $stat)
                        @if(isset($stat[2]))
                            <a href="{{ route($stat[2], $stat[3]) }}" style="text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                                <div style="font-size:18px;font-weight:800;color:#f1f5f9;">{{ number_format($stat[1]) }}</div>
                                <div style="font-size:12px;color:#64748b;">{{ $stat[0] }}</div>
                            </a>
                        @else
                            <div>
                                <div style="font-size:18px;font-weight:800;color:#f1f5f9;">{{ number_format($stat[1]) }}</div>
                                <div style="font-size:12px;color:#64748b;">{{ $stat[0] }}</div>
                            </div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Quotes section --}}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="font-size:16px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">📜 Quotes</h2>
            @if($isOwnProfile)
                <a href="{{ route('quotes.create') }}" class="btn-brand" style="font-size:13px;padding:8px 16px;">
                    <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                    New Quote
                </a>
            @endif
        </div>

        <div class="flex flex-col gap-4 stagger">
            @forelse($quotes as $quote)
                <x-quote-card :quote="$quote" />
            @empty
                <x-empty-state
                    icon="📭"
                    title="{{ $isOwnProfile ? 'You haven\'t posted any quotes yet' : $profile->name . ' hasn\'t posted any quotes yet' }}"
                    message="{{ $isOwnProfile ? 'Share your first inspirational quote with the community!' : 'Check back later.' }}"
                    @if($isOwnProfile)
                        actionText="Create First Quote"
                        actionUrl="{{ route('quotes.create') }}"
                    @endif
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