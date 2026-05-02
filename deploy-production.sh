#!/usr/bin/env bash

set -euo pipefail

cleanup() {
    php artisan up >/dev/null 2>&1 || true
}

trap cleanup EXIT

echo "Starting QuotesHub production deployment..."

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "This script must be run from inside the Git repository."
    exit 1
fi

echo "Putting application into maintenance mode..."
php artisan down --message="Deploying QuotesHub update" --retry=60 || true

echo "Pulling latest code..."
git pull origin main

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "Installing frontend dependencies and building assets..."
npm ci
npm run build

echo "Running database migrations..."
php artisan migrate --force

echo "Clearing and rebuilding caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Ensuring storage symlink exists..."
php artisan storage:link || true

echo "Restarting queue workers..."
php artisan queue:restart || true

echo "Deployment completed successfully."
echo "Remember to ensure your cron runs: php artisan schedule:run every minute."