# QuotesHub Lite

A platform to discover and share inspiring quotes. Join a community of thinkers and dreamers — save quotes, create collections, follow others, and get your daily dose of wisdom.

## Project Structure

```
├── backend/    → Laravel API (PHP 8.2+, Sanctum, PostgreSQL)
├── frontend/   → React SPA (Vite, TypeScript)
```

## Features

- **Discover** – Browse quotes by topic, author, or personalised feed
- **Share & Save** – Post quotes, like, save, and organise into collections
- **Connect** – Follow users, see activity, and get recommendations
- **Achievements** – Streaks, badges, and gamification
- **Notifications** – In-app and optional email alerts

## Quick Start

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` to point to your backend API.

## Tech Stack

| Layer    | Tech                               |
| -------- | ---------------------------------- |
| Frontend | React 19, TypeScript, Vite         |
| Backend  | Laravel 12, PHP 8.2, Sanctum      |
| Database | PostgreSQL                         |
| Auth     | Laravel Sanctum + Socialite (OAuth)|

## License

MIT
