#!/usr/bin/env bash

# Deploy script for Like/Save persistence fix + UTF-8 cleanup
# Run this on your production server

echo "🚀 Deploying Like/Save Fix + UTF-8 Cleanup..."
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

# 4. Clean up malformed UTF-8 data
echo "🔧 Cleaning up malformed UTF-8 characters..."
php artisan cleanup:utf8

# 5. Optimize
echo "⚡ Optimizing..."
php artisan config:cache
php artisan route:cache

# 6. Restart queue workers (if using queues)
echo "🔄 Restarting queue workers..."
php artisan queue:restart

# 7. Bring site back up
echo "✅ Bringing site online..."
php artisan up

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Monitor logs: tail -f storage/logs/laravel.log | grep 'toggle error'"
echo "  2. Test like/save functionality on quote ID 2"
echo "  3. Verify notifications are created successfully"
echo "  4. Check page refresh persistence"
echo ""
echo "💡 If you see errors, check:"
echo "  - Quote ID 2 content for special characters"
echo "  - Database encoding (should be UTF-8)"
echo ""
