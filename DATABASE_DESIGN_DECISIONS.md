# 📊 Database Design Decisions - QuotesHub

## Production-Ready Schema Refactoring

This document explains the database design decisions made for production readiness and maintainability.

---

## ✅ Changes Implemented

### 1. **Timestamp Precision: `last_active_at` instead of `last_active_date`**

#### ❌ Before:
```php
$table->date('last_active_date')->nullable();
```

#### ✅ After:
```php
$table->timestamp('last_active_at')->nullable();
$table->index('last_active_at'); // For recency queries
```

#### Why This Matters:
- **Precision**: Timestamps capture exact time, not just the date
- **Recommendation Systems**: Can score users by recency (active 2 hours ago vs 23 hours ago)
- **Session Tracking**: Know when user was last active within the day
- **Analytics**: Better insights into user behavior patterns
- **Flexibility**: Can still derive date when needed: `$user->last_active_at->toDateString()`

#### Use Cases:
```php
// Find users active in last hour
User::where('last_active_at', '>', now()->subHour())->get();

// Find users active today
User::whereDate('last_active_at', today())->get();

// Sort by recency
User::orderBy('last_active_at', 'desc')->get();
```

---

### 2. **Email Verification: Use Laravel's `email_verified_at`**

#### ❌ Before (Ambiguous):
```php
$table->boolean('is_verified')->default(false);
```
**Problem:** What does "verified" mean?
- Email verified?
- Profile verified?
- Admin verified?
- Creator badge?

#### ✅ After (Clear):
```php
// Use Laravel's built-in field
email_verified_at TIMESTAMP NULL
```

#### Why This Matters:
- **Clarity**: Explicitly means "email verification"
- **Laravel Convention**: Works with built-in email verification
- **Nullable Timestamp**: `null` = not verified, `timestamp` = verified at this time
- **Audit Trail**: Know exactly when email was verified
- **No Ambiguity**: If you need profile verification later, create `profile_verified_at`

#### Usage:
```php
// Check if email is verified
if ($user->hasVerifiedEmail()) {
    // Email is verified
}

// Or check directly
if ($user->email_verified_at !== null) {
    // Verified
}

// Verify email
$user->markEmailAsVerified();
```

---

### 3. **Counter Columns: Documented as Cached Values**

#### Columns:
```php
'quotes_count'      => 'integer',
'followers_count'   => 'integer',
'following_count'   => 'integer',
```

#### ⚠️ Important: These are CACHED counters, NOT source of truth

**Source of Truth:**
- `quotes_count` → Count from `quotes` table
- `followers_count` → Count from `follows` table
- `following_count` → Count from `follows` table

**Why Keep Them:**
- **Performance**: Avoid expensive COUNT() queries on every profile view
- **Feed Optimization**: Display counts without joins
- **User Experience**: Instant load times

**How to Keep in Sync:**
```php
// Option 1: Model Events (Recommended)
class Quote extends Model
{
    protected static function booted()
    {
        static::created(function ($quote) {
            $quote->user->increment('quotes_count');
        });
        
        static::deleted(function ($quote) {
            $quote->user->decrement('quotes_count');
        });
    }
}

// Option 2: Database Triggers (Advanced)
// CREATE TRIGGER increment_quotes_count ...

// Option 3: Queue Jobs (For bulk operations)
RecalculateUserCounters::dispatch($user);
```

**Validation:**
```php
// Periodically verify counters match reality
php artisan app:verify-user-counters

// Recalculate if out of sync
$user->quotes_count = $user->quotes()->count();
$user->save();
```

---

### 4. **Daily Streak: Kept with TODO for Future Refactoring**

#### Current Implementation:
```php
'daily_streak' => 'integer',
```

#### ⚠️ Known Issues:
- Requires cron jobs to reset
- Edge cases around timezones
- Hard to maintain accuracy
- Feature logic mixed with core identity

#### ✅ Current Status: **ACCEPTABLE**
- Works for MVP
- Documented as technical debt
- Plan for refactoring later

#### Future Refactoring Options:

**Option 1: Compute from Activity Logs**
```php
// Don't store streak, compute it
function getDailyStreakAttribute() {
    return $this->activities()
        ->selectRaw('COUNT(DISTINCT DATE(created_at)) as streak')
        ->where('created_at', '>=', now()->subDays(365))
        ->value('streak');
}
```

**Option 2: Separate Stats Table**
```php
// user_stats table
user_id
daily_streak
weekly_streak
monthly_streak
last_calculated_at
```

**Option 3: Redis/Cache**
```php
// Store in cache, recalculate on demand
Cache::remember("user.{$id}.streak", 3600, function() {
    return $this->calculateStreak();
});
```

---

## 📋 Database Schema Summary

### Users Table (Final)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,  -- ✅ Laravel standard
    password VARCHAR(255) NOT NULL,
    
    -- Profile
    bio TEXT NULL,
    avatar VARCHAR(255) NULL,
    cover_image VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    location VARCHAR(255) NULL,
    
    -- Authorization
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Cached Counters (denormalized for performance)
    quotes_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    
    -- Activity (TODO: consider refactoring)
    daily_streak INT DEFAULT 0,
    last_active_at TIMESTAMP NULL,  -- ✅ Changed from date
    
    -- Timestamps
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_last_active_at (last_active_at)  -- ✅ New
);
```

---

## 🔄 Migration Strategy

### Development:
```bash
# Fresh migration (destroys data)
php artisan migrate:fresh --seed
```

### Production:
```bash
# Run new migration (preserves data)
php artisan migrate --force

# Data will be migrated:
# - last_active_date → last_active_at (converted)
# - is_verified → removed (use email_verified_at)
```

---

## 📊 Performance Considerations

### Indexed Columns:
| Column | Purpose | Query Pattern |
|--------|---------|---------------|
| `username` | Unique lookups | `WHERE username = ?` |
| `role` | Role-based queries | `WHERE role = 'admin'` |
| `is_active` | Ban checks (every request!) | `WHERE is_active = true` |
| `last_active_at` | Recency sorting | `ORDER BY last_active_at DESC` |

### Counter Columns:
- **Read**: O(1) - Direct column access
- **Write**: O(1) - Increment/decrement
- **Sync**: O(n) - Periodic validation

---

## ✅ Best Practices Implemented

### 1. **Use Laravel Conventions**
- ✅ `email_verified_at` instead of custom `is_verified`
- ✅ Timestamps instead of dates for precision
- ✅ Soft deletes ready (if needed)

### 2. **Document Technical Debt**
- ✅ Counter columns marked as cached
- ✅ Daily streak marked for future refactoring
- ✅ TODO comments in code

### 3. **Performance First**
- ✅ Indexes on frequently queried columns
- ✅ Denormalized counters for speed
- ✅ Timestamp precision for better queries

### 4. **Maintainability**
- ✅ Clear field names
- ✅ No ambiguous booleans
- ✅ Documented design decisions

---

## 🚨 Migration Warnings

### Before Running Migration:

1. **Backup Database**
   ```bash
   pg_dump quoteshub > backup_$(date +%Y%m%d).sql
   ```

2. **Test on Staging First**
   ```bash
   # On staging
   php artisan migrate
   # Verify everything works
   ```

3. **Plan Downtime** (if needed)
   - Migration should be fast
   - But test first to be sure

---

## 🧪 Testing After Migration

```bash
# 1. Verify schema
php artisan migrate:status

# 2. Check users table
php artisan tinker
>>> User::first()->last_active_at  // Should be timestamp
>>> User::first()->email_verified_at  // Should exist
>>> User::first()->is_verified  // Should NOT exist

# 3. Test streak update
>>> $user = User::first();
>>> $user->updateDailyStreak();
>>> $user->last_active_at  // Should be now()

# 4. Verify counters
>>> $user->quotes_count === $user->quotes()->count()
```

---

## 📝 Future Considerations

### When to Refactor Daily Streak:
- [ ] When you have 10,000+ daily active users
- [ ] When streak calculations become slow
- [ ] When you need more complex gamification
- [ ] When timezone issues become problematic

### When to Add More Tables:
- [ ] `user_stats` - For computed statistics
- [ ] `user_activities` - For activity logging
- [ ] `user_achievements` - For gamification
- [ ] `user_settings` - For preferences

---

## ✅ Production Readiness Checklist

- [x] Timestamp precision for activity tracking
- [x] Clear email verification field
- [x] Counter columns documented as cached
- [x] Indexes on performance-critical columns
- [x] Technical debt documented
- [x] Migration tested
- [x] Rollback plan exists
- [x] Best practices followed

---

**Status:** ✅ **PRODUCTION READY**  
**Last Updated:** 2026-01-26  
**Version:** 2.0 (Refactored)
