@extends('layouts.app')

@section('title', $quote->content . ' - QuotesHub')
@section('description', 'Quote by ' . $quote->author . ': ' . $quote->content)

@section('content')
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <a href="{{ url()->previous() }}" class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
        </a>

        <!-- Quote Card (Large) -->
        <x-quote-card :quote="$quote" size="large" />

        <!-- Additional Info -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Author Info -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Author</h3>
                <div class="space-y-2">
                    <p class="text-gray-700 dark:text-gray-300">
                        <span class="font-medium">Name:</span> {{ $quote->author }}
                    </p>
                    @if($quote->source)
                        <p class="text-gray-700 dark:text-gray-300">
                            <span class="font-medium">Source:</span> {{ $quote->source }}
                        </p>
                    @endif
                    <p class="text-gray-700 dark:text-gray-300">
                        <span class="font-medium">Shared by:</span> 
                        <a href="{{ route('profile.show', $quote->user->username) }}" class="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                            {{ $quote->user->name }}
                        </a>
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        <span class="font-medium">Date:</span>  {{ $quote->created_at->format('F j, Y') }}
                    </p>
                </div>
            </div>

            <!-- Stats -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Stats</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Likes</span>
                        <span class="text-2xl font-bold text-red-500">❤️ {{ $quote->likes_count }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Saves</span>
                        <span class="text-2xl font-bold text-yellow-500">💾 {{ $quote->saves_count }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600 dark:text-gray-400">Views</span>
                        <span class="text-2xl font-bold text-blue-500">👁️ {{ $quote->views_count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories & Tags -->
        @if($quote->categories->count() > 0 || $quote->tags)
            <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                @if($quote->categories->count() > 0)
                    <div class="mb-4">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
                        <div class="flex flex-wrap gap-2">
                            @foreach($quote->categories as $category)
                                <a href="{{ route('category.show', $category->slug) }}" 
                                   class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                                    {{ $category->name }}
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endif
                
                @if($quote->tags && is_array($quote->tags) && count($quote->tags) > 0)
                    <div>
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                        <div class="flex flex-wrap gap-2">
                            @foreach($quote->tags as $tag)
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    #{{ $tag }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        @endif

        <!-- Admin Actions -->
        @if(auth()->check() && (auth()->id() === $quote->user_id || auth()->user()->is_admin))
            <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
                <div class="flex flex-wrap gap-3">
                    @if(auth()->id() === $quote->user_id)
                        <a href="{{ route('quotes.edit', $quote) }}" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </a>
                    @endif
                    
                    @if(auth()->id() === $quote->user_id || auth()->user()->is_admin)
                        <form method="POST" action="{{ route('quotes.destroy', $quote) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this quote?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        @endif

        <!-- Related Quotes -->
        @if($relatedQuotes ?? false)
            <div class="mt-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Quotes</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    @foreach($relatedQuotes as $relatedQuote)
                        <x-quote-card :quote="$relatedQuote" />
                    @endforeach
                </div>
            </div>
        @endif
    </div>
</div>
@endsection