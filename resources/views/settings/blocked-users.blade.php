@extends('layouts.app')

@section('title', 'Blocked Users — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 640px;">

        {{-- Header --}}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
            <a href="{{ route('settings') }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 style="font-size:20px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">🚫 Blocked Users</h1>
                <p style="font-size:13px;color:#64748b;">{{ $blockedUsers->count() }} user{{ $blockedUsers->count() !== 1 ? 's' : '' }} blocked</p>
            </div>
        </div>

        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        <div class="flex flex-col gap-3">
            @forelse($blockedUsers as $blocked)
                <div class="panel-card anim-fade-up" style="padding:16px;display:flex;align-items:center;gap:14px;">
                    <img src="{{ $blocked->avatar ?? '/images/default-avatar.png' }}" alt="{{ $blocked->name }}"
                         style="width:46px;height:46px;border-radius:13px;object-fit:cover;border:1.5px solid var(--border-muted);flex-shrink:0;filter:grayscale(0.4);">
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:15px;font-weight:700;color:#e2e8f0;">{{ $blocked->name }}</div>
                        <div style="font-size:13px;color:#64748b;">{{ '@' . $blocked->username }}</div>
                    </div>
                    <form method="DELETE" action="{{ route('users.unblock', $blocked->username) }}">
                        @csrf @method('DELETE')
                        <button type="submit" class="btn-ghost" style="font-size:13px;padding:7px 14px;"
                                onmouseover="this.style.borderColor='rgba(16,185,129,0.4)';this.style.color='#34d399'"
                                onmouseout="this.style.borderColor='';this.style.color=''">
                            Unblock
                        </button>
                    </form>
                </div>
            @empty
                <x-empty-state
                    icon="✅"
                    title="No blocked users"
                    message="You haven't blocked anyone. When you block a user, they'll appear here."
                />
            @endforelse
        </div>

    </div>
</div>
@endsection