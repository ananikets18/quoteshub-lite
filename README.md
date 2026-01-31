# QuotesHub

A platform to discover and share inspiring quotes. Join a community of thinkers and dreamers—save quotes, create collections, follow others, and get your daily dose of wisdom.

## Features

- **Discover** – Browse quotes by topic, author, or feed
- **Share & save** – Post quotes, like, save, and organize into collections
- **Connect** – Follow users, see activity, and get personalized recommendations
- **Achievements** – Streaks, badges, and gamification
- **Notifications** – In-app and optional email alerts

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React 18, Inertia.js, Tailwind CSS, Vite
- **Auth:** Laravel Breeze, Sanctum (API), optional Google OAuth
- **Real-time:** Pusher (optional)

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- Database (SQLite for local, PostgreSQL/MySQL for production)
- Optional: Redis (e.g. Upstash) for minimal caching

## Setup

```bash
# Install dependencies
composer install
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Configure .env (DB, mail, optional Redis/Pusher)
# Then migrate
php artisan migrate

# Build assets
npm run build
```

## Running locally

```bash
# Single command: server + queue + Vite
composer run dev
```

Or separately:

```bash
php artisan serve
php artisan queue:listen
npm run dev
```

## Environment

- `APP_NAME=QuotesHub` – Used in titles and meta
- `VITE_APP_NAME=QuotesHub` – Used in browser tab titles (optional; defaults to QuotesHub)
- See `.env.example` for database, mail, Redis, and Pusher options.

## Documentation

Comprehensive documentation is available in the [`/docs`](./docs/) folder:

- **[Deployment Guide](./docs/DEPLOYMENT_CHECKLIST.md)** - Complete production deployment checklist
- **[Feature Documentation](./docs/README.md)** - All system features and implementation details
- **[Security Guide](./docs/SECURITY_TEST_CHECKLIST.md)** - Security testing and validation
- **[Admin Guide](./docs/CONTENT_MODERATION_SYSTEM.md)** - Admin panel and moderation tools

## Admin Access

Two admin accounts are pre-configured:
- **Aniket Shinde**: `ananiket.pshinde18@gmail.com` / `Aniket@123`
- **Adnois Wins**: `adnois.wins@gmail.com` / `Adonis@123`

Access the admin panel at `/admin` after logging in.

## License

MIT.
