@extends('layouts.app')

@section('title', 'Notification Preferences — QuotesHub')
@section('description', 'Control which notifications you receive from QuotesHub.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 660px;">

        {{-- Header --}}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
            <a href="{{ route('settings') }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 class="page-title">🔔 Notification Preferences</h1>
                <p class="page-subtitle">Control what you hear about</p>
            </div>
        </div>

        {{-- Status --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        <form method="POST" action="{{ route('profile.notification-preferences.update') }}" x-data="{ prefs: {{ json_encode($preferences->toArray()) }} }">
            @csrf

            {{-- Activity notifications --}}
            <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Activity</div>
                <p style="font-size:12px;color:#475569;margin-bottom:20px;">Notifications about interactions with your quotes and profile</p>

                @foreach([
                    ['new_follower', '👤', 'New Follower', 'When someone starts following you'],
                    ['quote_liked', '❤️', 'Quote Liked', 'When someone likes one of your quotes'],
                    ['quote_saved', '🔖', 'Quote Saved', 'When someone bookmarks your quote'],
                    ['comment_added', '💬', 'Comment Added', 'When someone comments on your quote'],
                    ['achievement_unlocked', '🏆', 'Achievement Unlocked', 'When you earn a new badge or milestone'],
                ] as [$key, $icon, $label, $desc])
                <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="font-size:20px;width:28px;text-align:center;">{{ $icon }}</div>
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                        </div>
                    </div>
                    <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;flex-shrink:0;">
                        <input type="checkbox" name="{{ $key }}" value="1" x-model="prefs.{{ $key }}" {{ ($preferences->$key ?? true) ? 'checked' : '' }} style="opacity:0;width:0;height:0;position:absolute;">
                        <span :style="prefs.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'" style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                        <span :style="prefs.{{ $key }} ? 'left:22px;' : 'left:2px;'" style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                    </label>
                </div>
                @endforeach
            </div>

            {{-- System notifications --}}
            <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">System & Admin</div>
                <p style="font-size:12px;color:#475569;margin-bottom:20px;">Important platform notifications</p>

                @foreach([
                    ['admin_warning', '⚠️', 'Admin Warnings', 'Official messages from the QuotesHub team'],
                    ['quote_removed', '🗑️', 'Quote Removed', 'When one of your quotes is removed by a moderator'],
                    ['quote_featured', '⭐', 'Quote Featured', 'When your quote is featured on the platform'],
                ] as [$key, $icon, $label, $desc])
                <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="font-size:20px;width:28px;text-align:center;">{{ $icon }}</div>
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                        </div>
                    </div>
                    <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;flex-shrink:0;">
                        <input type="checkbox" name="{{ $key }}" value="1" x-model="prefs.{{ $key }}" {{ ($preferences->$key ?? true) ? 'checked' : '' }} style="opacity:0;width:0;height:0;position:absolute;">
                        <span :style="prefs.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'" style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                        <span :style="prefs.{{ $key }} ? 'left:22px;' : 'left:2px;'" style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                    </label>
                </div>
                @endforeach
            </div>

            {{-- Delivery methods --}}
            <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Delivery Methods</div>
                <p style="font-size:12px;color:#475569;margin-bottom:20px;">Choose how you receive notifications</p>

                @foreach([
                    ['in_app_notifications', '📲', 'In-App', 'Show notifications within QuotesHub'],
                    ['email_notifications', '📧', 'Email', 'Send notifications to your email'],
                    ['notification_sounds', '🔊', 'Sounds', 'Play sounds for new notifications'],
                    ['group_similar_notifications', '📦', 'Group Similar', 'Bundle similar notifications together'],
                ] as [$key, $icon, $label, $desc])
                <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="font-size:20px;width:28px;text-align:center;">{{ $icon }}</div>
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                        </div>
                    </div>
                    <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;flex-shrink:0;">
                        <input type="checkbox" name="{{ $key }}" value="1" x-model="prefs.{{ $key }}" {{ ($preferences->$key ?? false) ? 'checked' : '' }} style="opacity:0;width:0;height:0;position:absolute;">
                        <span :style="prefs.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'" style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                        <span :style="prefs.{{ $key }} ? 'left:22px;' : 'left:2px;'" style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                    </label>
                </div>
                @endforeach
            </div>

            <div style="display:flex;justify-content:flex-end;">
                <button type="submit" class="btn-brand">
                    <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Save Preferences
                </button>
            </div>
        </form>
    </div>
</div>
@endsection