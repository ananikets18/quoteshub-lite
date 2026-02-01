# 🔒 Auth Middleware Protection - QuotesHub

## Overview

This document explains the authentication and authorization middleware protecting your application.

---

## 🛡️ Middleware Types

### 1. **Authentication Middleware**

#### `auth` (Laravel Built-in)
**Purpose:** Ensures user is logged in  
**Redirects to:** Login page if not authenticated  
**Usage:**
```php
Route::middleware('auth')->group(function () {
    // Protected routes
});
```

#### `auth:sanctum` (API Authentication)
**Purpose:** Validates API token for API routes  
**Returns:** 401 Unauthorized if no valid token  
**Usage:**
```php
Route::middleware('auth:sanctum')->group(function () {
    // Protected API routes
});
```

---

### 2. **Authorization Middleware (Custom)**

#### `admin`
**Purpose:** Restricts access to admin users only  
**Checks:** `user->isAdmin()` returns true  
**Response:** 403 Forbidden if not admin  
**Usage:**
```php
Route::middleware(['auth', 'admin'])->group(function () {
    // Admin-only routes
});
```

**User Roles:**
- `admin` - Full access ✅
- `moderator` - Denied ❌
- `user` - Denied ❌

---

#### `moderator`
**Purpose:** Restricts access to moderators and admins  
**Checks:** `user->isModerator()` returns true  
**Response:** 403 Forbidden if not moderator/admin  
**Usage:**
```php
Route::middleware(['auth', 'moderator'])->group(function () {
    // Moderator routes
});
```

**User Roles:**
- `admin` - Allowed ✅
- `moderator` - Allowed ✅
- `user` - Denied ❌

---

#### `active`
**Purpose:** Ensures user account is not suspended/banned  
**Checks:** `user->is_active` is true  
**Action:** Logs out user if inactive  
**Applied:** Globally to all authenticated routes  

**Behavior:**
```php
if (!$user->is_active) {
    // 1. Logout user
    // 2. Invalidate session
    // 3. Redirect to login with error message
}
```

---

### 3. **Security Middleware (Custom)**

#### `prevent.back`
**Purpose:** Prevents browser caching of authenticated pages  
**Headers Set:**
- `Cache-Control: no-cache, no-store, must-revalidate`
- `Pragma: no-cache`
- `Expires: Sat, 01 Jan 2000 00:00:00 GMT`

**Prevents:**
- Viewing cached dashboard after logout
- Back button showing sensitive data
- Session fixation attacks

**Applied:** Globally to all web routes

---

### 4. **Laravel Built-in Middleware**

#### `guest`
**Purpose:** Redirects authenticated users away from login/register  
**Redirects to:** Dashboard  
**Applied to:** Login, Register, Password Reset pages

#### `verified`
**Purpose:** Ensures email is verified (if email verification enabled)  
**Redirects to:** Email verification notice  
**Usage:**
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Requires verified email
});
```

---

## 📋 Route Protection Examples

### Web Routes

```php
// Public routes (no auth required)
Route::get('/', [FeedController::class, 'index']);
Route::get('/quotes/{id}', [QuoteController::class, 'show']);

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/quotes/create', [QuoteController::class, 'create']);
    Route::get('/profile', [ProfileController::class, 'edit']);
});

// Admin-only routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/users', [AdminController::class, 'users']);
});

// Moderator routes
Route::middleware(['auth', 'moderator'])->group(function () {
    Route::get('/moderate/quotes', [ModerateController::class, 'quotes']);
});
```

### API Routes

```php
// Public API routes
Route::get('/api/quotes', [QuoteController::class, 'index']);
Route::get('/api/users/{username}', [UserController::class, 'show']);

// Authenticated API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/api/quotes', [QuoteController::class, 'store']);
    Route::get('/api/me', [UserController::class, 'me']);
    
    // Admin API routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/quotes/pending', [AdminController::class, 'pendingQuotes']);
        Route::post('/users/{id}/ban', [AdminController::class, 'banUser']);
    });
});
```

---

## 🧪 Testing Middleware Protection

### Test 1: Unauthenticated Access
```bash
# Try accessing protected route without login
curl http://localhost:8000/dashboard

Expected: Redirect to /login
```

### Test 2: Non-Admin Accessing Admin Route
```bash
# Login as regular user, try admin route
curl -H "Authorization: Bearer {user_token}" \
     http://localhost:8000/api/admin/users

Expected: 403 Forbidden
```

### Test 3: Inactive User
```bash
# Set user->is_active = false in database
# Try to access any authenticated route

Expected: Logged out, redirected to login with error
```

### Test 4: Back Button After Logout
```bash
# 1. Login
# 2. Visit dashboard
# 3. Logout
# 4. Press browser back button

Expected: Login page shown (not cached dashboard)
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Always use `auth` middleware for protected routes
- Use `admin` middleware for admin-only routes
- Check user roles in controllers as secondary validation
- Log authorization failures for security monitoring
- Use `auth:sanctum` for API routes

### ❌ DON'T:
- Rely only on frontend hiding (always protect backend)
- Forget to check `is_active` status
- Allow regular users to access admin routes
- Skip middleware on "internal" routes

---

## 📊 Current Route Protection Status

### Web Routes:
| Route | Middleware | Access Level |
|-------|-----------|--------------|
| `/` | None | Public |
| `/feed` | None | Public |
| `/login` | `guest` | Guests only |
| `/register` | `guest` | Guests only |
| `/dashboard` | `auth`, `verified` | Authenticated |
| `/quotes/create` | `auth` | Authenticated |
| `/profile` | `auth` | Authenticated |

### API Routes:
| Route | Middleware | Access Level |
|-------|-----------|--------------|
| `GET /api/quotes` | None | Public |
| `POST /api/quotes` | `auth:sanctum` | Authenticated |
| `GET /api/me` | `auth:sanctum` | Authenticated |
| `GET /api/admin/*` | `auth:sanctum`, `admin` | Admin only |

---

## 🚨 Common Issues & Solutions

### Issue: "403 Forbidden" for admin routes
**Cause:** User doesn't have admin role  
**Solution:** Check `users` table, ensure `role = 'admin'`
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Issue: Logged out unexpectedly
**Cause:** `is_active` set to false  
**Solution:** Check user status
```sql
SELECT id, email, is_active FROM users WHERE email = 'user@example.com';
UPDATE users SET is_active = true WHERE id = 1;
```

### Issue: Can access admin routes without being admin
**Cause:** Middleware not applied  
**Solution:** Check route has `->middleware('admin')`

### Issue: API returns 401 Unauthorized
**Cause:** No valid Sanctum token  
**Solution:** Ensure token is sent in Authorization header
```bash
Authorization: Bearer {your_token_here}
```

---

## 🔄 Middleware Execution Order

```
Request
  ↓
1. PreventBackHistory (cache headers)
  ↓
2. EnsureUserIsActive (check if banned)
  ↓
3. auth (check if logged in)
  ↓
4. admin/moderator (check role if needed)
  ↓
Controller
  ↓
Response
```

---

## 📝 Adding New Protected Routes

### Example: Adding a Creator Dashboard

```php
// routes/web.php
Route::middleware(['auth'])->group(function () {
    Route::get('/creator/dashboard', [CreatorController::class, 'dashboard'])
        ->name('creator.dashboard');
});
```

### Example: Adding Moderator-Only Route

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'moderator'])->group(function () {
    Route::get('/moderate/reports', [ModerateController::class, 'reports']);
});
```

---

## ✅ Middleware Protection Checklist

- [x] Authentication middleware (`auth`) applied to protected routes
- [x] API authentication (`auth:sanctum`) on API routes
- [x] Admin middleware protecting admin routes
- [x] Moderator middleware for moderation features
- [x] Active user check preventing banned users
- [x] Guest middleware on login/register
- [x] Cache prevention on authenticated pages
- [x] Email verification middleware (optional)
- [x] All middleware registered in `bootstrap/app.php`
- [x] Proper error responses (401, 403)

---

**Status:** ✅ **PRODUCTION READY**  
**Last Updated:** 2026-01-26  
**Version:** 1.0
