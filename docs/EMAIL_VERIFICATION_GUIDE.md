# Email Verification Setup Guide

## Current Status ✅

Your QuotesHub application has email verification **fully configured** and ready to use!

### What's Already Set Up:

1. ✅ **User Model** - Implements `MustVerifyEmail` interface
2. ✅ **Registration Flow** - Triggers `Registered` event
3. ✅ **Email Routes** - All verification routes configured
4. ✅ **Verification Page** - UI for email verification prompt
5. ✅ **Middleware Integration** - Onboarding waits for email verification

---

## User Flow

```
1. User Registers
   ↓
2. Registered Event Fired
   ↓
3. Verification Email Sent
   ↓
4. User Redirected to Dashboard
   ↓
5. Middleware Checks Email Verification
   ↓
6. If NOT Verified → Show "Verify Email" Page
   ↓
7. User Clicks Link in Email
   ↓
8. Email Verified ✅
   ↓
9. Onboarding Middleware Activates
   ↓
10. If NOT Onboarded → Redirect to Onboarding
    ↓
11. Complete Onboarding
    ↓
12. Full App Access ✅
```

---

## SMTP Configuration

### Current Setting (Development)
```env
MAIL_MAILER=log
```
- Emails are written to `storage/logs/laravel.log`
- No actual emails sent
- Good for initial development

---

## Setup Real Email Sending

### Option 1: Mailtrap (Recommended for Testing) 🎯

**Why Mailtrap?**
- ✅ Free for development
- ✅ Catches all emails (safe testing)
- ✅ Beautiful inbox interface
- ✅ No risk of sending to real users
- ✅ Test email rendering

**Setup Steps:**

1. **Create Account**
   - Go to https://mailtrap.io
   - Sign up for free account
   - Verify your email

2. **Get Credentials**
   - Login to Mailtrap
   - Go to "Email Testing" → "Inboxes"
   - Click "My Inbox" (or create new)
   - Click "Show Credentials"
   - Copy SMTP settings

3. **Update .env File**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_username_here
   MAIL_PASSWORD=your_mailtrap_password_here
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="noreply@quoteshub.com"
   MAIL_FROM_NAME="QuotesHub"
   ```

4. **Clear Config Cache**
   ```bash
   php artisan config:clear
   ```

5. **Test Email**
   ```bash
   php artisan email:test your-email@example.com
   ```

6. **Check Mailtrap Inbox**
   - Go back to Mailtrap
   - Check "My Inbox"
   - You should see the test email!

---

### Option 2: Gmail (For Real Email Testing) 📧

**Why Gmail?**
- ✅ Free
- ✅ Sends real emails
- ✅ Good for testing with actual users
- ⚠️ Requires App Password (2FA)

**Setup Steps:**

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"
   - Follow the setup wizard

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" for app
   - Select "Other (Custom name)" for device
   - Enter "QuotesHub" as name
   - Click "Generate"
   - **Copy the 16-character password** (no spaces)

3. **Update .env File**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="your-email@gmail.com"
   MAIL_FROM_NAME="QuotesHub"
   ```

4. **Clear Config Cache**
   ```bash
   php artisan config:clear
   ```

5. **Test Email**
   ```bash
   php artisan email:test your-email@gmail.com
   ```

6. **Check Gmail Inbox**
   - Check your Gmail inbox
   - You should receive the test email!

---

### Option 3: Other Free SMTP Services

#### SendGrid (Free Tier: 100 emails/day)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
```

#### Mailgun (Free Tier: 5,000 emails/month)
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-api-key
MAILGUN_ENDPOINT=api.mailgun.net
```

#### Amazon SES (Free Tier: 62,000 emails/month)
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
```

---

## Testing Email Verification

### 1. Test Email Configuration
```bash
php artisan email:test test@example.com
```

**Expected Output:**
```
Sending test email to: test@example.com
Using mailer: smtp
SMTP Host: sandbox.smtp.mailtrap.io
SMTP Port: 2525

✅ Test email sent successfully!

Check your inbox at: test@example.com
```

---

### 2. Test Registration Flow

1. **Register New User**
   - Go to `/register`
   - Fill in details
   - Submit form

2. **Check Email Sent**
   - If using Mailtrap: Check Mailtrap inbox
   - If using Gmail: Check Gmail inbox
   - If using log: Check `storage/logs/laravel.log`

3. **Verify Email Link**
   - Click verification link in email
   - Should redirect to dashboard
   - Email should be marked as verified

4. **Check Database**
   ```sql
   SELECT id, name, email, email_verified_at FROM users;
   ```
   - `email_verified_at` should have a timestamp

---

### 3. Test Onboarding Flow

1. **After Email Verification**
   - User should be redirected to onboarding
   - Complete all onboarding steps
   - Should redirect to feed

2. **Check Database**
   ```sql
   SELECT id, name, email_verified_at, onboarding_completed FROM users;
   ```
   - Both should be set

---

## Email Templates

### Verification Email (Laravel Default)

Laravel sends a default verification email. To customize:

1. **Publish Notification**
   ```bash
   php artisan vendor:publish --tag=laravel-notifications
   ```

2. **Edit Template**
   - File: `resources/views/vendor/notifications/email.blade.php`
   - Customize HTML/CSS

3. **Custom Notification Class**
   ```bash
   php artisan make:notification VerifyEmailNotification
   ```

---

## Troubleshooting

### Issue: "Connection refused"
**Cause:** Wrong SMTP host or port  
**Solution:** Double-check MAIL_HOST and MAIL_PORT in .env

### Issue: "Authentication failed"
**Cause:** Wrong username or password  
**Solution:** 
- For Gmail: Make sure you're using App Password, not regular password
- For Mailtrap: Copy credentials exactly from dashboard

### Issue: "Emails not arriving"
**Cause:** Various reasons  
**Solution:**
1. Check spam folder
2. Verify MAIL_FROM_ADDRESS is valid
3. Check email service logs
4. Use `php artisan email:test` to debug

### Issue: "SSL/TLS errors"
**Cause:** Wrong encryption setting  
**Solution:** Try both `tls` and `ssl` in MAIL_ENCRYPTION

### Issue: "Verification link doesn't work"
**Cause:** APP_URL not set correctly  
**Solution:** Set APP_URL in .env to your actual domain
```env
APP_URL=http://localhost:8000
```

---

## Middleware Flow

### EnsureOnboardingCompleted Middleware

**Updated Logic:**
```php
// Only redirect to onboarding if email is verified
if ($request->user()->hasVerifiedEmail() && !$request->user()->onboarding_completed) {
    return redirect()->route('onboarding.show');
}
```

**Exclusions:**
- ✅ Email verification routes (`verification.*`)
- ✅ Onboarding routes (`onboarding.*`)
- ✅ API routes (`api/*`)
- ✅ Logout route

**Flow:**
```
Register → Verify Email → Onboarding → App
```

---

## Production Recommendations

### 1. Use Transactional Email Service
- **SendGrid** - Reliable, good free tier
- **Mailgun** - Developer-friendly
- **Amazon SES** - Cheapest for high volume
- **Postmark** - Best deliverability

### 2. Set Up SPF/DKIM Records
- Improves email deliverability
- Prevents emails from going to spam
- Required by most email services

### 3. Monitor Email Delivery
- Track open rates
- Monitor bounce rates
- Set up webhooks for failures

### 4. Queue Emails
Already configured! Emails use `queue()` method:
```php
Mail::to($user)->queue(new WelcomeMail($user));
```

Make sure to run queue worker:
```bash
php artisan queue:work
```

---

## Quick Start Guide

### For Development (Mailtrap)

1. **Sign up at Mailtrap.io**
2. **Copy credentials to .env:**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_username
   MAIL_PASSWORD=your_password
   MAIL_ENCRYPTION=tls
   ```
3. **Clear config:**
   ```bash
   php artisan config:clear
   ```
4. **Test:**
   ```bash
   php artisan email:test test@example.com
   ```
5. **Check Mailtrap inbox** ✅

### For Production (SendGrid)

1. **Sign up at SendGrid.com**
2. **Create API Key**
3. **Update .env:**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USERNAME=apikey
   MAIL_PASSWORD=your-api-key
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="noreply@quoteshub.com"
   ```
4. **Clear config and test**

---

## Commands Reference

```bash
# Test email configuration
php artisan email:test your@email.com

# Clear config cache (after .env changes)
php artisan config:clear

# View email in log (if using log driver)
tail -f storage/logs/laravel.log

# Run queue worker (for queued emails)
php artisan queue:work

# Check mail configuration
php artisan tinker
>>> config('mail')
```

---

## Summary

✅ **Email verification is fully configured**  
✅ **Middleware properly excludes verification routes**  
✅ **Flow: Register → Verify → Onboard → App**  
✅ **Test command available: `php artisan email:test`**  

**Next Steps:**
1. Choose SMTP service (Mailtrap for dev, SendGrid for prod)
2. Update .env with credentials
3. Run `php artisan config:clear`
4. Test with `php artisan email:test`
5. Register a new user and verify the flow

---

**Last Updated:** January 31, 2026  
**Status:** Ready for Testing ✅
