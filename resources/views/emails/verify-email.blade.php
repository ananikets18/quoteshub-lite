@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">Hello, {{ $user->name }}! 👋</h1>
    
    <div class="email-content">
        <p>Thank you for signing up with QuotesHub! We're excited to have you join our community of quote enthusiasts.</p>
        
        <p>To get started, please verify your email address by clicking the button below:</p>
    </div>
    
    <div class="button-container">
        <a href="{{ $verificationUrl }}" class="email-button">
            Verify Email Address
        </a>
    </div>
    
    <div class="email-content">
        <p>This link will expire in 60 minutes for security reasons.</p>
    </div>
    
    <div class="info-box">
        <p><strong>🔒 Security Tip:</strong> If you didn't create an account with QuotesHub, no further action is required.</p>
    </div>
    
    <div class="email-content">
        <p>Once verified, you'll be able to:</p>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
            <li style="margin-bottom: 8px;">📚 Discover thousands of inspiring quotes</li>
            <li style="margin-bottom: 8px;">❤️ Like and save your favorite quotes</li>
            <li style="margin-bottom: 8px;">✍️ Share your own wisdom</li>
            <li style="margin-bottom: 8px;">📁 Create custom collections</li>
            <li style="margin-bottom: 8px;">👥 Connect with other quote lovers</li>
        </ul>
    </div>
    
    <div class="divider"></div>
    
    <div class="email-content" style="font-size: 14px; color: #6B7280;">
        <p><strong>Having trouble clicking the button?</strong></p>
        <p>Copy and paste the following URL into your web browser:</p>
        <p style="word-break: break-all; background-color: #F3F4F6; padding: 12px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 12px;">
            {{ $verificationUrl }}
        </p>
    </div>
    
    <div class="email-content">
        <p>Welcome aboard! 🎉</p>
        
        <p style="margin-top: 24px;">
            <strong>The QuotesHub Team</strong><br>
            <span style="color: #8B5CF6; font-size: 14px;">Discover & Share Inspiring Quotes</span>
        </p>
    </div>
@endsection
