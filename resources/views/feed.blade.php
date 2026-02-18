@extends('layouts.app')

@section('title', 'Feed - QuotesHub')

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="{{ route('home') }}" class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            QuotesHub
                        </a>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    @auth
                        <a href="{{ route('quotes.create') }}" class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md">
                            Create Quote
                        </a>
                        <a href="{{ route('dashboard') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">
                            Dashboard
                        </a>
                        <a href="{{ route('profile.show', auth()->user()->username) }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">
                            Profile
                        </a>
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">
                                Logout
                            </button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">
                            Login
                        </a>
                        <a href="{{ route('register') }}" class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md">
                            Sign Up
                        </a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Sidebar - Categories -->
            <div class="lg:col-span-1">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                    <div class="space-y-2">
                        @foreach($categories as $category)
                            <a href="{{ route('category.show', $category->slug) }}" 
                               class="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
                                {{ $category->name }} ({{ $category->quotes_count }})
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Main Feed -->
            <div class="lg:col-span-3">
                @if(session('success'))
                    <div class="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                        <p class="text-sm text-green-800 dark:text-green-200">{{ session('success') }}</p>
                    </div>
                @endif

                <div class="space-y-6">
                    @forelse($quotes as $quote)
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="text-lg text-gray-900 dark:text-white font-serif italic">
                                        "{{ $quote->content }}"
                                    </p>
                                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        — {{ $quote->author }}
                                        @if($quote->source)
                                            , <span class="text-gray-500">{{ $quote->source }}</span>
                                        @endif
                                    </p>
                                </div>
                            </div>

                            <!-- Quote Actions -->
                            <div class="mt-4 flex items-center space-x-4 text-sm">
                                <form method="POST" action="{{ route('quotes.like', $quote) }}" class="inline">
                                    @csrf
                                    <button type="submit" class="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-purple-600">
                                        <span>❤️</span>
                                        <span>{{ $quote->likes_count ?? 0 }}</span>
                                    </button>
                                </form>

                                <form method="POST" action="{{ route('quotes.save', $quote) }}" class="inline">
                                    @csrf
                                    <button type="submit" class="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-purple-600">
                                        <span>🔖</span>
                                        <span>{{ $quote->saves_count ?? 0 }}</span>
                                    </button>
                                </form>

                                <a href="{{ route('quotes.show', $quote) }}" class="text-gray-600 dark:text-gray-400 hover:text-purple-600">
                                    View Details
                                </a>

                                <span class="text-gray-500 dark:text-gray-500">
                                    by <a href="{{ route('profile.show', $quote->user->username) }}" class="hover:text-purple-600">{{ $quote->user->name }}</a>
                                </span>
                            </div>

                            <!-- Categories -->
                            @if($quote->categories->count() > 0)
                                <div class="mt-3 flex flex-wrap gap-2">
                                    @foreach($quote->categories as $category)
                                        <a href="{{ route('category.show', $category->slug) }}" 
                                           class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                            {{ $category->name }}
                                        </a>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    @empty
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                            <p class="text-gray-500 dark:text-gray-400">No quotes found. Be the first to share!</p>
                            @auth
                                <a href="{{ route('quotes.create') }}" class="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md">
                                    Create Your First Quote
                                </a>
                            @endauth
                        </div>
                    @endforelse
                </div>

                <!-- Pagination -->
                @if($quotes->hasPages())
                    <div class="mt-6">
                        {{ $quotes->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
