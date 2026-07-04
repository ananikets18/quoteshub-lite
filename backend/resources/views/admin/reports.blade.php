@extends('layouts.app')

@section('title', 'Admin — Reports — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 900px;">

        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
                <h1 class="page-title">⚠️ Report Queue</h1>
                <p class="page-subtitle">Review user-submitted reports</p>
            </div>
            <a href="{{ route('admin.dashboard') }}" class="btn-ghost" style="font-size:13px;padding:8px 14px;">← Dashboard</a>
        </div>

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        {{-- Reports list --}}
        <div class="flex flex-col gap-4 stagger">
            @forelse($reports as $report)
                <div class="panel-card anim-fade-up" style="padding:20px;">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
                        {{-- Report info --}}
                        <div style="flex:1;min-width:0;">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                                <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;{{ $report->status === 'pending' ? 'background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);' : 'background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.3);' }}">
                                    {{ ucfirst($report->status) }}
                                </span>
                                <span style="font-size:12px;color:#475569;">{{ $report->created_at->diffForHumans() }}</span>
                            </div>

                            <p style="font-size:14px;color:#94a3b8;font-weight:600;margin-bottom:6px;">Reason: <span style="color:#e2e8f0;font-weight:400;">{{ $report->reason }}</span></p>

                            @if($report->quote)
                                <div style="background:var(--bg-input);border-radius:12px;padding:12px 14px;border-left:3px solid var(--brand);margin-bottom:10px;">
                                    <p style="font-size:14px;color:#94a3b8;font-family:'Playfair Display',serif;line-height:1.5;">"{{ Str::limit($report->quote->content, 120) }}"</p>
                                    <div style="font-size:12px;color:#475569;margin-top:6px;">by {{ $report->quote->author }} · posted by {{ '@' . ($report->quote->user->username ?? 'deleted') }}</div>
                                </div>
                                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                    <a href="{{ route('quotes.show', $report->quote) }}" target="_blank" class="btn-ghost" style="font-size:12px;padding:6px 12px;">View Quote ↗</a>
                                </div>
                            @endif
                        </div>

                        {{-- Actions --}}
                        @if($report->status === 'pending')
                            <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0;">
                                <form method="POST" action="{{ route('admin.reports.review', $report) }}">
                                    @csrf
                                    <input type="hidden" name="action" value="approve">
                                    <button type="submit" class="btn-ghost" style="font-size:13px;padding:8px 16px;border-color:rgba(16,185,129,0.4);color:#34d399;width:100%;">✓ Dismiss</button>
                                </form>
                                <form method="POST" action="{{ route('admin.reports.review', $report) }}">
                                    @csrf
                                    <input type="hidden" name="action" value="remove">
                                    <button type="submit" class="btn-ghost" style="font-size:13px;padding:8px 16px;border-color:rgba(239,68,68,0.4);color:#f87171;width:100%;" onclick="return confirm('Remove this quote?')">🗑️ Remove Quote</button>
                                </form>
                                <form method="POST" action="{{ route('admin.reports.review', $report) }}">
                                    @csrf
                                    <input type="hidden" name="action" value="warn">
                                    <button type="submit" class="btn-ghost" style="font-size:13px;padding:8px 16px;border-color:rgba(245,158,11,0.4);color:#f59e0b;width:100%;">⚠️ Warn User</button>
                                </form>
                            </div>
                        @endif
                    </div>
                </div>
            @empty
                <x-empty-state icon="✅" title="No pending reports!" message="The community is behaving. 🎉" />
            @endforelse
        </div>

        @if($reports->hasPages())
            <div class="mt-8 flex justify-center">{{ $reports->links() }}</div>
        @endif

    </div>
</div>
@endsection