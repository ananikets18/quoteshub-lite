#!/usr/bin/env bash

# Deploy script for Like/Save persistence fix
# Run this on your production server

echo "🚀 Deploying Like/Save Fix..."
echo ""

# 1. Backup current state
echo "📦 Creating backup..."
php artisan down --message="Applying critical fix" --retry=60

# 2. Pull latest changes
echo "⬇️  Pulling latest code..."
git pull origin main

# 3. Clear caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Optimize
echo "⚡ Optimizing..."
php artisan config:cache
php artisan route:cache

# 5. Restart queue workers (if using queues)
echo "🔄 Restarting queue workers..."
php artisan queue:restart

# 6. Bring site back up
echo "✅ Bringing site online..."
php artisan up

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Monitor logs: tail -f storage/logs/laravel.log"
echo "  2. Test like/save functionality"
echo "  3. Verify page refresh persistence"
echo ""
