# PostgreSQL Migration Guide

This guide will help you migrate from SQLite to PostgreSQL.

## Prerequisites

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Or use Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Install PHP PostgreSQL Extension

**Windows:**
- Uncomment `extension=pdo_pgsql` and `extension=pgsql` in your `php.ini`

**macOS/Linux:**
```bash
# Usually already included with PHP
php -m | grep pgsql
```

## Migration Steps

### Step 1: Create PostgreSQL Database

```bash
# Access PostgreSQL (Linux/macOS)
sudo -u postgres psql

# Or on Windows (from Command Prompt)
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create database
CREATE DATABASE quoteshub;

-- Create user (optional, for better security)
CREATE USER quoteshub_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE quoteshub TO quoteshub_user;

-- Connect to the database
\c quoteshub

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO quoteshub_user;

-- Exit
\q
```

### Step 2: Update .env Configuration

Your `.env` file has been updated with PostgreSQL settings:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=quoteshub
DB_USERNAME=postgres
DB_PASSWORD=
```

**Update the password:**
- If using `postgres` user, set `DB_PASSWORD` to your postgres password
- If you created `quoteshub_user`, update `DB_USERNAME` and `DB_PASSWORD` accordingly

### Step 3: Export Data from SQLite (Optional)

If you have existing data in SQLite that you want to migrate:

```bash
# Export data using Laravel tinker or create a custom command
php artisan tinker
```

Or create a backup seeder to preserve your data.

### Step 4: Clear Configuration Cache

```bash
php artisan config:clear
php artisan cache:clear
```

### Step 5: Run Migrations

```bash
# Run all migrations on PostgreSQL
php artisan migrate:fresh

# Or if you want to preserve data structure
php artisan migrate
```

### Step 6: Seed Database (if needed)

```bash
php artisan db:seed
```

### Step 7: Test the Application

```bash
# Start the development server
php artisan serve

# In another terminal, start the queue worker
php artisan queue:work

# Test the application
# - Register a new user
# - Create quotes
# - Test all major features
```

## Differences Between SQLite and PostgreSQL

### 1. Boolean Values
- **SQLite:** Uses 0/1
- **PostgreSQL:** Uses true/false (native boolean type)
- Laravel handles this automatically

### 2. Date/Time Handling
- PostgreSQL has better native date/time support
- Timezone-aware timestamps work better

### 3. Full-Text Search
- PostgreSQL offers superior full-text search capabilities
- Consider using PostgreSQL's native search features for better performance

### 4. JSON Support
- Both support JSON, but PostgreSQL has more advanced JSON operators
- You can leverage `->` and `->>` operators for better queries

### 5. Performance
- PostgreSQL handles concurrent writes much better
- Better for production environments with multiple users

## Production Deployment

### Recommended PostgreSQL Hosting Options:

1. **Neon** (https://neon.tech) - Free tier available, serverless PostgreSQL
2. **Supabase** (https://supabase.com) - Free tier, includes auth and storage
3. **Railway** (https://railway.app) - Simple deployment with PostgreSQL
4. **Heroku Postgres** - Reliable, easy to use
5. **AWS RDS** - Enterprise-grade, scalable
6. **DigitalOcean Managed Databases** - Good balance of features and price

### Production .env Settings:

```env
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host.com
DB_PORT=5432
DB_DATABASE=quoteshub_production
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password
DB_SSLMODE=require  # Important for production!
```

## Troubleshooting

### Connection Refused Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log  # Linux
```

### Authentication Failed
- Verify username and password in `.env`
- Check `pg_hba.conf` for authentication settings
- Ensure user has proper privileges

### Migration Errors
```bash
# Drop all tables and start fresh
php artisan migrate:fresh

# Check migration status
php artisan migrate:status
```

### Performance Issues
```sql
-- Create indexes for better performance
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_likes_quote_id ON likes(quote_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
```

## Rollback to SQLite (if needed)

If you need to rollback:

1. Change `.env`:
```env
DB_CONNECTION=sqlite
```

2. Clear cache:
```bash
php artisan config:clear
```

3. Run migrations:
```bash
php artisan migrate:fresh --seed
```

## Next Steps

- Set up automated backups for PostgreSQL
- Configure connection pooling for better performance
- Consider using PostgreSQL-specific features (full-text search, JSON operators)
- Monitor database performance and optimize queries
- Set up proper indexes for frequently queried columns
