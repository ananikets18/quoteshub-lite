@extends('layouts.app')

@section('title', $user->name . '\'s Following — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 640px;">

        {{-- Header --}}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
            <a href="{{ route('profile.show', $user->username) }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 style="font-size:20px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">Following</h1>
                <p style="font-size:13px;color:#64748b;">People @{{ $user->username }} follows · {{ $following->total() }}</p>
            </div>
        </div>

        {{-- List --}}
        <div class="flex flex-col gap-3 stagger">
            @forelse($following as $followedUser)
                <div class="panel-card anim-fade-up" style="padding:16px;display:flex;align-items:center;gap:14px;">
                    <a href="{{ route('profile.show', $followedUser->username) }}" style="flex-shrink:0;">
                        <img src="{{ $followedUser->avatar ?? '/images/default-avatar.png' }}" alt="{{ $followedUser->name }}"
                             style="width:48px;height:48px;border-radius:14px;object-fit:cover;border:1.5px solid var(--border-muted);">
                    </a>
                    <div style="flex:1;min-width:0;">
                        <a href="{{ route('profile.show', $followedUser->username) }}" style="display:block;font-size:15px;font-weight:700;color:#e2e8f0;text-decoration:none;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#e2e8f0'">{{ $followedUser->name }}</a>
                        <div style="font-size:13px;color:#64748b;">@{{ $followedUser->username }}</div>
                        @if($followedUser->bio)
                            <div style="font-size:13px;color:#475569;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;">{{ $followedUser->bio }}</div>
                        @endif
                    </div>
                    @auth
                        @if(!$followedUser->is_self)
                            <div x-data="followButton('{{ $followedUser->username }}', {{ json_encode($followedUser->is_following) }})">
                                <button @click="toggle()" :disabled="loading" class="btn-ghost"
                                        style="font-size:13px;padding:7px 16px;white-space:nowrap;"
                                        x-text="buttonText"></button>
                            </div>
                        @endif
                    @endauth
                </div>
            @empty
                <x-empty-state icon="👥" title="Not following anyone yet" message="{{ $user->name }} isn't following anyone yet." />
            @endforelse
        </div>

        @if($following->hasPages())
            <div class="mt-8 flex justify-center">{{ $following->links() }}</div>
        @endif

    </div>
</div>
@endsection