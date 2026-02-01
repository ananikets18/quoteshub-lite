# 🗄️ Database Setup Guide - QuotesHub

## Database Schema for Auth Middleware

### Users Table Structure

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Profile Fields
    bio TEXT NULL,
    avatar VARCHAR(255) NULL,
    cover_image VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    location VARCHAR(255) NULL,
    
    -- Authorization & Status
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Statistics
    quotes_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    daily_streak INT DEFAULT 0,
    last_active_date DATE NULL,
    
    -- Timestamps
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    -- Indexes for Performance
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_is_verified (is_verified),
    INDEX idx_is_active (is_active)
);
```

---

## 🔑 Key Fields for Middleware Protection

### 1. `role` (ENUM)
**Purpose:** Role-based access control  
**Values:**
- `user` (default) - Regular user
- `moderator` - Can moderate content
- `admin` - Full system access

**Used by Middleware:**
- `admin` middleware checks: `role = 'admin'`
- `moderator` middleware checks: `role IN ('moderator', 'admin')`

---

### 2. `is_active` (BOOLEAN)
**Purpose:** Account suspension/ban system  
**Default:** `TRUE`  
**Values:**
- `TRUE` - Active account
- `FALSE` - Suspended/banned account

**Used by Middleware:**
- `EnsureUserIsActive` middleware checks this on every request
- If `FALSE`, user is logged out immediately

**Index:** Added for performance (checked on every authenticated request)

---

### 3. `is_verified` (BOOLEAN)
**Purpose:** Email verification status  
**Default:** `FALSE`  
**Values:**
- `TRUE` - Email verified
- `FALSE` - Email not verified

**Used by Middleware:**
- `verified` middleware (optional)
- Can restrict access to certain features

---

## 🌱 Database Seeding

### Test Users Created

Run: `php artisan db:seed --class=UserSeeder`

Creates 5 test users:

| Email | Password | Role | Active | Verified | Purpose |
|-------|----------|------|--------|----------|---------|
| admin@quoteshub.com | Admin123! | admin | ✅ | ✅ | Test admin features |
| moderator@quoteshub.com | Moderator123! | moderator | ✅ | ✅ | Test moderation |
| user@quoteshub.com | User123! | user | ✅ | ✅ | Test regular user |
| banned@quoteshub.com | Banned123! | user | ❌ | ✅ | Test banned user |
| unverified@quoteshub.com | Unverified123! | user | ✅ | ❌ | Test email verification |

---

## 📋 Setup Instructions

### Fresh Installation

```bash
# 1. Run migrations
php artisan migrate:fresh

# 2. Seed database with test users
php artisan db:seed

# 3. Verify users were created
php artisan tinker
>>> User::count()
=> 5

>>> User::where('role', 'admin')->first()->email
=> "admin@quoteshub.com"
```

### Production Setup

```bash
# 1. Run migrations only (no seeding)
php artisan migrate --force

# 2. Create admin user manually
php artisan tinker
>>> use App\Models\User;
>>> use Illuminate\Support\Facades\Hash;
>>> User::create([
...   'name' => 'Your Name',
...   'username' => 'yourusername',
...   'email' => 'your@email.com',
...   'password' => Hash::make('YourSecurePassword123!'),
...   'role' => 'admin',
...   'is_active' => true,
...   'is_verified' => true,
...   'email_verified_at' => now(),
... ]);
```

---

## 🔧 Common Database Operations

### Promote User to Admin

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

Or via Tinker:
```php
php artisan tinker
>>> $user = User::where('email', 'user@example.com')->first();
>>> $user->role = 'admin';
>>> $user->save();
```

---

### Ban/Suspend User

```sql
UPDATE users 
SET is_active = false 
WHERE email = 'spammer@example.com';
```

Or via Tinker:
```php
>>> $user = User::where('email', 'spammer@example.com')->first();
>>> $user->is_active = false;
>>> $user->save();
```

---

### Unban User

```sql
UPDATE users 
SET is_active = true 
WHERE email = 'user@example.com';
```

---

### Make User Moderator

```sql
UPDATE users 
SET role = 'moderator' 
WHERE email = 'user@example.com';
```

---

### Verify User Email

```sql
UPDATE users 
SET is_verified = true,
    email_verified_at = NOW()
WHERE email = 'user@example.com';
```

---

## 🧪 Testing Middleware with Database

### Test 1: Admin Access
```bash
# Login as admin
Email: admin@quoteshub.com
Password: Admin123!

# Try accessing admin route
GET /api/admin/stats

Expected: ✅ 200 OK
```

### Test 2: Non-Admin Access
```bash
# Login as regular user
Email: user@quoteshub.com
Password: User123!

# Try accessing admin route
GET /api/admin/stats

Expected: ❌ 403 Forbidden
```

### Test 3: Banned User
```bash
# Login as banned user
Email: banned@quoteshub.com
Password: Banned123!

# Try accessing any authenticated route
GET /dashboard

Expected: ❌ Logged out with error message
```

### Test 4: Moderator Access
```bash
# Login as moderator
Email: moderator@quoteshub.com
Password: Moderator123!

# Try accessing moderator route
GET /api/moderate/quotes

Expected: ✅ 200 OK (if route has moderator middleware)
```

---

## 📊 Database Queries for Monitoring

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### Find All Banned Users
```sql
SELECT id, name, email, role 
FROM users 
WHERE is_active = false;
```

### Find All Admins
```sql
SELECT id, name, email 
FROM users 
WHERE role = 'admin';
```

### Find Unverified Users
```sql
SELECT id, name, email, created_at 
FROM users 
WHERE is_verified = false 
ORDER BY created_at DESC;
```

---

## 🔄 Migration Commands

### Run Migrations
```bash
# Development
php artisan migrate

# Production (skip confirmation)
php artisan migrate --force

# Fresh start (drops all tables)
php artisan migrate:fresh

# Fresh with seeding
php artisan migrate:fresh --seed
```

### Rollback Migrations
```bash
# Rollback last batch
php artisan migrate:rollback

# Rollback specific steps
php artisan migrate:rollback --step=1

# Reset all migrations
php artisan migrate:reset
```

### Check Migration Status
```bash
php artisan migrate:status
```

---

## ⚠️ Important Notes

### Default Values
- New users are created with `role = 'user'`
- New users are `is_active = true` by default
- New users are `is_verified = false` (unless email verification disabled)

### Indexes
All critical fields have indexes for performance:
- `username` - Unique lookups
- `role` - Role-based queries
- `is_active` - Checked on every request
- `is_verified` - Email verification checks

### Security
- Never store passwords in plain text
- Always use `Hash::make()` for passwords
- Use `bcrypt` rounds = 12 (configured in `.env`)

---

## 🚨 Troubleshooting

### Issue: Migration fails
```bash
# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check migration status
php artisan migrate:status
```

### Issue: Seeder fails
```bash
# Run specific seeder
php artisan db:seed --class=UserSeeder

# Check for errors
php artisan tinker
>>> User::all();
```

### Issue: Can't login as admin
```sql
-- Verify admin exists
SELECT * FROM users WHERE role = 'admin';

-- Check password (should be hashed)
SELECT email, password FROM users WHERE role = 'admin';
```

---

## ✅ Database Checklist

- [x] Users table has `role` column (enum: user, moderator, admin)
- [x] Users table has `is_active` column (boolean, default true)
- [x] Users table has `is_verified` column (boolean, default false)
- [x] Indexes created on role, is_active, is_verified
- [x] UserSeeder creates test users with all roles
- [x] DatabaseSeeder includes UserSeeder
- [x] Migration tested and working
- [x] Seeder tested and working

---

**Status:** ✅ **DATABASE READY FOR MIDDLEWARE PROTECTION**  
**Last Updated:** 2026-01-26  
**Version:** 1.0
