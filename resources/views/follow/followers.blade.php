@extends('layouts.app')

@section('title', $user->name . '\'s Followers — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 640px;">

        {{-- Header --}}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
            <a href="{{ route('profile.show', $user->username) }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 style="font-size:20px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">Followers</h1>
                <p style="font-size:13px;color:#64748b;">People following {{ '@' . $user->username }} · {{ $followers->total() }}</p>
            </div>
        </div>

        {{-- List --}}
        <div class="flex flex-col gap-3 stagger">
            @forelse($followers as $follower)
                <div class="panel-card anim-fade-up" style="padding:16px;display:flex;align-items:center;gap:14px;">
                    <a href="{{ route('profile.show', $follower->username) }}" style="flex-shrink:0;">
                        <img src="{{ $follower->avatar ?? '/images/default-avatar.png' }}" alt="{{ $follower->name }}"
                             style="width:48px;height:48px;border-radius:14px;object-fit:cover;border:1.5px solid var(--border-muted);">
                    </a>
                    <div style="flex:1;min-width:0;">
                        <a href="{{ route('profile.show', $follower->username) }}" style="display:block;font-size:15px;font-weight:700;color:#e2e8f0;text-decoration:none;line-height:1.3;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#e2e8f0'">{{ $follower->name }}</a>
                        <div style="font-size:13px;color:#64748b;">{{ '@' . $follower->username }}</div>
                        @if($follower->bio)
                            <div style="font-size:13px;color:#475569;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;">{{ $follower->bio }}</div>
                        @endif
                    </div>
                    @auth
                        @if(!$follower->is_self)
                            <div x-data="followButton('{{ $follower->username }}', {{ json_encode($follower->is_following) }})">
                                <button @click="toggle()" :disabled="loading" class="btn-ghost"
                                        :class="isFollowing ? 'border-brand-border' : ''"
                                        style="font-size:13px;padding:7px 16px;white-space:nowrap;"
                                        x-text="buttonText"></button>
                            </div>
                        @endif
                    @endauth
                </div>
            @empty
                <x-empty-state icon="👥" title="No followers yet" message="{{ $user->name }} doesn't have any followers yet." />
            @endforelse
        </div>

        @if($followers->hasPages())
            <div class="mt-8 flex justify-center">{{ $followers->links() }}</div>
        @endif

    </div>
</div>
@endsection