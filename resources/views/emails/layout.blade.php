<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'QuotesHub' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1F2937;
            background-color: #F9FAFB;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .email-logo {
            font-size: 32px;
            font-weight: 800;
            color: #FFFFFF;
            text-decoration: none;
            letter-spacing: -0.5px;
        }
        
        .email-tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 8px;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .email-greeting {
            font-size: 24px;
            font-weight: 700;
            color: #1F2937;
            margin-bottom: 20px;
        }
        
        .email-content {
            font-size: 16px;
            color: #4B5563;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        
        .email-content p {
            margin-bottom: 16px;
        }
        
        .email-button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .email-button:hover {
            transform: translateY(-2px);
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .quote-card {
            background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
            border-left: 4px solid #8B5CF6;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
        }
        
        .quote-text {
            font-size: 18px;
            font-style: italic;
            color: #1F2937;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        
        .quote-author {
            font-size: 14px;
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .email-footer {
            background-color: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6B7280;
            margin-bottom: 16px;
        }
        
        .footer-links {
            margin: 16px 0;
        }
        
        .footer-link {
            color: #8B5CF6;
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #6B7280;
            text-decoration: none;
        }
        
        .divider {
            height: 1px;
            background-color: #E5E7EB;
            margin: 24px 0;
        }
        
        .info-box {
            background-color: #EFF6FF;
            border-left: 4px solid #3B82F6;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .info-box p {
            color: #1E40AF;
            font-size: 14px;
            margin: 0;
        }
        
        .warning-box {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .warning-box p {
            color: #92400E;
            font-size: 14px;
            margin: 0;
        }
        
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .email-footer {
                padding: 20px;
            }
            
            .email-greeting {
                font-size: 20px;
            }
            
            .email-content {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <a href="{{ config('app.url') }}" class="email-logo">QuotesHub</a>
            <div class="email-tagline">Discover & Share Inspiring Quotes</div>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            @yield('content')
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <p class="footer-text">
                You're receiving this email because you have an account with QuotesHub.
            </p>
            
            <div class="footer-links">
                <a href="{{ config('app.url') }}" class="footer-link">Visit QuotesHub</a>
                <a href="{{ config('app.url') }}/profile/notification-preferences" class="footer-link">Email Preferences</a>
                <a href="{{ config('app.url') }}/help" class="footer-link">Help Center</a>
            </div>
            
            <div class="divider"></div>
            
            <p class="footer-text" style="font-size: 12px; color: #9CA3AF;">
                © {{ date('Y') }} QuotesHub. All rights reserved.<br>
                Made with ❤️ for quote lovers everywhere.
            </p>
        </div>
    </div>
</body>
</html>
