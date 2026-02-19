@props([
    'quote',
    'showActions' => true,
    'showUser' => true,
    'size' => 'default'
])

<div 
    @if($showActions && auth()->check())
        x-data="quoteCard(@js($quote))"
    @endif
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 {{ $size === 'large' ? 'p-8' : '' }}"
>
    <!-- Quote Content -->
    <blockquote class="relative">
        <div class="text-5xl text-purple-300 dark:text-purple-600 absolute -top-2 -left-2 opacity-50 font-serif">"</div>
        <p class="{{ $size === 'large' ? 'text-2xl' : 'text-lg' }} text-gray-900 dark:text-white font-serif leading-relaxed pl-6 pr-4">
            {{ $quote->content }}
        </p>
        <div class="text-5xl text-purple-300 dark:text-purple-600 absolute -bottom-6 right-2 opacity-50 font-serif">"</div>
    </blockquote>
    
    <!-- Author & Source -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <p class="text-base font-medium text-gray-900 dark:text-white">
                    — {{ $quote->author }}
                </p>
                @if($quote->source)
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ $quote->source }}
                    </p>
                @endif
            </div>
            
            @if($showUser && $quote->user)
                <!-- User Avatar -->
                <a href="{{ route('profile.show', $quote->user->username) }}" class="flex-shrink-0 group">
                    <div class="flex items-center space-x-2">
                        <img 
                            src="{{ $quote->user->avatar ?? '/images/default-avatar.png' }}" 
                            alt="{{ $quote->user->name }}"
                            class="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-500 transition-colors"
                        >
                        <span class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors hidden sm:inline">
                            {{ $quote->user->username }}
                        </span>
                    </div>
                </a>
            @endif
        </div>
    </div>
    
    @if($showActions)
        <!-- Action Buttons -->
        <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-6">
                @auth
                    <!-- Like Button -->
                    <button 
                        @click="toggleLike"
                        :disabled="loading"
                        class="flex items-center space-x-2 transition-all duration-200 transform hover:scale-110"
                        :class="liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500 dark:text-gray-400'"
                    >
                        <svg class="w-6 h-6" :class="liked ? 'fill-current' : 'stroke-current fill-none'" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span x-text="likesCount" class="text-sm font-medium"></span>
                    </button>
                    
                    <!-- Save Button -->
                    <button 
                        @click="toggleSave"
                        :disabled="loading"
                        class="flex items-center space-x-2 transition-all duration-200 transform hover:scale-110"
                        :class="saved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400'"
                    >
                        <svg class="w-6 h-6" :class="saved ? 'fill-current' : 'stroke-current fill-none'" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span x-text="savesCount" class="text-sm font-medium"></span>
                    </button>
                @else
                    <!-- Guest View - Links to Login -->
                    <a href="{{ route('login') }}" class="flex items-center space-x-2 text-gray-500 hover:text-red-500 dark:text-gray-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span class="text-sm font-medium">{{ $quote->likes_count }}</span>
                    </a>
                    
                    <a href="{{ route('login') }}" class="flex items-center space-x-2 text-gray-500 hover:text-yellow-500 dark:text-gray-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span class="text-sm font-medium">{{ $quote->saves_count }}</span>
                    </a>
                @endauth
                
                <!-- Share Button -->
                @auth
                    <button 
                        @click="shareQuote"
                        class="flex items-center space-x-2 text-gray-500 hover:text-purple-500 dark:text-gray-400 transition-all duration-200 transform hover:scale-110"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                @else
                    <a href="{{ route('login') }}" class="flex items-center space-x-2 text-gray-500 hover:text-purple-500 dark:text-gray-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </a>
                @endauth
            </div>
            
            <!-- Categories -->
            @if($quote->categories && $quote->categories->count() > 0)
                <div class="flex items-center space-x-2">
                    @foreach($quote->categories->take(2) as $category)
                        <a href="{{ route('category.show', $category->slug) }}" 
                           class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                            {{ $category->name }}
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    @endif
</div>
