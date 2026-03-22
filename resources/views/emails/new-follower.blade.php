@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">You have a new follower! 🎉</h1>

    <div class="email-content">
        <p>
            <strong>{{ $follower->name }}</strong>
            (@{{ $follower->username }}) started following you on QuotesHub.
        </p>
        <p>Your community is growing — keep sharing your wisdom!</p>
    </div>

    <div class="quote-card" style="text-align:center;">
        <div style="font-size:40px; margin-bottom:8px;">👤</div>
        <p class="quote-author" style="font-size:18px; font-weight:700;">{{ $follower->name }}</p>
        <p style="font-size:14px; color:#6B7280; margin-top:4px;">@{{ $follower->username }}</p>
        @if($follower->bio)
            <p style="font-size:14px; color:#4B5563; margin-top:8px; font-style:italic;">"{{ $follower->bio }}"</p>
        @endif
    </div>

    <div class="button-container">
        <a href="{{ config('app.url') }}/{{ $follower->username }}" class="email-button">
            View Their Profile
        </a>
    </div>

    <div class="info-box">
        <p>💡 <strong>Tip:</strong> Check out their quotes and follow them back if you enjoy their content!</p>
    </div>

    <div class="email-content">
        <p>Keep inspiring the world! ✨</p>
        <p style="margin-top: 24px;"><strong>The QuotesHub Team</strong></p>
    </div>
@endsection
