@extends('layouts.app')

@section('title', 'Feed - QuotesHub')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Sidebar - Categories -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Categories Card -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span class="mr-2">📚</span>
                        Categories
                    </h3>
                    <div class="space-y-2">
                        @foreach($categories as $category)
                            <a href="{{ route('category.show', $category->slug) }}" 
                               class="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors">
                                <span>{{ $category->icon ?? '•' }} {{ $category->name }}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">{{ $category->quotes_count }}</span>
                            </a>
                        @endforeach
                    </div>
                </div>
                
                <!-- Trending Users -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span class="mr-2">🔥</span>
                        Trending Users
                    </h3>
                    <div class="space-y-3">
                        @foreach($suggestedUsers ?? [] as $user)
                            <div class="flex items-center justify-between">
                                <a href="{{ route('profile.show', $user->username) }}" class="flex items-center space-x-2 flex-1 min-w-0">
                                    <img src="{{ $user->avatar ?? '/images/default-avatar.png' }}" 
                                         alt="{{ $user->name }}" 
                                         class="w-8 h-8 rounded-full">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ $user->name }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ $user->quotes_count ?? 0 }} quotes</p>
                                    </div>
                                </a>
                                @auth
                                    <div x-data="followButton('{{ $user->username }}', {{ $user->is_following ?? 'false' }})">
                                        <button 
                                            @click="toggle()"
                                            :disabled="loading"
                                            :class="buttonClass"
                                            class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                                            x-text="buttonText"
                                        ></button>
                                    </div>
                                @endauth
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Main Feed -->
            <div class="lg:col-span-3">
                @if(session('success'))
                    <div class="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                        <p class="text-sm text-green-800 dark:text-green-200">{{ session('success') }}</p>
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                        <p class="text-sm text-red-800 dark:text-red-200">{{ session('error') }}</p>
                    </div>
                @endif

                <!-- Feed Header -->
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Your Feed</h1>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">Discover inspiring quotes from the community</p>
                </div>

                <!-- Quotes Feed -->
                <div class="space-y-6">
                    @forelse($quotes as $quote)
                        <x-quote-card :quote="$quote" />
                    @empty
                        <x-empty-state 
                            icon="📭"
                            title="No quotes yet"
                            message="Be the first to share an inspiring quote with the community!"
                            actionText="Create Your First Quote"
                            actionUrl="{{ route('quotes.create') }}"
                        />
                    @endforelse
                </div>

                <!-- Pagination -->
                @if($quotes->hasPages())
                    <div class="mt-8">
                        {{ $quotes->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
