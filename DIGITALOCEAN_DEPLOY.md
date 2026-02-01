# 🚀 DigitalOcean Deployment Guide - QuotesHub

## Repository Information
- **GitHub Repository**: https://github.com/ananikets18/Quoteshub
- **Production Branch**: `main`
- **Framework**: Laravel 11 + React (Inertia.js)

## Essential Files Pushed to Production

### Backend (Laravel)
- ✅ All controllers, models, services
- ✅ Database migrations and seeders
- ✅ Routes (web.php, api.php, auth.php)
- ✅ Configuration files
- ✅ Bot system and commands
- ✅ Middleware and policies
- ✅ Email templates

### Frontend (React)
- ✅ All React components
- ✅ Pages and layouts
- ✅ Hooks and utilities
- ✅ CSS/Tailwind configuration
- ✅ Vite build configuration

### Documentation
- ✅ Complete documentation in `/docs` folder
- ✅ Deployment checklist
- ✅ Bot system guides
- ✅ Email configuration
- ✅ Security guidelines

## Files Excluded (via .gitignore)
- ❌ `.env` (create manually on server)
- ❌ `node_modules/` (install on server)
- ❌ `vendor/` (install on server)
- ❌ `/public/build` (build on server)
- ❌ Log files
- ❌ Cache files
- ❌ IDE configurations

## Quick Setup on DigitalOcean

### 1. Connect Repository
```bash
# DigitalOcean App Platform will automatically:
# - Clone from: https://github.com/ananikets18/Quoteshub
# - Use branch: main
# - Detect Laravel framework
```

### 2. Environment Variables (Set in DigitalOcean)
```env
APP_NAME="QuotesHub"
APP_ENV=production
APP_DEBUG=false
APP_KEY=<generate-new-key>
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_DATABASE=${db.DATABASE}
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}

MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com

SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Optional: Pusher for real-time notifications
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=
```

### 3. Build Commands
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies and build assets
npm ci
npm run build

# Generate app key if not set
php artisan key:generate --force

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage
php artisan storage:link
```

### 4. Run Command (Start Server)
```bash
php artisan serve --host=0.0.0.0 --port=8080
# OR use Apache/Nginx pointing to /public directory
```

### 5. Post-Deployment Tasks
```bash
# Seed initial categories and bot users
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=BotUserSeeder

# Optional: Import bot quotes
php artisan bot:import-quotes

# Set up cron for scheduled tasks
* * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
```

## Database Requirements
- **Type**: PostgreSQL 14+ (recommended)
- **Alternative**: MySQL 8.0+
- **Dev**: SQLite (already configured in repo)

## Required Services on DigitalOcean
1. **App Platform** - For Laravel application
2. **Managed Database** - PostgreSQL database
3. **Spaces (Optional)** - For file storage (S3-compatible)
4. **Email Service** - SMTP provider (SendGrid, Mailgun, etc.)

## Health Check Endpoint
- **URL**: `https://your-domain.com/api/health`
- **Expected Response**: `{"status":"ok","database":"connected"}`

## Important Notes

### Security
- ✅ HTTPS enforced via middleware
- ✅ CSRF protection enabled
- ✅ Rate limiting configured
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection (React escaping)

### Performance
- ✅ Optimized autoloader
- ✅ Configuration caching
- ✅ Route caching
- ✅ View caching
- ✅ Vite production build with minification

### Scheduled Tasks (Cron Jobs)
```bash
# Add to cron (runs every minute)
* * * * * php /var/www/html/artisan schedule:run

# Tasks included:
# - Calculate engagement scores (daily)
# - Update user preferences (daily)
# - Bot activity (hourly)
# - Import bot quotes (every 30 minutes)
```

## Monitoring & Logs
```bash
# View application logs
tail -f storage/logs/laravel.log

# View server logs (DigitalOcean console)
# App Platform > Your App > Runtime Logs
```

## Troubleshooting

### Issue: 500 Error
```bash
# Clear all caches
php artisan optimize:clear

# Check logs
tail -100 storage/logs/laravel.log

# Verify permissions
chmod -R 755 storage bootstrap/cache
```

### Issue: Assets not loading
```bash
# Rebuild assets
npm run build

# Clear browser cache
# Check APP_URL in .env matches your domain
```

### Issue: Database connection failed
```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();

# Verify .env database credentials
# Check DigitalOcean database firewall rules
```

## Deployment Verification Checklist
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Email verification sends
- [ ] Login/logout functions
- [ ] Create quote works
- [ ] Feed displays quotes
- [ ] Search functionality works
- [ ] Profile pages load
- [ ] API endpoints respond
- [ ] Images/assets load
- [ ] SSL certificate active
- [ ] Bot users visible

## Support & Documentation
- **Full Docs**: `/docs` folder in repository
- **Deployment Details**: `/docs/DEPLOYMENT_CHECKLIST.md`
- **Bot System**: `/docs/BOT_SYSTEM_QUICKSTART.md`
- **Email Setup**: `/docs/EMAIL_CONFIGURATION.md`

---

## Quick Deploy Button (DigitalOcean)
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Select "GitHub" as source
4. Choose repository: `ananikets18/Quoteshub`
5. Select branch: `main`
6. Add environment variables (see above)
7. Click "Deploy"

**Estimated deployment time**: 5-10 minutes

---

**Last Updated**: February 1, 2026
**Production Ready**: ✅ Yes
**Branch**: main
**Version**: 1.0.0
