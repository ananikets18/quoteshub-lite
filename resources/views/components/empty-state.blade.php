@props([
    'icon' => '📭',
    'title' => 'No items found',
    'message' => 'There are no items to display.',
    'actionText' => null,
    'actionUrl' => null
])

<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="text-6xl mb-4">{{ $icon }}</div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $title }}</h3>
    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{{ $message }}</p>
    
    @if($actionText && $actionUrl)
        <a href="{{ $actionUrl }}" class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
            {{ $actionText }}
        </a>
    @endif
</div>
