@extends('layouts.app')

@section('title', 'Dashboard — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 760px;">

            {{-- Header --}}
            <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                <div>
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-subtitle">Welcome back, {{ auth()->user()->name }} 👋</p>
                </div>
                <a href="{{ route('quotes.create') }}" class="btn-brand">
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                    New Quote
                </a>
            </div>

            {{-- Stats grid --}}
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;" class="sm:grid-cols-4">
                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(139,92,246,0.15);">📝</div>
                    <div class="stat-value">{{ $stats['quotes_count'] ?? 0 }}</div>
                    <div class="stat-label">Quotes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(244,63,94,0.15);">❤️</div>
                    <div class="stat-value">{{ $stats['total_likes'] ?? 0 }}</div>
                    <div class="stat-label">Total Likes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(59,130,246,0.15);">👥</div>
                    <div class="stat-value">{{ $stats['followers_count'] ?? 0 }}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(245,158,11,0.15);">🔥</div>
                    <div class="stat-value">{{ $stats['daily_streak'] ?? 0 }}</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>

            {{-- This week --}}
            <div class="panel-card" style="margin-bottom:24px;">
                <div class="panel-card-header">📅 This Week</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border-subtle);">
                    @foreach([
                        ['Quotes', $stats['this_week']['quotes'] ?? 0, '📝'],
                        ['Likes',  $stats['this_week']['likes']  ?? 0, '❤️'],
                        ['New Followers', $stats['this_week']['followers'] ?? 0, '👤'],
                    ] as $item)
                        <div style="background:var(--bg-card);padding:16px;text-align:center;">
                            <div style="font-size:20px;margin-bottom:4px;">{{ $item[2] }}</div>
                            <div style="font-size:20px;font-weight:800;color:#f1f5f9;">{{ $item[1] }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $item[0] }}</div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Quick Actions --}}
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;">
                <a href="{{ route('quotes.create') }}"
                   style="padding:20px;border-radius:18px;background:#8D34E9;text-decoration:none;display:flex;align-items:center;gap:12px;transition:transform 0.2s ease,box-shadow 0.2s ease;box-shadow:0 4px 20px rgba(141,52,233,0.35);"
                   onmouseover="this.style.transform='translateY(-2px)';this.style.background='#7B2DD0';this.style.boxShadow='0 8px 32px rgba(141,52,233,0.45)'"
                   onmouseout="this.style.transform='';this.style.background='#8D34E9';this.style.boxShadow='0 4px 20px rgba(141,52,233,0.35)'">
                    <div style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">✍️</div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:#fff;">Create Quote</div>
                        <div style="font-size:12px;color:rgba(255,255,255,0.7);">Share your wisdom</div>
                    </div>
                </a>
                <a href="{{ route('profile.show', auth()->user()->username) }}"
                   class="panel-card"
                   style="padding:20px;text-decoration:none;display:flex;align-items:center;gap:12px;transition:border-color 0.2s ease,transform 0.2s ease;"
                   onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='rgba(139,92,246,0.3)'"
                   onmouseout="this.style.transform='';this.style.borderColor=''">
                    <div style="width:40px;height:40px;border-radius:12px;background:rgba(139,92,246,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👤</div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:#e2e8f0;">My Profile</div>
                        <div style="font-size:12px;color:#64748b;">View public page</div>
                    </div>
                </a>
                <a href="{{ route('saved') }}"
                   class="panel-card"
                   style="padding:20px;text-decoration:none;display:flex;align-items:center;gap:12px;transition:border-color 0.2s ease,transform 0.2s ease;"
                   onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='rgba(139,92,246,0.3)'"
                   onmouseout="this.style.transform='';this.style.borderColor=''">
                    <div style="width:40px;height:40px;border-radius:12px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🔖</div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:#e2e8f0;">Saved Quotes</div>
                        <div style="font-size:12px;color:#64748b;">{{ $stats['total_saves'] ?? 0 }} saved</div>
                    </div>
                </a>
                <a href="{{ route('achievements') }}"
                   class="panel-card"
                   style="padding:20px;text-decoration:none;display:flex;align-items:center;gap:12px;transition:border-color 0.2s ease,transform 0.2s ease;"
                   onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='rgba(139,92,246,0.3)'"
                   onmouseout="this.style.transform='';this.style.borderColor=''">
                    <div style="width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🏆</div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:#e2e8f0;">Achievements</div>
                        <div style="font-size:12px;color:#64748b;">View your badges</div>
                    </div>
                </a>
            </div>

            {{-- Recent Quotes --}}
            @if(count($stats['recent_quotes'] ?? []) > 0)
                <div class="panel-card" style="margin-bottom:24px;">
                    <div class="panel-card-header" style="display:flex;align-items:center;justify-content:space-between;">
                        <span>📜 Recent Quotes</span>
                        <a href="{{ route('profile.show', auth()->user()->username) }}"
                           style="font-size:12px;color:#8b5cf6;font-weight:600;text-decoration:none;">View all →</a>
                    </div>
                    <div style="padding:8px 12px;display:flex;flex-direction:column;gap:4px;">
                        @foreach($stats['recent_quotes'] as $q)
                            <a href="{{ route('quotes.show', $q['id']) }}"
                               style="display:flex;align-items:flex-start;gap:12px;padding:10px 8px;border-radius:12px;text-decoration:none;transition:background 0.2s ease;"
                               onmouseover="this.style.background='rgba(255,255,255,0.04)'"
                               onmouseout="this.style.background=''">
                                <div style="flex:1;min-width:0;">
                                    <p style="font-family:'Playfair Display',serif;font-size:14px;color:#cbd5e1;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
                                        "{{ $q['content'] }}"
                                    </p>
                                </div>
                                <div style="display:flex;gap:10px;flex-shrink:0;font-size:12px;color:#64748b;align-items:center;padding-top:2px;">
                                    <span>❤️ {{ $q['likes_count'] }}</span>
                                    <span>💾 {{ $q['saves_count'] }}</span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- Top quote --}}
            @if($stats['top_quote'] ?? false)
                <div class="panel-card" style="margin-bottom:24px;overflow:hidden;">
                    <div class="panel-card-header">⭐ Your Best Quote</div>
                    <div style="padding:16px 20px;background:linear-gradient(135deg, rgba(124,58,237,0.08), rgba(219,39,119,0.04));">
                        <p style="font-family:'Playfair Display',serif;font-size:16px;color:#e2e8f0;line-height:1.6;">
                            "{{ $stats['top_quote']['content'] }}"
                        </p>
                        <div style="margin-top:12px;display:flex;gap:16px;font-size:13px;color:#64748b;">
                            <span>❤️ {{ $stats['top_quote']['likes_count'] }} likes</span>
                            <span>💾 {{ $stats['top_quote']['saves_count'] }} saves</span>
                        </div>
                    </div>
                </div>
            @endif

    </div>
</div>
@endsection