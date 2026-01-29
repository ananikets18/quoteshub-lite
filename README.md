# 📝 QuotesHub

A modern quote-sharing platform built with Laravel and React, where users can create, share, and discover inspiring quotes.

## 🚀 Features

- **User Authentication** - Secure registration and login system
- **Quote Management** - Create, edit, and delete your quotes
- **Social Features** - Like and save favorite quotes
- **Feed System** - Discover quotes from the community
- **Creator Studio** - Dedicated space for content creators
- **Responsive Design** - Beautiful UI that works on all devices
- **RESTful API** - Well-documented API endpoints

## 🛠️ Tech Stack

### Backend
- **Laravel 11.x** - PHP framework
- **PostgreSQL** - Database
- **Laravel Sanctum** - API authentication

### Frontend
- **React 18** - UI library
- **Inertia.js** - Modern monolith approach
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.x
- **npm** or **yarn**
- **PostgreSQL** >= 14.x
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ananikets18/Quoteshub.git
cd Quoteshub
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
APP_NAME=QuotesHub
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=quoteshub
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

SESSION_DRIVER=database
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE quoteshub;
```

Run migrations and seeders:

```bash
php artisan migrate --seed
```

### 7. Build Frontend Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### 8. Start the Development Server

In a separate terminal, start the Laravel server:

```bash
php artisan serve
```

Your application should now be running at `http://localhost:8000`

## 🌿 Git Branching Strategy

This project follows a structured branching workflow:

- **`main`** - Production-ready code (protected)
- **`test`** - Staging/QA environment
- **`dev`** - Active development branch
- **`feature/*`** - Feature branches (created from `dev`)
- **`bugfix/*`** - Bug fix branches (created from `dev`)
- **`hotfix/*`** - Critical fixes (created from `main`)

### Workflow

1. Create feature branch from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push and create Pull Request to `dev`:
   ```bash
   git push origin feature/your-feature-name
   ```

4. After review, merge to `dev` → `test` → `main`

## 🧪 Testing

Run the test suite:

```bash
php artisan test
```

Run specific test file:

```bash
php artisan test --filter=QuoteTest
```

## 📦 Deployment

### Production Build

1. Set environment to production:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Optimize Laravel:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. Build frontend assets:
   ```bash
   npm run build
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👨‍💻 Author

**Aniket Sharma**
- GitHub: [@ananikets18](https://github.com/ananikets18)

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com)
- UI powered by [React](https://react.dev) and [TailwindCSS](https://tailwindcss.com)
- Monolith magic by [Inertia.js](https://inertiajs.com)

---

**Happy Coding! 🚀**
