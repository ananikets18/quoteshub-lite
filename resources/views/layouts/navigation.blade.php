{{-- ============================================================
     APP NAVIGATION — Desktop Sidebar + Mobile Top/Bottom Bar
     ============================================================ --}}

{{-- ---- DESKTOP LEFT SIDEBAR ---- --}}
<aside class="app-sidebar" id="app-sidebar">
    {{-- Logo --}}
    <a href="{{ route('home') }}" class="sidebar-logo">
        <div style="width:38px;height:38px;border-radius:12px;background:#8D34E9;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 16px rgba(141,52,233,0.4);">💬</div>
        <span style="font-size:18px;font-weight:800;color:#8D34E9;letter-spacing:-0.5px;">QuotesHub</span>
    </a>

    {{-- Main nav --}}
    <nav class="sidebar-nav">
        <a href="{{ route('feed') }}"
           class="sidebar-item {{ request()->routeIs('feed', 'home') ? 'active' : '' }}">
            <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="sidebar-label">Home</span>
        </a>

        <a href="{{ route('topics.index') }}"
           class="sidebar-item {{ request()->routeIs('topics.index') ? 'active' : '' }}">
            <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span class="sidebar-label">Explore</span>
        </a>

        <a href="{{ route('search') }}"
           class="sidebar-item {{ request()->routeIs('search') ? 'active' : '' }}">
            <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="sidebar-label">Search</span>
        </a>

        @auth
            <a href="{{ route('notifications') }}"
               class="sidebar-item {{ request()->routeIs('notifications') ? 'active' : '' }}"
               x-data="notificationBadge()" x-init="init()">
                <span class="relative">
                    <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span x-show="count > 0" class="badge-dot"></span>
                </span>
                <span class="sidebar-label">Notifications</span>
                <span x-show="count > 0" x-text="count > 9 ? '9+' : count" class="sidebar-badge"></span>
            </a>

            <div class="sidebar-divider"></div>

            <a href="{{ route('quotes.create') }}"
               class="sidebar-item {{ request()->routeIs('quotes.create') ? 'active' : '' }}"
               style="background: rgba(141,52,233,0.15); color: #8D34E9;">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="sidebar-label">Create Quote</span>
            </a>

            <div class="sidebar-divider"></div>

            <span class="sidebar-section-label">You</span>

            <a href="{{ route('dashboard') }}"
               class="sidebar-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span class="sidebar-label">Dashboard</span>
            </a>

            <a href="{{ route('profile.show', auth()->user()->username) }}"
               class="sidebar-item {{ request()->routeIs('profile.show') && request()->route('username') === auth()->user()->username ? 'active' : '' }}">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="sidebar-label">Profile</span>
            </a>

            <a href="{{ route('saved') }}"
               class="sidebar-item {{ request()->routeIs('saved') ? 'active' : '' }}">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                <span class="sidebar-label">Saved</span>
            </a>

            <a href="{{ route('achievements') }}"
               class="sidebar-item {{ request()->routeIs('achievements') ? 'active' : '' }}">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span class="sidebar-label">Achievements</span>
            </a>

            <a href="{{ route('settings') }}"
               class="sidebar-item {{ request()->routeIs('settings') ? 'active' : '' }}">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="sidebar-label">Settings</span>
            </a>

            @if(auth()->user()->is_admin)
                <div class="sidebar-divider"></div>
                <a href="{{ route('admin.dashboard') }}"
                   class="sidebar-item {{ request()->routeIs('admin.*') ? 'active' : '' }}"
                   style="color: #f59e0b;">
                    <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <span class="sidebar-label">Admin Panel</span>
                </a>
            @endif
        @else
            <div class="sidebar-divider"></div>
            <a href="{{ route('login') }}" class="sidebar-item">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                <span class="sidebar-label">Sign In</span>
            </a>
            <a href="{{ route('register') }}" class="sidebar-item" style="background: rgba(141,52,233,0.12); color: #8D34E9;">
                <svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span class="sidebar-label">Join Free</span>
            </a>
        @endauth
    </nav>

    {{-- Bottom: theme toggle + user --}}
    <div class="sidebar-footer">
        {{-- Theme Toggle --}}
        <button onclick="window.toggleTheme()" class="sidebar-item" style="margin-bottom:4px;" title="Toggle theme">
            <svg class="sidebar-icon dark:block hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg class="sidebar-icon dark:hidden block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <span class="sidebar-label dark:block hidden">Light Mode</span>
            <span class="sidebar-label dark:hidden block">Dark Mode</span>
        </button>

        @auth
            {{-- User card with dropdown --}}
            <div x-data="userMenu()" @click.away="close()" class="relative">
                <div class="sidebar-user-card" @click="toggle()">
                    <img src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}"
                         alt="{{ auth()->user()->name }}"
                         class="sidebar-user-avatar">
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">{{ auth()->user()->name }}</div>
                        <div class="sidebar-user-handle">{{ '@' . auth()->user()->username }}</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                    </svg>
                </div>

                <div x-show="open" x-transition x-cloak
                     class="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden"
                     style="background: var(--bg-elevated); border: 1px solid var(--border-muted); box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                    <a href="{{ route('profile.show', auth()->user()->username) }}"
                       class="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        View Profile
                    </a>
                    <a href="{{ route('collections.index') }}"
                       class="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        Collections
                    </a>
                    <div style="height:1px; background: var(--border-subtle); margin: 4px 0;"></div>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit"
                                class="flex items-center gap-3 px-4 py-3 text-sm w-full text-left text-red-400 hover:bg-red-500/10 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        @endauth
    </div>
</aside>

{{-- ============================================================
     MOBILE TOP BAR
     ============================================================ --}}
<header class="app-topbar" id="app-topbar">
    {{-- Mobile Top Bar Logo --}}
    <a href="{{ route('home') }}" class="flex items-center gap-2 flex-shrink-0">
        <div style="width:32px;height:32px;border-radius:10px;background:#8D34E9;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 4px 12px rgba(141,52,233,0.4);">💬</div>
        <span style="font-size:16px;font-weight:800;color:#8D34E9;">QuotesHub</span>
    </a>

    {{-- Search bar --}}
    <div class="search-bar" style="max-width:200px;" x-data="searchBar()">
        <svg class="search-bar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" x-model="query" @input="onInput" placeholder="Search..." x-ref="searchInput">
        <div x-show="isOpen && results.length > 0" @click.away="close()" x-transition
             class="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
             style="background: var(--bg-elevated); border: 1px solid var(--border-muted); box-shadow: 0 16px 48px rgba(0,0,0,0.5);">
            <template x-for="result in results" :key="result.id">
                <div @click="selectResult(result)"
                     class="px-4 py-3 cursor-pointer border-b last:border-b-0 hover:opacity-80 transition-opacity"
                     style="border-color: var(--border-subtle);">
                    <div class="text-sm font-medium text-slate-200" x-html="highlightMatch(result.title, query)"></div>
                    <div class="text-xs mt-0.5" style="color:#64748b;" x-text="result.type"></div>
                </div>
            </template>
        </div>
    </div>

    {{-- Right side icons --}}
    <div class="flex items-center gap-1">
        {{-- Theme --}}
        <button onclick="window.toggleTheme()"
                class="p-2 rounded-xl transition-colors hover:opacity-80"
                style="color:#64748b;">
            <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
        </button>

        @auth
            {{-- Notifications icon --}}
            <a href="{{ route('notifications') }}" class="relative p-2 rounded-xl" style="color:#64748b;">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                {{-- badge via JS if needed --}}
            </a>

            {{-- Avatar --}}
            <a href="{{ route('profile.show', auth()->user()->username) }}" class="flex-shrink-0">
                <img src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}"
                     alt="{{ auth()->user()->name }}"
                     style="width:32px;height:32px;border-radius:10px;object-fit:cover;border:2px solid rgba(141,52,233,0.5);">
            </a>
        @else
            <a href="{{ route('register') }}"
               style="padding:7px 14px;border-radius:10px;font-size:13px;font-weight:600;background:#8D34E9;color:white;text-decoration:none;">
                Sign In
            </a>
        @endauth
    </div>
</header>

{{-- ============================================================
     MOBILE BOTTOM NAV
     ============================================================ --}}
<nav class="bottom-nav" id="bottom-nav">
    <a href="{{ route('feed') }}"
       class="bottom-nav-item {{ request()->routeIs('feed', 'home') ? 'active' : '' }}">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span class="bottom-nav-label">Home</span>
    </a>

    <a href="{{ route('topics.index') }}"
       class="bottom-nav-item {{ request()->routeIs('topics.index') ? 'active' : '' }}">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <span class="bottom-nav-label">Explore</span>
    </a>

    {{-- Create (center) --}}
    @auth
        <a href="{{ route('quotes.create') }}" class="bottom-nav-create">
            <svg style="width:22px;height:22px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
        </a>
    @else
        <a href="{{ route('register') }}" class="bottom-nav-create">
            <svg style="width:22px;height:22px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
        </a>
    @endauth

    <a href="{{ route('search') }}"
       class="bottom-nav-item {{ request()->routeIs('search') ? 'active' : '' }}">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <span class="bottom-nav-label">Search</span>
    </a>

    @auth
        <a href="{{ route('profile.show', auth()->user()->username) }}"
           class="bottom-nav-item {{ request()->routeIs('profile.show') && request()->route('username') === auth()->user()->username ? 'active' : '' }}">
            <img src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}"
                 alt="{{ auth()->user()->name }}"
                 style="width:26px;height:26px;border-radius:8px;object-fit:cover;border:2px solid {{ (request()->routeIs('profile.show') && request()->route('username') === auth()->user()->username) ? '#8D34E9' : 'rgba(100,116,139,0.4)' }};">
            <span class="bottom-nav-label">Profile</span>
        </a>
    @else
        <a href="{{ route('login') }}"
           class="bottom-nav-item {{ request()->routeIs('login') ? 'active' : '' }}">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span class="bottom-nav-label">Sign In</span>
        </a>
    @endauth
</nav>

{{-- ============================================================
     ALPINE DATA: notificationBadge for sidebar
     ============================================================ --}}
@push('scripts')
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('notificationBadge', () => ({
            count: 0,
            async init() {
                try {
                    const res = await fetch('/api/notifications/unread-count', {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        this.count = data.count || 0;
                    }
                } catch(e) {}
            }
        }));
    });
</script>
@endpush
