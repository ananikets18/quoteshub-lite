@props([
    'icon'       => '📭',
    'title'      => 'Nothing here',
    'message'    => '',
    'actionText' => null,
    'actionUrl'  => null,
])

<div class="empty-state">
    <div class="empty-state-icon">{{ $icon }}</div>
    <div class="empty-state-title">{{ $title }}</div>
    @if($message)
        <div class="empty-state-msg">{{ $message }}</div>
    @endif
    @if($actionText && $actionUrl)
        <a href="{{ $actionUrl }}" class="btn-brand mt-4" style="font-size:14px; padding:10px 24px;">
            {{ $actionText }}
        </a>
    @endif
</div>
