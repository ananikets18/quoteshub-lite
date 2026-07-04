@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">Welcome to QuotesHub, {{ $user->name }}! 🎉</h1>
    
    <div class="email-content">
        <p>We're thrilled to have you join our community of quote enthusiasts!</p>
        
        <p>QuotesHub is your go-to platform for discovering, sharing, and saving inspiring quotes from great minds around the world. Whether you're looking for motivation, wisdom, or just a daily dose of inspiration, we've got you covered.</p>
    </div>
    
    <div class="quote-card">
        <p class="quote-text">"The journey of a thousand miles begins with one step."</p>
        <p class="quote-author">— Lao Tzu</p>
    </div>
    
    <div class="email-content">
        <p><strong>Here's what you can do on QuotesHub:</strong></p>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
            <li style="margin-bottom: 8px;">📚 Discover thousands of inspiring quotes</li>
            <li style="margin-bottom: 8px;">❤️ Like and save your favorite quotes</li>
            <li style="margin-bottom: 8px;">✍️ Share your own wisdom with the community</li>
            <li style="margin-bottom: 8px;">📁 Organize quotes into custom collections</li>
            <li style="margin-bottom: 8px;">🎨 Download beautiful quote images to share</li>
            <li style="margin-bottom: 8px;">👥 Follow other quote lovers</li>
        </ul>
    </div>
    
    <div class="button-container">
        <a href="{{ config('app.url') }}/feed" class="email-button">
            Start Exploring Quotes
        </a>
    </div>
    
    <div class="info-box">
        <p><strong>💡 Pro Tip:</strong> Complete your profile and start following topics you love to get personalized quote recommendations!</p>
    </div>
    
    <div class="email-content">
        <p>If you have any questions or need help getting started, feel free to reach out to our support team. We're here to help!</p>
        
        <p>Happy quoting! ✨</p>
        
        <p style="margin-top: 24px;">
            <strong>The QuotesHub Team</strong>
        </p>
    </div>
@endsection
