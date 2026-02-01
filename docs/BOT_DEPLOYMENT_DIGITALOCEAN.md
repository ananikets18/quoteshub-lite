# Bot System Deployment Guide for DigitalOcean

## Pre-Deployment Setup

### 1. Ensure All Files Are Ready

```bash
# Check required files
ls -la bot/quotes_100_dataset.csv
ls -la config/bot.php
ls -la app/Console/Commands/CronBotQuoteImport.php
```

### 2. Run Migrations on Production

```bash
php artisan migrate --force
```

### 3. Create Bot Users (One-time)

```bash
php artisan db:seed --class=BotUserSeeder --force
```

---

## Crontab Configuration

### Add to Server Crontab

SSH into your DigitalOcean server and edit crontab:

```bash
crontab -e
```

Add these lines:

```cron
# Bot System - Quote Import (every 30 minutes, imports 5 quotes each time)
*/30 * * * * cd /var/www/quoteshub && php artisan bot:cron-import --batch=5 >> /dev/null 2>&1

# Bot System - Regular Activities (every 15 minutes during active hours)
*/15 6-23 * * * cd /var/www/quoteshub && php artisan bot:activity >> /dev/null 2>&1

# Laravel Scheduler (required for other scheduled tasks)
* * * * * cd /var/www/quoteshub && php artisan schedule:run >> /dev/null 2>&1
```

**Adjust the path** `/var/www/quoteshub` to your actual project path.

---

## Import Schedule Options

### Option 1: Slow & Steady (Recommended for Launch)
```cron
# Import 5 quotes every 30 minutes = 10 quotes/hour = 240 quotes/day
*/30 * * * * cd /var/www/quoteshub && php artisan bot:cron-import --batch=5
```

### Option 2: Moderate Growth
```cron
# Import 5 quotes every 15 minutes = 20 quotes/hour = 480 quotes/day
*/15 * * * * cd /var/www/quoteshub && php artisan bot:cron-import --batch=5
```

### Option 3: Fast Initial Population
```cron
# Import 10 quotes every 15 minutes during business hours only
*/15 8-20 * * * cd /var/www/quoteshub && php artisan bot:cron-import --batch=10
```

### Option 4: Weekend Only
```cron
# Import quotes only on weekends
*/20 * * * 0,6 cd /var/www/quoteshub && php artisan bot:cron-import --batch=5
```

---

## Environment Variables (.env)

Add to your production `.env`:

```env
# Bot System
BOT_SYSTEM_ENABLED=true
BOT_USER_COUNT=30
BOT_QUOTES_PER_HOUR=10
BOT_LIKES_PER_HOUR=50
BOT_SAVES_PER_HOUR=20
BOT_FOLLOWS_PER_HOUR=15
BOT_VIEWS_PER_HOUR=100
BOT_LOGGING_ENABLED=true
BOT_LOG_CHANNEL=daily
```

---

## Commands Reference

### Check Import Progress
```bash
php artisan bot:cron-import --batch=0
# or check the progress file
cat storage/app/bot_import_progress.json
```

### Reset and Start Over
```bash
php artisan bot:cron-import --reset
```

### Manual Import (Testing)
```bash
# Import 5 quotes now
php artisan bot:cron-import --batch=5

# Import 10 quotes now
php artisan bot:cron-import --batch=10
```

### Check Bot Statistics
```bash
php artisan bot:activity --stats
```

### View Logs
```bash
tail -f storage/logs/laravel.log
```

---

## Progress Tracking

The system tracks import progress in:
```
storage/app/bot_import_progress.json
```

Example content:
```json
{
    "imported_count": 45,
    "last_run": "2026-02-01 10:30:00",
    "completed": false
}
```

---

## Deployment Steps (DigitalOcean)

### 1. Upload Project
```bash
# Using git
cd /var/www
git clone your-repo.git quoteshub
cd quoteshub
```

### 2. Install Dependencies
```bash
composer install --optimize-autoloader --no-dev
npm install && npm run build
```

### 3. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
# Edit .env with your production settings
```

### 4. Setup Database
```bash
php artisan migrate --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=BotUserSeeder --force
```

### 5. Set Permissions
```bash
chown -R www-data:www-data /var/www/quoteshub
chmod -R 775 /var/www/quoteshub/storage
chmod -R 775 /var/www/quoteshub/bootstrap/cache
```

### 6. Setup Crontab
```bash
crontab -e
# Add the cron jobs mentioned above
```

### 7. Test Bot System
```bash
# Test quote import
php artisan bot:cron-import --batch=2

# Test bot activities
php artisan bot:activity

# Check stats
php artisan bot:activity --stats
```

---

## Monitoring

### Check if Cron is Running
```bash
# View cron logs (Ubuntu/Debian)
sudo tail -f /var/log/syslog | grep CRON

# Check last cron execution
ls -la storage/app/bot_import_progress.json
```

### Monitor Quote Creation
```bash
# Count bot quotes in database
php artisan tinker
>>> App\Models\Quote::whereIn('user_id', App\Models\User::bots()->pluck('id'))->count();
```

### Application Logs
```bash
tail -f storage/logs/laravel.log | grep "Bot"
```

---

## Timeline Examples

### 100 Quotes Import Timeline

**5 quotes every 30 minutes:**
- 10 quotes/hour
- 100 quotes in 10 hours
- ✅ Completes in 1 day

**5 quotes every 15 minutes:**
- 20 quotes/hour
- 100 quotes in 5 hours
- ✅ Completes in half a day

**10 quotes every 15 minutes:**
- 40 quotes/hour
- 100 quotes in 2.5 hours
- ✅ Completes in a few hours

---

## Troubleshooting

### Cron Not Running?
```bash
# Check cron service
sudo systemctl status cron

# Restart cron
sudo systemctl restart cron

# Test command manually
cd /var/www/quoteshub && php artisan bot:cron-import --batch=5
```

### Quotes Not Importing?
```bash
# Check logs
tail -50 storage/logs/laravel.log

# Check progress file
cat storage/app/bot_import_progress.json

# Reset and try again
php artisan bot:cron-import --reset
php artisan bot:cron-import --batch=5
```

### Permission Issues?
```bash
sudo chown -R www-data:www-data /var/www/quoteshub/storage
sudo chmod -R 775 /var/www/quoteshub/storage
```

---

## Production Best Practices

1. **Start Slow**: Use 5 quotes per 30 minutes for first week
2. **Monitor Logs**: Check logs daily for first few days
3. **Adjust Timing**: Increase frequency after stability confirmed
4. **Backup First**: Always backup database before bulk operations
5. **Test Locally**: Test cron commands on staging first
6. **Set Alerts**: Use monitoring tools (e.g., Laravel Telescope, Sentry)

---

## Disabling Bot System

When you have enough real users:

1. **Stop Quote Import:**
   ```bash
   # Remove cron job for bot:cron-import
   crontab -e
   # Comment out or remove the bot:cron-import line
   ```

2. **Stop Bot Activities:**
   ```bash
   # Set in .env
   BOT_SYSTEM_ENABLED=false
   
   # Clear config cache
   php artisan config:clear
   ```

3. **Keep Bot Content:**
   - Leave existing bot quotes/likes/follows
   - They provide social proof
   - Mark bots as inactive: `User::bots()->update(['is_active' => false]);`

---

## Quick Reference

```bash
# Deploy to DigitalOcean
git pull origin main
composer install --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Setup bots (one-time)
php artisan db:seed --class=BotUserSeeder --force

# Test import
php artisan bot:cron-import --batch=5

# Add to crontab
*/30 * * * * cd /var/www/quoteshub && php artisan bot:cron-import --batch=5 >> /dev/null 2>&1
*/15 6-23 * * * cd /var/www/quoteshub && php artisan bot:activity >> /dev/null 2>&1
```
