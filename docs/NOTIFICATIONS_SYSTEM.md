# 🔔 Notifications System Documentation - QuotesHub

## Overview
Complete notification system implementation with real-time updates, notification bell with badge counter, and comprehensive notification management.

---

## ✅ What's Implemented

### 1. **Database Structure**

#### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,           -- Recipient
    actor_id BIGINT NULL,              -- Who triggered it
    type VARCHAR(255) NOT NULL,        -- Notification type
    data JSON NULL,                    -- Additional context
    read_at TIMESTAMP NULL,            -- When marked as read
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_read (user_id, read_at),
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_type (type)
);
```

---

### 2. **Notification Types**

#### Available Types:
1. **`new_follower`** - Someone followed you
2. **`quote_liked`** - Someone liked your quote
3. **`quote_saved`** - Someone saved your quote
4. **`comment_added`** - Someone commented on your quote (ready for comments feature)
5. **`achievement_unlocked`** - You unlocked an achievement
6. **`admin_warning`** - Admin warning message
7. **`quote_removed`** - Admin removed your quote
8. **`quote_featured`** - Your quote was featured

---

### 3. **Backend Components**

#### NotificationService
**Location:** `app/Services/NotificationService.php`

**Methods:**
```php
notifyNewFollower($follower, $followedUser)
notifyQuoteLiked($liker, $quote)
notifyQuoteSaved($saver, $quote)
notifyCommentAdded($commenter, $quote, $commentContent)
notifyAchievementUnlocked($user, $achievementName, $description)
notifyAdminWarning($user, $reason, $admin)
notifyQuoteRemoved($user, $quote, $reason, $admin)
notifyQuoteFeatured($user, $quote)
deleteQuoteNotifications($quote)
markAllAsRead($user)
getUnreadCount($user)
```

**Features:**
- Prevents duplicate notifications (5-minute cooldown)
- Doesn't notify users for their own actions
- Automatic cleanup when quotes are deleted

---

#### NotificationController
**Location:** `app/Http/Controllers/Api/NotificationController.php`

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get paginated notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| POST | `/api/notifications/{id}/read` | Mark notification as read |
| POST | `/api/notifications/mark-all-read` | Mark all as read |
| DELETE | `/api/notifications/{id}` | Delete a notification |
| DELETE | `/api/notifications/read/all` | Delete all read notifications |

**Query Parameters:**
- `per_page` - Items per page (default: 20)
- `unread_only` - Filter unread (1/0)
- `type` - Filter by notification type

---

### 4. **Frontend Components (Blade + Alpine)**

#### Sidebar / Topbar Notification Badge
**Location:** `resources/views/layouts/navigation.blade.php`

**Features:**
- Notification bell with unread badge in desktop and mobile navigation
- Badge count fetches unread count from `/api/notifications/unread-count`
- Supports `9+` display for higher counts

---

#### Alpine Notification State
**Location:** `resources/js/components/notifications.js`

**Features:**
- Polls notifications and unread count every 30 seconds
- Mark all as read
- Delete individual notifications
- Bulk delete read notifications
- Route navigation helpers for notification targets

---

#### Notifications Page
**Location:** `resources/views/notifications.blade.php`
**Route:** `/notifications`

**Features:**
- Full-page notification list
- Mark all as read
- Delete individual notifications
- Click to navigate to related content
- Empty and loading states
- Responsive Blade layout

---

### 5. **Integration Points**

#### Automatically Triggered When:

**FollowController:**
```php
// When someone follows a user
app(NotificationService::class)->notifyNewFollower($follower, $followedUser);
```

**QuoteController:**
```php
// When someone likes a quote
app(NotificationService::class)->notifyQuoteLiked($user, $quote);

// When someone saves a quote
app(NotificationService::class)->notifyQuoteSaved($user, $quote);
```

**AdminController:**
```php
// When admin removes a quote
app(NotificationService::class)->notifyQuoteRemoved($quoteOwner, $quote, $reason, $admin);

// When admin warns a user
app(NotificationService::class)->notifyAdminWarning($user, $reason, $admin);

// When quote is featured
app(NotificationService::class)->notifyQuoteFeatured($user, $quote);
```

---

## 🎨 UI/UX Features

### Notification Bell Badge
- Red circular badge with white text
- Shows count up to 9, then "9+"
- Pulse animation for new notifications
- Disappears when count is 0

### Notification Icons
Each type has a unique icon and color:
- 💙 New Follower - Blue (UserPlus icon)
- ❤️ Quote Liked - Red (Heart icon)
- 💜 Quote Saved - Purple (Bookmark icon)
- 💚 Comment Added - Green (MessageCircle icon)
- 💛 Achievement - Yellow (Trophy icon)
- 🧡 Admin Warning - Orange (AlertTriangle icon)
- 🔴 Quote Removed - Red (XCircle icon)
- ⭐ Featured - Yellow (Star icon)

### Dark Mode Support
All components fully support dark mode with proper color schemes.

---

## 📱 User Experience Flow

### Receiving a Notification:
1. User performs action (like, save, follow)
2. Notification created in database
3. Bell badge updates (within 30s or on page refresh)
4. User clicks bell → sees notification in dropdown
5. User clicks notification → navigates to related content
6. Notification marked as read automatically

### Managing Notifications:
1. Click bell → quick view (15 recent)
2. Click "View all" → full page with filters
3. Mark individual as read
4. Mark all as read
5. Delete individual or all read
6. Filter unread only

---

## 🔧 Configuration

### Polling Interval
Configured in `resources/js/components/notifications.js`:
```javascript
this.pollInterval = setInterval(() => {
   this.fetchNotifications();
}, 30000);
```

### Notifications Per Page
API default: 20 (adjustable via `per_page` parameter)
Dropdown: 15 (hardcoded)

### Duplicate Prevention
Service prevents duplicate notifications within 5 minutes for like/save actions.

---

## 🧪 Testing Guide

### Manual Testing:

1. **Test New Follower Notification:**
   - Login as User A
   - Login as User B in incognito
   - User B follows User A
   - Check User A's notifications

2. **Test Quote Liked:**
   - User B likes User A's quote
   - Check User A's notifications
   - Verify notification shows quote preview

3. **Test Mark as Read:**
   - Click a notification
   - Verify blue dot disappears
   - Verify badge count decreases

4. **Test Admin Actions:**
   - Login as admin
   - Remove a user's quote with reason
   - Check user's notifications

5. **Test Real-time Updates:**
   - Open notifications in one tab
   - Trigger action in another tab
   - Wait 30s and verify badge updates

### Database Queries:
```sql
-- Check all notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

-- Check unread count for user
SELECT COUNT(*) FROM notifications WHERE user_id = 1 AND read_at IS NULL;

-- Check notification types distribution
SELECT type, COUNT(*) FROM notifications GROUP BY type;
```

---

## 🚀 Future Enhancements

### Ready to Implement:
- [ ] WebSocket integration for real-time updates (Pusher/Laravel Echo)
- [ ] Email notifications (daily digest)
- [ ] Push notifications (PWA)
- [ ] Notification preferences (per-type toggle)
- [ ] Group similar notifications ("John and 5 others liked your quote")
- [ ] Mark as unread option
- [ ] Notification sound/vibration
- [ ] Keyboard shortcuts (Mark all as read: Ctrl+Shift+R)

### Architecture for WebSockets:
```php
// In NotificationService
use Illuminate\Support\Facades\Broadcast;

public function notifyQuoteLiked($liker, $quote) {
    $notification = Notification::create([...]);
    
    // Broadcast to user's private channel
    broadcast(new NotificationReceived($notification))->toOthers();
}
```

---

## 📊 Performance Considerations

### Indexes Created:
```sql
INDEX idx_user_read (user_id, read_at)      -- Fast unread queries
INDEX idx_user_created (user_id, created_at) -- Fast recent queries
INDEX idx_type (type)                        -- Fast type filtering
```

### Query Optimization:
- Notifications are paginated (20/page)
- Dropdown loads only 15 recent
- Polling interval prevents excessive requests
- Eager loading of actor relationship
- JSON data field for flexible storage

### Cleanup Strategy:
- Consider auto-delete read notifications after 90 days
- Archive old notifications to separate table
- Implement in scheduled command:
```php
php artisan notifications:cleanup
```

---

## 🎯 Success Metrics

### What to Monitor:
- Average unread count per user
- Notification click-through rate
- Time to mark as read
- Most common notification types
- Notification volume per day
- User engagement after receiving notification

### Analytics Queries:
```sql
-- Average response time (time to read)
SELECT AVG(TIMESTAMPDIFF(SECOND, created_at, read_at)) as avg_seconds
FROM notifications WHERE read_at IS NOT NULL;

-- Most engaging notification types
SELECT type, COUNT(*) as total, 
       SUM(CASE WHEN read_at IS NOT NULL THEN 1 ELSE 0 END) as read_count
FROM notifications 
GROUP BY type;
```

---

## ✅ Checklist for Production

- [x] Database migration run
- [x] Models created with relationships
- [x] Service class implemented
- [x] API endpoints secured with auth
- [x] Frontend components created
- [x] Notification triggers integrated
- [x] Dark mode support
- [x] Mobile responsive design
- [ ] Write feature tests
- [ ] Set up monitoring/logging
- [ ] Configure cleanup job
- [ ] Add to deployment checklist
- [ ] Update API documentation

---

## 🐛 Troubleshooting

### Badge not updating?
- Check if polling is working (Network tab)
- Verify API endpoint returns correct count
- Check if user is authenticated

### Notifications not appearing?
- Check database: `SELECT * FROM notifications WHERE user_id = X`
- Verify trigger is being called (add logging)
- Check duplicate prevention logic

### Dropdown not showing?
- Check z-index conflicts
- Verify click handler attached
- Check for JavaScript errors in console

---

## 📚 Related Documentation
- [API_RECOMMENDATIONS.md](API_RECOMMENDATIONS.md)
- [USER_MANAGEMENT.md](USER_MANAGEMENT.md)
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

**Last Updated:** January 29, 2026
**Status:** ✅ Production Ready
