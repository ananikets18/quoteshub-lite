@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">Reset Your Password</h1>
    
    <div class="email-content">
        <p>Hi {{ $user->name ?? 'there' }},</p>
        
        <p>We received a request to reset your password for your QuotesHub account. If you didn't make this request, you can safely ignore this email.</p>
    </div>
    
    <div class="button-container">
        <a href="{{ $resetUrl }}" class="email-button">
            Reset Password
        </a>
    </div>
    
    <div class="email-content">
        <p style="font-size: 14px; color: #6B7280;">
            Or copy and paste this link into your browser:<br>
            <a href="{{ $resetUrl }}" style="color: #8B5CF6; word-break: break-all;">{{ $resetUrl }}</a>
        </p>
    </div>
    
    <div class="warning-box">
        <p><strong>⚠️ Security Notice:</strong> This password reset link will expire in {{ config('auth.passwords.users.expire') }} minutes. If you didn't request this reset, please secure your account immediately.</p>
    </div>
    
    <div class="email-content">
        <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
        
        <p style="margin-top: 24px;">
            <strong>Stay secure,</strong><br>
            The QuotesHub Team
        </p>
    </div>
@endsection
