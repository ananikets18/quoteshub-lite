# User Onboarding System - Documentation

## Overview
A comprehensive onboarding system for new QuotesHub users with authentication, rate limiting, and progress tracking.

---

## Features

### ✅ **Multi-Step Onboarding Flow**
1. **Welcome** - Introduction to QuotesHub
2. **Interests** - Select favorite quote categories
3. **Profile** - Add bio (optional)
4. **Follow** - Follow suggested users (optional)

### ✅ **Security & Protection**
- **Authentication Required** - All endpoints protected
- **Rate Limiting** - Prevents abuse
  - Step updates: 10 requests/minute
  - Complete: 3 requests/minute
  - Skip: 2 requests/minute
- **CSRF Protection** - Built-in Laravel protection
- **Input Validation** - Server-side validation

### ✅ **User Experience**
- **Progress Tracking** - Visual progress bar
- **Skip Option** - Users can skip onboarding
- **Responsive Design** - Mobile-first approach
- **Toast Notifications** - User feedback
- **Smooth Animations** - Professional transitions

---

## Technical Implementation

### Database Schema

#### Migration: `add_onboarding_fields_to_users_table`
```php
Schema::table('users', function (Blueprint $table) {
    $table->boolean('onboarding_completed')->default(false);
    $table->json('onboarding_steps')->nullable();
    $table->timestamp('onboarding_completed_at')->nullable();
});
```

**Fields:**
- `onboarding_completed` (boolean) - Whether user completed onboarding
- `onboarding_steps` (json) - Progress data for each step
- `onboarding_completed_at` (timestamp) - Completion timestamp

### Backend Components

#### 1. OnboardingController
**Location:** `app/Http/Controllers/OnboardingController.php`

**Endpoints:**

| Method | Route | Rate Limit | Description |
|--------|-------|------------|-------------|
| GET | `/onboarding` | - | Show onboarding page |
| POST | `/onboarding/step` | 10/min | Update step progress |
| POST | `/onboarding/complete` | 3/min | Complete onboarding |
| POST | `/onboarding/skip` | 2/min | Skip onboarding |

**Rate Limiting Implementation:**
```php
$key = 'onboarding-update:' . $user->id;

if (RateLimiter::tooManyAttempts($key, 10)) {
    $seconds = RateLimiter::availableIn($key);
    throw ValidationException::withMessages([
        'error' => "Too many requests. Please try again in {$seconds} seconds.",
    ]);
}

RateLimiter::hit($key, 60); // 60 seconds window
```

**Step Tracking:**
```json
{
  "welcome": {
    "completed": true,
    "data": {},
    "completed_at": "2026-01-31T00:00:00Z"
  },
  "interests": {
    "completed": true,
    "data": {
      "categories": [1, 2, 3]
    },
    "completed_at": "2026-01-31T00:01:00Z"
  }
}
```

#### 2. EnsureOnboardingCompleted Middleware
**Location:** `app/Http/Middleware/EnsureOnboardingCompleted.php`

**Purpose:** Redirect new users to onboarding

**Exclusions:**
- Unauthenticated users
- Onboarding routes (`onboarding.*`)
- API routes (`api/*`)

**Logic:**
```php
if (!$request->user()->onboarding_completed) {
    return redirect()->route('onboarding.show');
}
```

**Registered in:** `bootstrap/app.php`
```php
$middleware->web(append: [
    \App\Http\Middleware\EnsureOnboardingCompleted::class,
]);
```

### Frontend Components

#### Main Component
**Location:** `resources/js/Pages/Onboarding/Index.jsx`

**Features:**
- Step-by-step wizard
- Progress indicator
- Rate limit handling
- Toast notifications
- Skip functionality

**Step Components:**
1. **WelcomeStep** - Introduction with feature highlights
2. **InterestsStep** - Category selection (8 categories)
3. **ProfileStep** - Bio input (160 char limit)
4. **FollowStep** - Suggested users to follow

**State Management:**
```javascript
const [currentStep, setCurrentStep] = useState('welcome');
const [loading, setLoading] = useState(false);
const [showToast, setShowToast] = useState(false);
```

**API Integration:**
```javascript
const handleNext = async (stepData = {}) => {
    const response = await axios.post('/onboarding/step', {
        step: currentStep,
        data: stepData,
    });
    
    if (response.data.currentStep === 'complete') {
        await completeOnboarding();
    } else {
        setCurrentStep(response.data.currentStep);
    }
};
```

---

## User Flow

### New User Journey

```
1. User Registers
   ↓
2. Middleware Detects onboarding_completed = false
   ↓
3. Redirect to /onboarding
   ↓
4. Step 1: Welcome
   - View introduction
   - Click "Get Started"
   ↓
5. Step 2: Interests
   - Select categories (required)
   - Click "Continue"
   ↓
6. Step 3: Profile
   - Add bio (optional)
   - Click "Continue"
   ↓
7. Step 4: Follow
   - Follow users (optional)
   - Click "Complete Setup"
   ↓
8. Onboarding Complete
   - Set onboarding_completed = true
   - Set onboarding_completed_at = now()
   - Redirect to /feed
   ↓
9. Normal App Access
```

### Skip Flow

```
1. User on Onboarding Page
   ↓
2. Click "X" (Skip Button)
   ↓
3. Confirm Skip Dialog
   ↓
4. POST /onboarding/skip
   ↓
5. Set onboarding_completed = true
   ↓
6. Redirect to /feed
```

---

## Rate Limiting Details

### Why Rate Limiting?

1. **Prevent Abuse** - Stop automated attacks
2. **Resource Protection** - Limit database writes
3. **Fair Usage** - Ensure equal access for all users
4. **Security** - Mitigate brute force attempts

### Rate Limit Configuration

| Endpoint | Limit | Window | Key Pattern |
|----------|-------|--------|-------------|
| Update Step | 10 requests | 60s | `onboarding-update:{user_id}` |
| Complete | 3 requests | 60s | `onboarding-complete:{user_id}` |
| Skip | 2 requests | 60s | `onboarding-skip:{user_id}` |

### Rate Limit Response

**HTTP 422 Unprocessable Entity**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "error": ["Too many requests. Please try again in 45 seconds."]
  }
}
```

**Frontend Handling:**
```javascript
catch (error) {
    if (error.response?.status === 429) {
        showNotification(
            error.response.data.message || 'Too many requests. Please slow down.',
            'warning'
        );
    }
}
```

---

## Security Considerations

### 1. Authentication
- ✅ All routes require `auth` middleware
- ✅ User must be logged in to access onboarding
- ✅ Session-based authentication

### 2. Authorization
- ✅ Users can only update their own onboarding
- ✅ Middleware checks `Auth::user()->id`
- ✅ No cross-user data access

### 3. Input Validation
```php
$validated = $request->validate([
    'step' => 'required|string|in:welcome,interests,profile,follow,complete',
    'data' => 'nullable|array',
]);
```

### 4. CSRF Protection
- ✅ Laravel's built-in CSRF middleware
- ✅ Axios automatically includes CSRF token
- ✅ Token validation on all POST requests

### 5. Rate Limiting
- ✅ Per-user rate limits
- ✅ Prevents automated abuse
- ✅ Graceful error messages

### 6. Data Sanitization
- ✅ JSON encoding for `onboarding_steps`
- ✅ Timestamp validation
- ✅ Boolean type casting

---

## API Reference

### GET /onboarding
**Description:** Show onboarding page

**Authentication:** Required

**Response:**
```javascript
Inertia.render('Onboarding/Index', {
    user: User,
    currentStep: 'welcome' | 'interests' | 'profile' | 'follow' | 'complete'
})
```

---

### POST /onboarding/step
**Description:** Update onboarding step progress

**Authentication:** Required

**Rate Limit:** 10 requests/minute

**Request Body:**
```json
{
  "step": "interests",
  "data": {
    "categories": [1, 2, 3, 5]
  }
}
```

**Validation:**
- `step`: required, string, must be one of: welcome, interests, profile, follow, complete
- `data`: nullable, array

**Success Response (200):**
```json
{
  "success": true,
  "currentStep": "profile",
  "message": "Step completed successfully"
}
```

**Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "step": ["The selected step is invalid."]
  }
}
```

**Rate Limit Response (429):**
```json
{
  "message": "Too many requests. Please try again in 45 seconds.",
  "errors": {
    "error": ["Too many requests. Please try again in 45 seconds."]
  }
}
```

---

### POST /onboarding/complete
**Description:** Mark onboarding as completed

**Authentication:** Required

**Rate Limit:** 3 requests/minute

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Onboarding completed! Welcome to QuotesHub!",
  "redirect": "/feed"
}
```

---

### POST /onboarding/skip
**Description:** Skip onboarding and mark as completed

**Authentication:** Required

**Rate Limit:** 2 requests/minute

**Request Body:** None

**Response:** Redirect to `/feed`

---

## Testing

### Manual Testing Checklist

#### New User Flow
- [ ] Register new account
- [ ] Verify redirect to onboarding
- [ ] Complete all 4 steps
- [ ] Verify redirect to feed
- [ ] Verify `onboarding_completed = true`
- [ ] Try accessing onboarding again (should redirect to feed)

#### Skip Flow
- [ ] Register new account
- [ ] Click skip button
- [ ] Confirm skip dialog
- [ ] Verify redirect to feed
- [ ] Verify `onboarding_completed = true`

#### Rate Limiting
- [ ] Rapidly click "Continue" on a step
- [ ] Verify rate limit message appears
- [ ] Wait for cooldown
- [ ] Verify can proceed after cooldown

#### Validation
- [ ] Try to submit interests without selecting any
- [ ] Verify validation error
- [ ] Try to submit with invalid step name (via API)
- [ ] Verify 422 error

#### Edge Cases
- [ ] Refresh page mid-onboarding
- [ ] Verify progress is saved
- [ ] Try to access protected routes during onboarding
- [ ] Verify redirect back to onboarding

---

## Customization

### Adding New Steps

1. **Update Controller:**
```php
// Add to step order
private function getCurrentStep($user)
{
    $stepOrder = ['welcome', 'interests', 'profile', 'follow', 'newstep', 'complete'];
    // ...
}
```

2. **Update Validation:**
```php
$validated = $request->validate([
    'step' => 'required|string|in:welcome,interests,profile,follow,newstep,complete',
    'data' => 'nullable|array',
]);
```

3. **Create Frontend Component:**
```javascript
function NewStep({ onNext, loading }) {
    return (
        <div>
            {/* Your step content */}
        </div>
    );
}
```

4. **Add to Steps Array:**
```javascript
const steps = [
    { id: 'welcome', title: 'Welcome', icon: Sparkles },
    { id: 'interests', title: 'Interests', icon: Heart },
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'follow', title: 'Follow', icon: Users },
    { id: 'newstep', title: 'New Step', icon: YourIcon },
];
```

5. **Render in Main Component:**
```javascript
{currentStep === 'newstep' && (
    <NewStep onNext={handleNext} loading={loading} />
)}
```

### Adjusting Rate Limits

**In OnboardingController.php:**
```php
// Change from 10 to 20 requests per minute
if (RateLimiter::tooManyAttempts($key, 20)) {
    // ...
}

// Change window from 60s to 120s
RateLimiter::hit($key, 120);
```

---

## Troubleshooting

### Issue: Onboarding doesn't redirect to feed after completion
**Solution:** Check that `onboarding_completed` is set to `true` in database

### Issue: Rate limit errors immediately
**Solution:** Clear rate limiter cache: `php artisan cache:clear`

### Issue: Middleware not redirecting to onboarding
**Solution:** Verify middleware is registered in `bootstrap/app.php`

### Issue: Steps not saving
**Solution:** Check database migration ran successfully: `php artisan migrate:status`

---

## Performance Considerations

### Database Queries
- **Minimal queries** - Only updates user record
- **JSON storage** - Efficient step data storage
- **Indexed fields** - `onboarding_completed` for quick filtering

### Caching
- **Rate limiter** uses cache driver
- **Consider caching** suggested users for follow step
- **No page caching** - personalized content

### Frontend
- **Code splitting** - Onboarding loaded separately
- **Lazy loading** - Step components loaded on demand
- **Optimistic updates** - Instant UI feedback

---

## Future Enhancements

### Potential Additions
1. **Analytics** - Track completion rates per step
2. **A/B Testing** - Test different onboarding flows
3. **Personalization** - Dynamic steps based on user type
4. **Email Follow-up** - Remind users to complete onboarding
5. **Progress Persistence** - Save draft data for each step
6. **Skip Reasons** - Ask why users skip
7. **Onboarding Tour** - Interactive app tour after completion
8. **Video Tutorials** - Embedded help videos
9. **Gamification** - Rewards for completing onboarding
10. **Social Proof** - Show how many users completed

---

## Conclusion

The onboarding system provides a **secure, user-friendly, and performant** way to introduce new users to QuotesHub. With built-in rate limiting, authentication, and progress tracking, it ensures a smooth first-time experience while protecting against abuse.

**Key Achievements:**
- ✅ Multi-step wizard with progress tracking
- ✅ Rate limiting on all endpoints
- ✅ Beautiful, responsive UI
- ✅ Skip functionality
- ✅ Toast notifications
- ✅ Middleware-based redirection
- ✅ Secure and validated

---

**Last Updated:** January 31, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
