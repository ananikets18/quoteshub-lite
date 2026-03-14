@extends('layouts.app')

@section('title', 'Admin Dashboard — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 1000px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
                <h1 class="page-title">🛡️ Admin Dashboard</h1>
                <p class="page-subtitle">Platform overview and management</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <a href="{{ route('admin.reports') }}" class="btn-ghost" style="font-size:13px;padding:8px 16px;">
                    @if(($stats['pending_reports'] ?? 0) > 0)
                        <span style="display:inline-flex;align-items:center;justify-content:center;background:#ef4444;color:#fff;border-radius:99px;font-size:10px;font-weight:700;width:18px;height:18px;margin-right:4px;">{{ $stats['pending_reports'] }}</span>
                    @endif
                    ⚠️ Reports
                </a>
                <a href="{{ route('admin.users') }}" class="btn-ghost" style="font-size:13px;padding:8px 16px;">👥 Users</a>
            </div>
        </div>

        {{-- Stats grid --}}
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:28px;">
            @foreach([
                ['👥', 'Total Users', $stats['total_users'] ?? 0, 'rgba(59,130,246,0.12)'],
                ['📜', 'Total Quotes', $stats['total_quotes'] ?? 0, 'rgba(141,52,233,0.12)'],
                ['❤️', 'Total Likes', $stats['total_likes'] ?? 0, 'rgba(244,63,94,0.12)'],
                ['⚠️', 'Pending Reports', $stats['pending_reports'] ?? 0, 'rgba(245,158,11,0.12)'],
                ['✅', 'Approved Quotes', $stats['approved_quotes'] ?? 0, 'rgba(16,185,129,0.12)'],
                ['🚫', 'Removed Quotes', $stats['removed_quotes'] ?? 0, 'rgba(239,68,68,0.12)'],
            ] as [$icon, $label, $value, $bg])
                <div class="panel-card anim-fade-up" style="padding:20px;background:{{ $bg }};text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">{{ $icon }}</div>
                    <div style="font-size:24px;font-weight:800;color:#f1f5f9;margin-bottom:4px;">{{ number_format($value) }}</div>
                    <div style="font-size:12px;color:#64748b;font-weight:500;">{{ $label }}</div>
                </div>
            @endforeach
        </div>

        {{-- Recent Activity --}}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex-wrap:wrap;">

            {{-- Recent Users --}}
            <div class="panel-card anim-fade-up">
                <div class="panel-card-header">🆕 Recent Users</div>
                <div class="panel-card-body">
                    @foreach($recentUsers ?? [] as $u)
                        <div style="display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:1px solid var(--border-subtle);">
                            <img src="{{ $u->avatar ?? '/images/default-avatar.png' }}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:13px;font-weight:600;color:#e2e8f0;">{{ $u->name }}</div>
                                <div style="font-size:11px;color:#64748b;">{{ '@' . $u->username }} · {{ $u->created_at->diffForHumans() }}</div>
                            </div>
                            <span style="font-size:11px;padding:2px 8px;border-radius:99px;{{ $u->role === 'admin' ? 'background:rgba(141,52,233,0.2);color:#c084fc;border:1px solid var(--brand-border);' : 'background:var(--border-subtle);color:#64748b;' }}">{{ $u->role ?? 'user' }}</span>
                        </div>
                    @endforeach
                    <a href="{{ route('admin.users') }}" style="display:block;text-align:center;font-size:13px;color:var(--brand);padding:10px 0;text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">View all users →</a>
                </div>
            </div>

            {{-- Recent Reports --}}
            <div class="panel-card anim-fade-up">
                <div class="panel-card-header">🚨 Recent Reports</div>
                <div class="panel-card-body">
                    @forelse($recentReports ?? [] as $report)
                        <div style="padding:10px 4px;border-bottom:1px solid var(--border-subtle);">
                            <div style="font-size:13px;color:#e2e8f0;font-weight:500;margin-bottom:2px;">{{ Str::limit($report->reason, 60) }}</div>
                            <div style="font-size:11px;color:#64748b;">{{ $report->created_at->diffForHumans() }} ·
                                <span style="{{ $report->status === 'pending' ? 'color:#f59e0b;' : 'color:#34d399;' }}">{{ ucfirst($report->status) }}</span>
                            </div>
                        </div>
                    @empty
                        <p style="font-size:13px;color:#64748b;padding:16px 4px;">No recent reports. 🎉</p>
                    @endforelse
                    <a href="{{ route('admin.reports') }}" style="display:block;text-align:center;font-size:13px;color:var(--brand);padding:10px 0;text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">View all reports →</a>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection