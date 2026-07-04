@extends('layouts.app')

@section('title', 'Achievements — QuotesHub')
@section('description', 'View your QuotesHub achievements, badges, and milestones.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 760px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
                <h1 class="page-title">🏆 Achievements</h1>
                <p class="page-subtitle">Your milestones and badges</p>
            </div>
            {{-- Total points badge --}}
            <div style="display:flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,rgba(141,52,233,0.2),rgba(192,38,211,0.1));border:1px solid var(--brand-border);border-radius:14px;">
                <span style="font-size:20px;">⭐</span>
                <div>
                    <div style="font-size:20px;font-weight:800;color:#f1f5f9;line-height:1;">{{ number_format($totalPoints) }}</div>
                    <div style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Points</div>
                </div>
            </div>
        </div>

        {{-- Progress overview --}}
        <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:20px;">
            <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Overall Progress</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                <div>
                    <div style="font-size:26px;font-weight:800;color:#f1f5f9;">{{ $progress['earned'] ?? 0 }}</div>
                    <div style="font-size:12px;color:#64748b;margin-top:2px;">Earned</div>
                </div>
                <div>
                    <div style="font-size:26px;font-weight:800;color:#f59e0b;">{{ ($progress['total'] ?? 0) - ($progress['earned'] ?? 0) }}</div>
                    <div style="font-size:12px;color:#64748b;margin-top:2px;">Remaining</div>
                </div>
                <div>
                    <div style="font-size:26px;font-weight:800;color:var(--brand);">{{ $progress['percentage'] ?? 0 }}%</div>
                    <div style="font-size:12px;color:#64748b;margin-top:2px;">Complete</div>
                </div>
            </div>
            {{-- Progress bar --}}
            <div style="margin-top:16px;">
                <div style="height:6px;border-radius:99px;background:var(--border-subtle);overflow:hidden;">
                    <div style="height:100%;border-radius:99px;background:linear-gradient(90deg,var(--brand),#c026d3);transition:width 1s ease;width:{{ $progress['percentage'] ?? 0 }}%;"></div>
                </div>
            </div>
        </div>

        {{-- Achievements grid --}}
        @php
            $earned = collect($achievements)->filter(fn($a) => $a['earned'] ?? false);
            $unearned = collect($achievements)->filter(fn($a) => !($a['earned'] ?? false));
        @endphp

        @if($earned->isNotEmpty())
            <div style="font-size:14px;font-weight:700;color:#34d399;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">✅ Earned ({{ $earned->count() }})</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:28px;">
                @foreach($earned as $ach)
                    <div class="panel-card anim-fade-up" style="padding:20px;text-align:center;border-color:rgba(52,211,153,0.25);background:rgba(16,185,129,0.05);">
                        <div style="font-size:36px;margin-bottom:10px;">{{ $ach['icon'] ?? '🏅' }}</div>
                        <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">{{ $ach['name'] }}</div>
                        <div style="font-size:12px;color:#64748b;line-height:1.4;margin-bottom:10px;">{{ $ach['description'] }}</div>
                        <div style="font-size:12px;font-weight:700;color:#34d399;background:rgba(16,185,129,0.1);padding:3px 10px;border-radius:99px;display:inline-block;">+{{ $ach['points'] ?? 0 }} pts</div>
                        @if($ach['earned_at'] ?? false)
                            <div style="font-size:11px;color:#475569;margin-top:6px;">{{ \Carbon\Carbon::parse($ach['earned_at'])->format('M j, Y') }}</div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif

        @if($unearned->isNotEmpty())
            <div style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">🔒 Locked ({{ $unearned->count() }})</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
                @foreach($unearned as $ach)
                    <div class="panel-card anim-fade-up" style="padding:20px;text-align:center;opacity:0.55;">
                        <div style="font-size:36px;margin-bottom:10px;filter:grayscale(1);">{{ $ach['icon'] ?? '🔒' }}</div>
                        <div style="font-size:14px;font-weight:700;color:#94a3b8;margin-bottom:4px;">{{ $ach['name'] }}</div>
                        <div style="font-size:12px;color:#475569;line-height:1.4;margin-bottom:10px;">{{ $ach['description'] }}</div>
                        @if(($ach['progress'] ?? null) !== null && $ach['target'] ?? null)
                            <div style="margin-bottom:8px;">
                                <div style="height:4px;border-radius:99px;background:var(--border-subtle);overflow:hidden;">
                                    <div style="height:100%;background:var(--border-muted);border-radius:99px;width:{{ min(100, round(($ach['progress'] / $ach['target']) * 100)) }}%;"></div>
                                </div>
                                <div style="font-size:11px;color:#475569;margin-top:4px;">{{ $ach['progress'] }} / {{ $ach['target'] }}</div>
                            </div>
                        @endif
                        <div style="font-size:12px;font-weight:700;color:#475569;background:var(--border-subtle);padding:3px 10px;border-radius:99px;display:inline-block;">{{ $ach['points'] ?? 0 }} pts</div>
                    </div>
                @endforeach
            </div>
        @endif

        @if(empty($achievements))
            <x-empty-state icon="🏆" title="No achievements yet" message="Start posting quotes, engaging with the community, and earning your first achievements!" actionText="Go to Feed" actionUrl="{{ route('feed') }}" />
        @endif

    </div>
</div>
@endsection