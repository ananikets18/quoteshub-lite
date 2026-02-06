# Like/Save Persistence Issue - Fix Documentation

## Problem Summary

**Symptoms:**
- ✅ Local: Like/Save state + count change AND persist after page refresh
- ❌ Production: Like/Save state + count change BUT revert on page refresh

## Root Cause

The issue was **silent failure handling** in the like/save controllers. When database transactions failed in production:

1. Exception was caught and logged
2. HTTP response returned 200 OK (success)  
3. Frontend's optimistic update stayed in place
4. Database never actually saved the change
5. Page refresh showed real (unchanged) database state

### Why Production Failed More Often

Production environments typically have:
- Higher concurrency (more race conditions/deadlocks)
- Different database configuration (PostgreSQL vs SQLite)
- Connection pooling issues
- Network latency to database
- Resource constraints under load

## Changes Made

### 1. Web Controller ([QuoteController.php](../app/Http/Controllers/QuoteController.php))

**Before:**
```php
try {
    \DB::transaction(function () use ($quote, $user) {
        // ... transaction code
    });
} catch (\Exception $e) {
    \Log::error('Like toggle error', [...]);
    // ⚠️ No error returned to frontend
}
return back(); // Always returns success
```

**After:**
```php
try {
    \DB::transaction(function () use ($quote, $user) {
        // ... transaction code
    });
    
    // ✅ Refresh to ensure latest counts
    $quote->refresh();
    
} catch (\Exception $e) {
    \Log::error('Like toggle error', [
        'user_id' => $user->id,
        'quote_id' => $quote->id,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString() // ✅ Full stack trace
    ]);
    
    // ✅ Return error to frontend
    return back()->withErrors([
        'like' => 'Failed to update like. Please try again.'
    ]);
}

return back();
```

### 2. API Controller ([Api/QuoteController.php](../app/Http/Controllers/Api/QuoteController.php))

**Critical improvements:**
- ✅ Added `DB::transaction()` wrapper (was completely missing!)
- ✅ Added `lockForUpdate()` for row-level locking
- ✅ Changed from `create()` to `firstOrCreate()` (prevents duplicates)
- ✅ Added proper error responses (HTTP 500) instead of always returning 200
- ✅ Added `$quote->refresh()` to ensure fresh counts
- ✅ Added full error logging with stack traces

## Verification Steps

### 1. Check Production Logs

Look for errors that were previously being swallowed:

```bash
# On production server
tail -f storage/logs/laravel.log | grep "toggle error"
```

You should see entries like:
```
[2026-02-06 12:34:56] production.ERROR: Like toggle error
{"user_id":123,"quote_id":456,"error":"Deadlock detected","trace":"..."}
```

### 2. Monitor Database

```sql
-- PostgreSQL: Check for locks/deadlocks
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check for failed transactions
SELECT * FROM pg_stat_database WHERE datname = 'quoteshub';
```

### 3. Test in Production

After deploying the fix:

1. **Like a quote** - check network tab for:
   - Success: HTTP 200 with redirect
   - Error: HTTP 302 with error message
   
2. **Refresh page** - verify:
   - Like state matches database
   - Count is correct
   
3. **Rapid clicking** - test race conditions:
   - Click like 3-5 times rapidly
   - Refresh page
   - Should show correct final state (either liked or unliked)

### 4. Database Optimization (If Issues Persist)

If you still see transaction failures, optimize PostgreSQL:

**config/database.php** - Add to `pgsql` connection:
```php
'pgsql' => [
    // ... existing config
    
    'options' => [
        // Reduce lock wait timeout (default is 50s)
        PDO::ATTR_TIMEOUT => 5,
        
        // Enable prepared statements
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
    
    // Transaction isolation level
    'isolation_level' => 'READ COMMITTED', // or 'REPEATABLE READ'
],
```

**PostgreSQL server config** (`postgresql.conf`):
```ini
# Increase these if seeing many deadlocks
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB

# Lock management
deadlock_timeout = 1s
lock_timeout = 5000  # 5 seconds
```

## Additional Improvements to Consider

### 1. Add Retry Logic

For transient failures (deadlocks), implement automatic retry:

```php
use Illuminate\Support\Facades\DB;

$maxRetries = 3;
$attempt = 0;

while ($attempt < $maxRetries) {
    try {
        DB::transaction(function () use ($quote, $user) {
            // ... your transaction code
        });
        break; // Success!
        
    } catch (\Illuminate\Database\QueryException $e) {
        $attempt++;
        
        // Only retry on deadlock errors
        if ($e->getCode() === '40P01' && $attempt < $maxRetries) {
            usleep(100000 * $attempt); // Exponential backoff
            continue;
        }
        
        throw $e; // Re-throw non-retryable errors
    }
}
```

### 2. Add Unique Index (If Not Present)

Prevent duplicate likes/saves at database level:

```php
// database/migrations/xxxx_add_unique_indexes.php
Schema::table('likes', function (Blueprint $table) {
    $table->unique(['user_id', 'quote_id']);
});

Schema::table('saves', function (Blueprint $table) {
    $table->unique(['user_id', 'quote_id']);
});
```

### 3. Add Frontend Validation

Update QuoteCard.jsx to handle errors from backend:

```javascript
router.post(`/quotes/${quote.id}/like`, {}, {
    preserveState: true,
    preserveScroll: true,
    only: [], // Consider changing to ['quote'] to get fresh data
    onError: (errors) => {
        // Revert optimistic update
        const previousState = !isLiked;
        setIsLiked(previousState);
        setExpectedLiked(previousState);
        setLikesCount(previousState ? likesCount + 1 : likesCount - 1);
        
        showNotification(
            errors.like || 'Failed to update like. Please try again.',
            'error'
        );
    },
});
```

### 4. Add Database Monitoring

Set up alerts for:
- Transaction failure rate > 1%
- Lock wait time > 5 seconds
- Deadlock detection events

## Testing Checklist

- [ ] Deploy to production
- [ ] Monitor logs for "toggle error" entries
- [ ] Test like/save actions (single clicks)
- [ ] Test rapid clicking (race conditions)
- [ ] Verify page refresh shows correct state
- [ ] Check response times (should be < 500ms)
- [ ] Monitor database load and lock contention

## Rollback Plan

If issues persist after deployment:

1. **Immediate:** Revert controllers to previous version
2. **Check:** Review production logs for new error patterns
3. **Fix:** Apply database optimizations from section 4
4. **Test:** In staging environment before re-deploying

## Success Metrics

After deployment, you should see:
- ✅ Like/save success rate: > 99.9%
- ✅ Page refresh state consistency: 100%
- ✅ Response time: < 500ms (95th percentile)
- ✅ Zero silent failures (all errors logged with traces)
- ✅ Frontend error handling triggered on actual failures

---

**Status:** ✅ Fix Applied - Ready for Testing  
**Last Updated:** 2026-02-06  
**Priority:** HIGH - Affects core user engagement features
