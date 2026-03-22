@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">Achievement Unlocked! 🏆</h1>

    <div class="email-content">
        <p>Congratulations <strong>{{ $user->name }}</strong>! You've just unlocked a new achievement on QuotesHub.</p>
    </div>

    <div class="quote-card" style="text-align:center;">
        <div style="font-size:48px; margin-bottom:12px;">🏆</div>
        <p style="font-size:20px; font-weight:800; color:#1F2937; margin-bottom:8px;">{{ $achievementName }}</p>
        <p style="font-size:15px; color:#6B7280;">{{ $achievementDescription }}</p>
    </div>

    <div class="button-container">
        <a href="{{ config('app.url') }}/achievements" class="email-button">
            View Your Achievements
        </a>
    </div>

    <div class="info-box">
        <p>🎯 <strong>Keep going!</strong> There are more achievements waiting for you. Check your profile to see what's next.</p>
    </div>

    <div class="email-content">
        <p>You're on a roll! ✨</p>
        <p style="margin-top: 24px;"><strong>The QuotesHub Team</strong></p>
    </div>
@endsection
