# QuotesHub Route Names Reference

## ✅ Correct Route Names (Use These)

### Main Pages
- `home` - Homepage (/)
- `feed` - Main feed (/feed)
- `topics.index` - Explore page (/topics)
- `search` - Search page (/search)

### Authentication
- `login` - Login page
- `register` - Register page
- `logout` - Logout action

### Quotes
- `quotes.show` - View single quote (/quotes/{id})
- `quotes.create` - Create quote page (/quotes/create)
- `quotes.store` - Store new quote (POST)
- `quotes.edit` - Edit quote page (/quotes/{id}/edit)
- `quotes.update` - Update quote (PUT)
- `quotes.destroy` - Delete quote (DELETE)
- `quotes.like` - Like/unlike quote (POST)
- `quotes.save` - Save/unsave quote (POST)

### Categories & Tags
- `category.show` - View category (/category/{slug})
- `tag.show` - View tag (/tag/{name})

### User Profile
- `profile.show` - View user profile (/profile/{username})
- `profile.edit` - Edit profile page
- `profile.update` - Update profile (PATCH)

### User Features
- `dashboard` - User dashboard
- `saved` - Saved quotes page (/saved)
- `notifications` - Notifications page (/notifications)
- `settings` - Settings page (/settings)
- `achievements` - Achievements page

### Social
- `follow.store` - Follow user
- `follow.destroy` - Unfollow user

### Admin
- `admin.dashboard` - Admin dashboard
- `admin.users.index` - User management
- `admin.quotes.index` - Quote moderation
- `admin.reports.index` - Reports

### API Routes (Session-based auth)
- `api.notifications.index` - Get notifications
- `api.notifications.unread-count` - Get unread count
- `api.notifications.mark-all-read` - Mark all as read
- `api.notifications.mark-as-read` - Mark one as read
- `api.notifications.destroy` - Delete notification
- `activity.feed` - Activity feed
- `activity.trending` - Trending quotes
- `activity.suggested` - Suggested users

---

## ❌ DO NOT USE (These routes don't exist)

- `quotes.index` ❌ (Use `feed` or `topics.index` instead)
- `categories.index` ❌ (Use `search` or `topics.index` instead)
- `notifications.index` ❌ (Use `notifications` instead)
- `settings.index` ❌ (Use `settings` instead)
- `profile.saved` ❌ (Use `saved` instead)

---

## 📝 Usage Examples

### Blade Templates
```blade
<!-- Feed -->
<a href="{{ route('feed') }}">Feed</a>

<!-- Single Quote -->
<a href="{{ route('quotes.show', $quote) }}">View Quote</a>

<!-- User Profile -->
<a href="{{ route('profile.show', $user->username) }}">Profile</a>

<!-- Category -->
<a href="{{ route('category.show', $category->slug) }}">Category</a>

<!-- Create Quote -->
<a href="{{ route('quotes.create') }}">Create Quote</a>
```

### JavaScript (API calls)
```javascript
// Get notifications
await axios.get('/api/notifications');

// Mark as read
await axios.post(`/api/notifications/${id}/read`);

// Like quote
await axios.post(`/api/quotes/${quoteId}/like`);
```

---

## 🔍 How to Find Route Names

```bash
# List all routes
php artisan route:list

# Search for specific route
php artisan route:list | grep "quotes"

# Search with name
php artisan route:list --name=quotes
```

---

**Last Updated:** February 19, 2026
