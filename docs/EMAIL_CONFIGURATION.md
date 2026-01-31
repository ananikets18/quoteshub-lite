# Email Configuration Guide - MVP

## Overview
QuotesHub has a simple, essential email system with beautiful, branded templates that match the website's purple gradient aesthetic.

## Email Templates Available (MVP)

### 1. Welcome Email (`emails.welcome`)
- Sent automatically when a new user registers
- Features: Welcome message, feature highlights, sample quote, CTA button
- Mailable: `App\Mail\WelcomeMail`

### 2. Password Reset (`emails.password-reset`)
- Sent when user requests password reset
- Features: Reset button, fallback link, security warning
- Notification: `App\Notifications\ResetPasswordNotification`

## SMTP Configuration

### Option 1: Gmail (Free, Easy Setup) - Recommended for MVP
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # Generate from Google Account settings
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@quoteshub.com"
MAIL_FROM_NAME="QuotesHub"
```

**Note:** You need to generate an App Password from your Google Account:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password for "Mail"
4. Use that password in `.env`

### Option 2: Mailtrap (Development/Testing)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@quoteshub.com"
MAIL_FROM_NAME="QuotesHub"
```

### Option 3: SendGrid (Production, Scalable)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@quoteshub.com"
MAIL_FROM_NAME="QuotesHub"
```

### Option 4: Mailgun (Production, Reliable)
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.com
MAILGUN_SECRET=your-mailgun-secret
MAILGUN_ENDPOINT=api.mailgun.net
MAIL_FROM_ADDRESS="noreply@quoteshub.com"
MAIL_FROM_NAME="QuotesHub"
```

## Queue Configuration

Emails are sent via queue for better performance. Make sure to configure your queue:

```env
QUEUE_CONNECTION=database  # or redis for production
```

Run the queue worker:
```bash
php artisan queue:work
```

For production, use Supervisor to keep queue worker running.

## Testing Emails

### Test Welcome Email
```php
use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;

$user = User::first();
Mail::to('test@example.com')->send(new WelcomeMail($user));
```

Or use Laravel Tinker:
```bash
php artisan tinker
```
```php
Mail::to('your-email@example.com')->send(new \App\Mail\WelcomeMail(\App\Models\User::first()));
```

### Test Password Reset
Just use the "Forgot Password" link on the login page.

## Sending Emails Programmatically

### Welcome Email (Already Integrated)
Automatically sent on user registration in `RegisteredUserController`.

The welcome email is queued automatically when a user registers:
```php
// Already implemented in RegisteredUserController
Mail::to($user)->queue(new WelcomeMail($user));
```

## Troubleshooting

### Emails not sending?
1. Check `.env` configuration
2. Verify queue is running: `php artisan queue:work`
3. Check `failed_jobs` table: `php artisan queue:failed`
4. Test connection in tinker:
```php
Mail::raw('Test', function($msg) { 
    $msg->to('test@example.com')->subject('Test'); 
});
```

### Emails going to spam?
1. Use a verified domain
2. Set up SPF, DKIM, and DMARC records
3. Use a reputable SMTP service (SendGrid, Mailgun)
4. Avoid spam trigger words

### Queue not processing?
```bash
# Restart queue worker
php artisan queue:restart

# Clear failed jobs
php artisan queue:flush

# Monitor queue
php artisan queue:monitor
```

## Design Notes

All email templates:
- Match QuotesHub's purple gradient branding
- Are fully responsive (mobile-friendly)
- Include proper fallbacks for email clients
- Use web-safe fonts with fallbacks
- Include footer with links
- Are accessible and screen-reader friendly

## MVP Production Checklist

- [ ] Configure SMTP in `.env` (Gmail for MVP is fine)
- [ ] Set up queue worker: `php artisan queue:work`
- [ ] Test welcome email on new registration
- [ ] Test password reset flow
- [ ] Verify emails are being sent (check inbox/spam)
- [ ] Monitor failed jobs: `php artisan queue:failed`

## Future Enhancements (Post-MVP)
- Weekly digest emails
- Notification emails for quote interactions
- Email preferences management
- Email analytics
- Bounce handling
- Unsubscribe flow

## Quick Start

1. **Copy `.env.example` to `.env`** (if not already done)

2. **Configure Gmail SMTP** (easiest for MVP):
   - Enable 2-Step Verification in Google Account
   - Generate App Password
   - Update `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   ```

3. **Run queue worker**:
   ```bash
   php artisan queue:work
   ```

4. **Test by registering a new user** - you should receive a welcome email!

That's it! Your email system is ready for MVP. 🚀
