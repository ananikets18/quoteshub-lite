<nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Logo & Primary Navigation -->
            <div class="flex items-center">
                <!-- Logo -->
                <a href="{{ route('home') }}" class="flex-shrink-0 flex items-center space-x-2">
                    <span class="text-3xl">💬</span>
                    <span class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        QuotesHub
                    </span>
                </a>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:ml-10 md:flex md:items-center md:space-x-6">
                    <a href="{{ route('feed') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors {{ request()->routeIs('feed') ? 'text-purple-600 dark:text-purple-400' : '' }}">
                        Feed
                    </a>
                    <a href="{{ route('topics.index') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors {{ request()->routeIs('topics.index') ? 'text-purple-600 dark:text-purple-400' : '' }}">
                        Explore
                    </a>
                    <a href="{{ route('search') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors {{ request()->routeIs('search') ? 'text-purple-600 dark:text-purple-400' : '' }}">
                        Search
                    </a>
                </div>
            </div>
            
            <!-- Right Side -->
            <div class="flex items-center space-x-4">
                <!-- Search (Desktop) -->
                <div class="hidden md:block" x-data="searchBar()">
                    <div class="relative">
                        <input 
                            type="text" 
                            x-model="query"
                            @input="onInput"
                            x-ref="searchInput"
                            placeholder="Search quotes... (⌘K)"
                            class="w-64 px-4 py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <!-- Search Results Dropdown -->
                        <div 
                            x-show="isOpen && results.length > 0"
                            @click.away="close()"
                            x-transition
                            class="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
                        >
                            <template x-for="result in results" :key="result.id">
                                <div 
                                    @click="selectResult(result)"
                                    class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                    <div class="text-sm font-medium text-gray-900 dark:text-white" x-html="highlightMatch(result.title, query)"></div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" x-text="result.type"></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                
                <!-- Theme Toggle -->
                <button 
                    @click="window.toggleTheme()"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Toggle dark mode"
                >
                    <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
                
                @auth
                    <!-- Create Quote Button -->
                    <a href="{{ route('quotes.create') }}" class="hidden md:inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create
                    </a>
                    
                    <!-- Notifications -->
                    <div x-data="notificationSystem()" x-init="init()" @click.away="close()" class="relative">
                        <button 
                            @click="toggle()"
                            class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span 
                                x-show="unreadCount > 0"
                                x-text="unreadCount"
                                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                            ></span>
                        </button>
                        
                        <!-- Notifications Dropdown -->
                        <div 
                            x-show="isOpen"
                            x-transition
                            class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                <button @click="markAllAsRead()" class="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400">
                                    Mark all read
                                </button>
                            </div>
                            
                            <div class="max-h-96 overflow-y-auto">
                                <template x-if="notifications.length === 0">
                                    <div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        No notifications yet
                                    </div>
                                </template>
                                
                                <template x-for="notification in notifications" :key="notification.id">
                                    <div 
                                        @click="goToNotification(notification)"
                                        :class="notification.read_at ? 'bg-white dark:bg-gray-800' : 'bg-purple-50 dark:bg-gray-700/50'"
                                        class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                    >
                                        <div class="flex items-start space-x-3">
                                            <img 
                                                :src="notification.actor?.avatar || '/images/default-avatar.png'" 
                                                :alt="notification.actor?.name"
                                                class="w-10 h-10 rounded-full"
                                            >
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm text-gray-900 dark:text-white" x-html="notification.data.message"></p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400  mt-1" x-text="new Date(notification.created_at).toLocaleDateString()"></p>
                                            </div>
                                            <button 
                                                @click.stop="deleteNotification(notification.id)"
                                                class="flex-shrink-0 text-gray-400 hover:text-red-500"
                                            >
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            
                            <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                <a href="{{ route('notifications') }}" class="block text-center text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium">
                                    View all notifications
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Menu -->
                    <div x-data="userMenu()" @click.away="close()" class="relative">
                        <button @click="toggle()" class="flex items-center space-x-2 focus:outline-none">
                            <img 
                                src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}" 
                                alt="{{ auth()->user()->name }}"
                                class="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-purple-500 transition-colors"
                            >
                        </button>
                        
                        <div 
                            x-show="open"
                            x-transition
                            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1"
                        >
                            <a href="{{ route('profile.show', auth()->user()->username) }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                                Profile
                            </a>
                            <a href="{{ route('dashboard') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                                Dashboard
                            </a>
                            <a href="{{ route('saved') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                                Saved Quotes
                            </a>
                            <a href="{{ route('settings') }}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                                Settings
                            </a>
                            @if(auth()->user()->is_admin)
                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700">
                                    Admin Panel
                                </a>
                            @endif
                            <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                @else
                    <!-- Guest Links -->
                    <a href="{{ route('login') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors">
                        Login
                    </a>
                    <a href="{{ route('register') }}" class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Sign Up
                    </a>
                @endauth
                
                <!-- Mobile Menu Button -->
                <button 
                    @click="$dispatch('toggle-mobile-menu')"
                    class="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Mobile Menu -->
    <div 
        x-data="mobileMenu()" 
        @toggle-mobile-menu.window="toggle()"
        x-show="open"
        x-transition
        class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
        <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="{{ route('feed') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                Feed
            </a>
            <a href="{{ route('topics.index') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                Explore
            </a>
            <a href="{{ route('search') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                Search
            </a>
            @auth
                <a href="{{ route('quotes.create') }}" class="block px-3 py-2 rounded-md text-base font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700">
                    Create Quote
                </a>
            @endauth
        </div>
    </div>
</nav>
