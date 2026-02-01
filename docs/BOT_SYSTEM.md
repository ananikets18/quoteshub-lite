# Bot System Setup Guide

## Overview
The bot system simulates user activity on your platform to create an active appearance before real user growth. Bots can create quotes, like content, save quotes, follow users, and generate views.

## Files Created

### Configuration
- **config/bot.php** - Main configuration file with all bot behavior settings

### Database
- **Migration**: `database/migrations/2026_02_01_051251_add_is_bot_to_users_table.php`
  - Adds `is_bot`, `last_bot_activity`, and `daily_action_count` columns to users table

### Models
- **app/Models/User.php** - Updated with bot-related fields and scopes

### Services
- **app/Services/BotService.php** - Core bot logic for all activities

### Seeders
- **database/seeders/BotUserSeeder.php** - Creates bot user accounts

### Commands
- **app/Console/Commands/RunBotActivity.php** - CLI command to run bot activities

## Setup Instructions

### 1. Update .env File

Add these environment variables to your `.env` file:

```env
# Bot System Configuration
BOT_SYSTEM_ENABLED=false  # Set to true to enable
BOT_USER_COUNT=50

# Activity frequencies (per hour)
BOT_QUOTES_PER_HOUR=10
BOT_LIKES_PER_HOUR=50
BOT_SAVES_PER_HOUR=20
BOT_FOLLOWS_PER_HOUR=15
BOT_VIEWS_PER_HOUR=100

# Bot logging
BOT_LOGGING_ENABLED=true
BOT_LOG_CHANNEL=stack
```

### 2. Run Migrations

```bash
php artisan migrate
```

This adds the bot-related columns to the users table.

### 3. Seed Bot Users

```bash
php artisan db:seed --class=BotUserSeeder
```

This creates 50 bot users (or the number specified in `BOT_USER_COUNT`).

### 4. Enable Bot System

Update your `.env`:
```env
BOT_SYSTEM_ENABLED=true
```

## Usage

### Run Bot Activities Manually

```bash
# Run bot activities once
php artisan bot:activity

# Show bot statistics
php artisan bot:activity --stats

# Clean up old bot activities (30 days old)
php artisan bot:activity --cleanup

# Clean up with custom days
php artisan bot:activity --cleanup --cleanup-days=60
```

### Schedule Automated Bot Activities

Add to `app/Console/Kernel.php` in the `schedule()` method:

```php
// Run bot activities every 15 minutes
$schedule->command('bot:activity')
    ->everyFifteenMinutes()
    ->when(function () {
        return config('bot.enabled');
    });

// Daily cleanup of old bot content
$schedule->command('bot:activity --cleanup')
    ->daily()
    ->at('03:00');
```

Then ensure your scheduler is running:
```bash
# For development (run in terminal)
php artisan schedule:work

# For production (add to crontab)
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## Configuration Options

### Activity Frequencies

Control how many actions bots perform per hour in `config/bot.php`:

```php
'activity' => [
    'quotes_per_hour' => 10,
    'likes_per_hour' => 50,
    'saves_per_hour' => 20,
    'follows_per_hour' => 15,
    'views_per_hour' => 100,
],
```

### Probability Settings

Control the chance (0-100%) that each bot performs an action:

```php
'probability' => [
    'create_quote' => 30,
    'like_quote' => 70,
    'save_quote' => 40,
    'follow_user' => 25,
    'view_quote' => 90,
],
```

### Behavior Patterns

Configure when bots are active:

```php
'behavior' => [
    'active_hours' => [
        'start' => 6,  // 6 AM
        'end' => 23,   // 11 PM
    ],
    'max_quotes_per_day' => 5,
    'max_likes_per_day' => 100,
    'max_saves_per_day' => 30,
    'max_follows_per_day' => 20,
],
```

## Bot Content

### Custom Quote Templates

Edit `config/bot.php` to add your own quotes:

```php
'content' => [
    'sample_quotes' => [
        'Your custom quote here',
        'Another inspiring quote',
        // Add more...
    ],
    
    'sample_authors' => [
        'Author Name',
        'Another Author',
        // Add more...
    ],
],
```

### Custom Bot Profiles

Customize bot profile templates:

```php
'profiles' => [
    'name_prefix' => 'Bot_',  // Optional prefix for bot names
    'bio_templates' => [
        'Custom bio 1',
        'Custom bio 2',
        // Add more...
    ],
],
```

## Monitoring

### View Statistics

```bash
php artisan bot:activity --stats
```

This shows:
- Total bots
- Active bots
- Bots active today
- Total bot-created content
- Total bot interactions

### Logging

Bot activities are logged if enabled. Check logs at:
- `storage/logs/laravel.log`

Enable detailed logging in `config/bot.php`:
```php
'logging' => [
    'enabled' => true,
    'log_all_actions' => true,  // Log every action (use for debugging)
],
```

## Safety Features

The bot system includes several safety limits:

```php
'limits' => [
    'max_total_actions_per_day' => 5000,
    'min_real_user_percentage' => 10,
    'max_bot_activity_percentage' => 60,
],
```

## Filtering Bots from Analytics

To exclude bots from analytics, use the User model scopes:

```php
// Get only real users
$realUsers = User::realUsers()->get();

// Get only bots
$bots = User::bots()->get();

// Count real user quotes
$realUserQuotes = Quote::whereHas('user', function($q) {
    $q->where('is_bot', false);
})->count();
```

## Production Best Practices

1. **Start Small**: Begin with 20-30 bots
2. **Gradual Ramp Up**: Slowly increase bot activity over time
3. **Natural Patterns**: Keep active hours realistic (6 AM - 11 PM)
4. **Monitor Performance**: Watch database load and adjust frequencies
5. **Quality Content**: Use real, inspiring quotes
6. **Regular Cleanup**: Run cleanup weekly to remove low-engagement content
7. **Disable When Ready**: Turn off bots when you have sufficient real users

## Disabling Bots

To temporarily disable:
```env
BOT_SYSTEM_ENABLED=false
```

To permanently remove:
1. Set all bots to inactive: `User::bots()->update(['is_active' => false]);`
2. Delete bot users: `User::bots()->delete();`
3. Remove bot content: Check the cleanup command

## Troubleshooting

### Bots not creating content
- Check `BOT_SYSTEM_ENABLED=true` in .env
- Ensure bots exist: `php artisan bot:activity --stats`
- Check active hours configuration
- Review logs for errors

### Too much bot activity
- Reduce frequency in `config/bot.php`
- Lower probability percentages
- Decrease `BOT_USER_COUNT`

### Performance issues
- Reduce `BOT_*_PER_HOUR` values
- Increase `min_action_delay` and `max_action_delay`
- Run bot command less frequently

## Support

For issues or questions, check:
- Application logs: `storage/logs/laravel.log`
- Database: Check `users` table for `is_bot = true`
- Configuration: Review `config/bot.php`
