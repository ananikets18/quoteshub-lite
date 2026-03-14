@extends('layouts.app')

@section('title', 'Admin — User Management — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 1000px;">

        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
                <h1 class="page-title">👥 User Management</h1>
                <p class="page-subtitle">{{ $users->total() }} registered users</p>
            </div>
            <div style="display:flex;gap:8px;">
                <a href="{{ route('admin.dashboard') }}" class="btn-ghost" style="font-size:13px;padding:8px 14px;">← Dashboard</a>
            </div>
        </div>

        {{-- Search --}}
        <form method="GET" style="margin-bottom:20px;">
            <div style="position:relative;">
                <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#64748b;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by name, username or email..."
                       style="width:100%;padding:12px 16px 12px 40px;background:var(--bg-elevated);border:1px solid var(--border-muted);border-radius:14px;font-size:14px;color:#e2e8f0;outline:none;"
                       onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
            </div>
        </form>

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        {{-- Users table --}}
        <div class="panel-card anim-fade-up" style="overflow:hidden;">
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border-subtle);">
                            @foreach(['User', 'Email', 'Role', 'Status', 'Quotes', 'Joined', 'Actions'] as $col)
                                <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">{{ $col }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($users as $u)
                            <tr style="border-bottom:1px solid var(--border-subtle);transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background=''">
                                <td style="padding:12px 16px;">
                                    <div style="display:flex;align-items:center;gap:10px;">
                                        <img src="{{ $u->avatar ?? '/images/default-avatar.png' }}" style="width:34px;height:34px;border-radius:9px;object-fit:cover;flex-shrink:0;">
                                        <div>
                                            <div style="font-size:13px;font-weight:600;color:#e2e8f0;">{{ $u->name }}</div>
                                            <div style="font-size:11px;color:#64748b;">{{ '@' . $u->username }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding:12px 16px;font-size:13px;color:#94a3b8;">{{ $u->email }}</td>
                                <td style="padding:12px 16px;">
                                    <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;{{ $u->role === 'admin' ? 'background:rgba(141,52,233,0.2);color:#c084fc;border:1px solid var(--brand-border);' : 'background:var(--border-subtle);color:#64748b;' }}">{{ $u->role ?? 'user' }}</span>
                                </td>
                                <td style="padding:12px 16px;">
                                    <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;{{ $u->status === 'banned' ? 'background:rgba(239,68,68,0.15);color:#f87171;' : 'background:rgba(16,185,129,0.12);color:#34d399;' }}">{{ $u->status ?? 'active' }}</span>
                                </td>
                                <td style="padding:12px 16px;font-size:13px;color:#94a3b8;">{{ $u->quotes_count ?? 0 }}</td>
                                <td style="padding:12px 16px;font-size:12px;color:#64748b;white-space:nowrap;">{{ $u->created_at->format('M j, Y') }}</td>
                                <td style="padding:12px 16px;">
                                    <div style="display:flex;gap:6px;flex-wrap:wrap;" x-data="{ open: false }">
                                        <form method="POST" action="{{ route('admin.users.update', $u) }}">
                                            @csrf @method('PATCH')
                                            <input type="hidden" name="status" value="{{ $u->status === 'banned' ? 'active' : 'banned' }}">
                                            <button type="submit" style="font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid {{ $u->status === 'banned' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)' }};color:{{ $u->status === 'banned' ? '#34d399' : '#f87171' }};background:none;cursor:pointer;">
                                                {{ $u->status === 'banned' ? 'Unban' : 'Ban' }}
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('admin.users.delete', $u) }}" onsubmit="return confirm('Permanently delete {{ $u->name }}?');">
                                            @csrf @method('DELETE')
                                            <button type="submit" style="font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid rgba(239,68,68,0.3);color:#f87171;background:none;cursor:pointer;">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" style="padding:40px;text-align:center;color:#64748b;">No users found.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($users->hasPages())
            <div class="mt-8 flex justify-center">{{ $users->links() }}</div>
        @endif

    </div>
</div>
@endsection