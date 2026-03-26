@extends('layouts.app')

@section('title', 'Notifications — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 680px;" x-data="notificationsPage()">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
                <h1 class="page-title">🔔 Notifications</h1>
                <p class="page-subtitle">Stay updated with your activity</p>
            </div>
            <button @click="markAllRead()" x-show="hasUnread" class="btn-ghost" style="font-size:13px;padding:8px 16px;">
                <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Mark all read
            </button>
        </div>

        {{-- Loading state --}}
        <div x-show="loading" class="flex flex-col gap-3">
            @for($i = 0; $i < 5; $i++)
                <div class="panel-card" style="padding:16px;display:flex;align-items:center;gap:12px;">
                    <div style="width:44px;height:44px;border-radius:12px;background:var(--border-subtle);flex-shrink:0;" class="animate-pulse"></div>
                    <div style="flex:1;">
                        <div style="height:14px;border-radius:6px;background:var(--border-subtle);width:70%;margin-bottom:8px;" class="animate-pulse"></div>
                        <div style="height:11px;border-radius:6px;background:var(--border-subtle);width:40%;" class="animate-pulse"></div>
                    </div>
                </div>
            @endfor
        </div>

        {{-- Notifications list --}}
        <div x-show="!loading" class="flex flex-col gap-3 stagger">
            <template x-for="notif in notifications" :key="notif.id">
                <div
                    class="panel-card anim-fade-up"
                    :style="notif.read_at ? '' : 'border-color:var(--brand-border);background:rgba(141,52,233,0.04);'"
                    style="cursor:pointer;transition:all 0.2s ease;"
                    @click="handleClick(notif)"
                    onmouseover="this.style.transform='translateY(-1px)'"
                    onmouseout="this.style.transform=''"
                >
                    <div style="display:flex;align-items:flex-start;gap:12px;padding:16px;">
                        {{-- Icon --}}
                        <div :style="'width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;' + iconBg(notif.type)"
                             x-text="notifIcon(notif.type)"></div>

                        {{-- Content --}}
                        <div style="flex:1;min-width:0;">
                            <p style="font-size:14px;color:var(--text-primary, #e2e8f0);line-height:1.5;" x-text="notif.message || notif.data?.message || notif.data?.body || 'New notification'"></p>
                            <div style="display:flex;align-items:center;gap:10px;margin-top:6px;">
                                <span style="font-size:12px;color:#475569;" x-text="timeAgo(notif.created_at)"></span>
                                <span x-show="!notif.read_at" style="width:6px;height:6px;border-radius:50%;background:var(--brand);flex-shrink:0;"></span>
                            </div>
                        </div>

                        {{-- Delete --}}
                        <button @click.stop="deleteNotif(notif)" style="color:#475569;opacity:0.5;padding:4px;border:none;background:none;cursor:pointer;border-radius:6px;" onmouseover="this.style.opacity='1';this.style.color='#f87171'" onmouseout="this.style.opacity='0.5';this.style.color='#475569'">
                            <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
            </template>

            {{-- Empty state --}}
            <div x-show="!loading && notifications.length === 0" style="text-align:center;padding:60px 20px;">
                <div style="font-size:48px;margin-bottom:16px;">🔕</div>
                <h3 style="font-size:18px;font-weight:700;color:var(--text-primary, #e2e8f0);margin-bottom:8px;">You're all caught up!</h3>
                <p style="font-size:14px;color:#64748b;">No notifications right now. Go interact with some quotes!</p>
                <a href="{{ route('feed') }}" class="btn-brand" style="display:inline-flex;margin-top:20px;font-size:14px;">Browse Feed</a>
            </div>
        </div>

    </div>
</div>

@push('scripts')
<script>
function notificationsPage() {
    return {
        notifications: [],
        loading: true,
        hasUnread: false,

        async init() {
            await this.fetchNotifications();
        },

        async fetchNotifications() {
            this.loading = true;
            try {
                const res = await axios.get('/api/notifications');
                this.notifications = res.data.data || res.data;
                this.hasUnread = this.notifications.some(n => !n.read_at);
            } catch(e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        notifIcon(type) {
            const icons = {
                'new_follower': '👤',
                'quote_liked': '❤️',
                'quote_saved': '🔖',
                'achievement_unlocked': '🏆',
                'admin_warning': '⚠️',
                'quote_removed': '🗑️',
                'quote_featured': '⭐',
                'comment_added': '💬',
            };
            return icons[type] || '🔔';
        },

        iconBg(type) {
            const bgs = {
                'new_follower': 'background:rgba(59,130,246,0.15);',
                'quote_liked': 'background:rgba(244,63,94,0.15);',
                'quote_saved': 'background:rgba(245,158,11,0.15);',
                'achievement_unlocked': 'background:rgba(16,185,129,0.15);',
                'admin_warning': 'background:rgba(245,158,11,0.15);',
                'quote_removed': 'background:rgba(239,68,68,0.15);',
            };
            return bgs[type] || 'background:rgba(141,52,233,0.15);';
        },

        timeAgo(dateStr) {
            const diff = (Date.now() - new Date(dateStr)) / 1000;
            if (diff < 60) return 'Just now';
            if (diff < 3600) return Math.floor(diff/60) + 'm ago';
            if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
            return Math.floor(diff/86400) + 'd ago';
        },

        async handleClick(notif) {
            if (!notif.read_at) {
                notif.read_at = new Date().toISOString();
                this.hasUnread = this.notifications.some(n => !n.read_at);
                await axios.post(`/api/notifications/${notif.id}/read`);
            }
            if (notif.data?.url) window.location.href = notif.data.url;
        },

        async markAllRead() {
            await axios.post('/api/notifications/mark-all-read');
            this.notifications.forEach(n => n.read_at = new Date().toISOString());
            this.hasUnread = false;
        },

        async deleteNotif(notif) {
            await axios.delete(`/api/notifications/${notif.id}`);
            this.notifications = this.notifications.filter(n => n.id !== notif.id);
        },
    };
}
</script>
@endpush
@endsection