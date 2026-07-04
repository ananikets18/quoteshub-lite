@props(['size' => 'md'])

@php
    $sizeClasses = [
        'xs' => 'w-4 h-4',
        'sm' => 'w-5 h-5',
        'md' => 'w-8 h-8',
        'lg' => 'w-12 h-12',
        'xl' => 'w-16 h-16',
    ];
    $spinnerSize = $sizeClasses[$size] ?? $sizeClasses['md'];
@endphp

<div class="flex items-center justify-center">
    <div class="relative {{ $spinnerSize }}">
        <div class="absolute inset-0 border-4 border-purple-200 dark:border-gray-700 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
    </div>
</div>
