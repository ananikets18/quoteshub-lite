# Bot System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Migration
```bash
php artisan migrate
```

### Step 2: Update .env
```bash
# Add to your .env file
BOT_SYSTEM_ENABLED=true
BOT_USER_COUNT=50
```

### Step 3: Create Bot Users
```bash
php artisan db:seed --class=BotUserSeeder
```

### Step 4: Test Bot Activity
```bash
# Run once to test
php artisan bot:activity

# View statistics
php artisan bot:activity --stats
```

### Step 5: Automate (Optional)
Add to `app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule)
{
    // Run bot activities every 15 minutes
    $schedule->command('bot:activity')
        ->everyFifteenMinutes()
        ->when(fn() => config('bot.enabled'));
}
```

Then run:
```bash
php artisan schedule:work
```

## ✅ What Bots Will Do

- ✨ Create quotes (10/hour)
- ❤️ Like quotes (50/hour)
- 💾 Save quotes (20/hour)
- 👥 Follow users (15/hour)
- 👁️ View quotes (100/hour)

## 📊 Monitor Activity

```bash
# View statistics anytime
php artisan bot:activity --stats

# Sample output:
# Total Bots: 50
# Active Bots: 50
# Bots Active Today: 25
# Total Bot Quotes: 120
# Total Bot Likes: 450
# ...
```

## 🎯 Recommended Timeline

**Week 1-2**: High activity
```env
BOT_QUOTES_PER_HOUR=15
BOT_LIKES_PER_HOUR=60
```

**Week 3-4**: Medium activity
```env
BOT_QUOTES_PER_HOUR=10
BOT_LIKES_PER_HOUR=40
```

**Month 2+**: Low activity
```env
BOT_QUOTES_PER_HOUR=5
BOT_LIKES_PER_HOUR=20
```

**After Real Users**: Disable
```env
BOT_SYSTEM_ENABLED=false
```

## 🛠️ Common Commands

```bash
# Run bot activity once
php artisan bot:activity

# Show statistics
php artisan bot:activity --stats

# Clean old bot content
php artisan bot:activity --cleanup

# Run scheduler (includes bots)
php artisan schedule:work
```

## 🔍 Verify It's Working

1. Run: `php artisan bot:activity`
2. Check output for activity counts
3. Visit your app and see new quotes
4. Run: `php artisan bot:activity --stats`

## ⚙️ Configuration Files

- **config/bot.php** - All bot settings
- **.env.bot.example** - Environment variable examples
- **docs/BOT_SYSTEM.md** - Complete documentation

## 🚫 Disable Bots

Temporary:
```env
BOT_SYSTEM_ENABLED=false
```

Permanent:
```bash
# Deactivate all bots
php artisan tinker
User::bots()->update(['is_active' => false]);
```

## 📝 Notes

- Bots only work during active hours (6 AM - 11 PM by default)
- All bot quotes are auto-approved
- Bot emails: `username@bot.quoteshub.local`
- Bot activity is logged in `storage/logs`

## Need Help?

See full documentation: `docs/BOT_SYSTEM.md`
