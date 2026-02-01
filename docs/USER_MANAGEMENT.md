# 👤 User Management Implementation (Core)

## Overview
This document details the core user management features implemented in QuotesHub.

---

## ✅ Features Implemented

### 1. **Get Authenticated User**
- **Endpoint:** `GET /api/me`
- **Controller:** `UserController@me`
- **Response:** JSON object of logged-in user with achievements loaded.
- **Security:** Requires `auth:sanctum`

### 2. **Update Profile**
- **Endpoint:** `PUT /api/me` (API) / `PATCH /profile` (Web)
- **Features:**
  - Updates name, username, bio, website, location
  - Unique username validation (ignoring current user)
  - URL validation for website
- **Security:** 
  - Validates all inputs
  - Protected by `auth` middleware

### 3. **Change Password**
- **Endpoint:** `PUT /api/me/password` (API) / `PUT /password` (Web)
- **Flow:**
  1. Verify current password (`Hash::check`)
  2. Validate new password (min 8 chars, mixed case, confirmed)
  3. Update password hash
  4. **Regenerate Session** (Security best practice)
- **Security:** Prevents session fixation attacks

### 4. **Upload Avatar & Cover**
- **Endpoint:** `POST /api/me/avatar` & `POST /api/me/cover`
- **Controller:** `AvatarController`
- **Features:**
  - Validates strict file types (images only)
  - Size limits: 2MB (Avatar), 5MB (Cover)
  - **Auto-deletion**: Old files deleted when replaced
  - Secure storage in `public` disk

### 5. **Email Verification Enforcement**
- **Mechanism:** `verified` middleware applied to ALL protected routes
- **Behavior:**
  - User can login (unverified)
  - Accessing `/dashboard`, `/profile`, `/quotes/create` → **Redirects to Verification Notice**
  - **Why not block login?** Better UX. Allows users to resend verification email if lost.
- **Database:** Uses `email_verified_at` timestamp

---

## 🧪 Testing Instructions

### **Test 1: Profile Update**
```bash
# Update profile via API
curl -X PUT http://localhost:8000/api/me \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"bio": "New bio", "website": "https://example.com"}'
```

### **Test 2: Password Change**
```bash
# Change password
curl -X PUT http://localhost:8000/api/me/password \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "OldPassword123!",
    "password": "NewPassword123!",
    "password_confirmation": "NewPassword123!"
  }'
```

### **Test 3: Avatar Upload**
```bash
# Upload avatar
curl -X POST http://localhost:8000/api/me/avatar \
  -H "Authorization: Bearer {token}" \
  -F "avatar=@/path/to/image.jpg"
```

### **Test 4: Unverified User Access**
1. Login as unverified user (`unverified@quoteshub.com`)
2. Try to create quote (`/quotes/create`)
3. Expected: Redirect to `/verify-email` page

---

## 🔒 Security Checklist

- [x] **Current Password Check**: Required before password change
- [x] **Session Regeneration**: After password change
- [x] **File Validation**: Strict MIME type and size checks for uploads
- [x] **Path Traversal Protection**: Laravel storage handles filenames securely
- [x] **Old File Cleanup**: Prevents storage bloat
- [x] **Email Verification**: Enforced on critical actions

---

**Status:** ✅ **user-management-core-complete**
