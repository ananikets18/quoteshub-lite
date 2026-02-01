# Content Moderation System

## 🛡️ Overview

QuotesHub implements a comprehensive content moderation system to maintain quality and prevent abuse. The system includes:

- ✅ **Profanity Filtering** - Blocks inappropriate language
- ✅ **Spam Detection** - Identifies and blocks spam content
- ✅ **URL Detection** - Flags content with links
- ✅ **Rate Limiting** - Prevents spam posting
- ✅ **User Trust Scoring** - Rewards good behavior, restricts bad actors

---

## 📊 User Trust Score System

### **How Trust Scores Work**

Every user has a trust score from **0-100**:
- **80-100**: Excellent (Trusted contributor)
- **60-79**: High (Reliable user)
- **40-59**: Medium (Average user)
- **20-39**: Low (New or flagged user)
- **0-19**: Very Low (Restricted user)

### **Trust Score Calculation**

**Positive Factors:**
- ✅ Account age: +1 per week (max +20)
- ✅ Quote count: +1 per 2 quotes (max +15)
- ✅ Total likes received: +1 per 10 likes (max +10)
- ✅ Follower count: +1 per 5 followers (max +10)
- ✅ Email verified: +5

**Negative Factors:**
- ❌ Admin warnings: -10 per warning
- ❌ Removed quotes: -15 per removed quote

**Example:**
```
New user (1 day old, email verified):
Base: 50
Email verified: +5
Total: 55 (Medium trust)

Established user (60 days, 20 quotes, 100 likes, 25 followers):
Base: 50
Account age: +8 (60 days / 7)
Quotes: +10 (20 / 2)
Likes: +10 (100 / 10)
Followers: +5 (25 / 5)
Email verified: +5
Total: 88 (Excellent trust)
```

---

## 🚦 Rate Limiting

### **Quote Creation Limits**

Limits vary based on trust score:

| Trust Score | Limit | Time Window |
|------------|-------|-------------|
| 70-100 (High) | 20 quotes | per hour |
| 40-69 (Medium) | 10 quotes | per hour |
| 0-39 (Low) | 5 quotes | per hour |

**Example:**
- User with trust score 85 can post 20 quotes per hour
- User with trust score 45 can post 10 quotes per hour
- User with trust score 25 can post 5 quotes per hour

---

## 🚫 Content Filtering

### **1. Profanity Filter**

**Blocks content containing:**
- Common profanity and offensive language
- Uses word boundaries to avoid false positives
- Checks quote content, author name, and source

**User Experience:**
```
❌ Quote contains: "This is a f*cking great quote"
Error: "Your quote contains inappropriate language. Please revise and try again."
```

### **2. Spam Detection**

**Flags content as spam if it contains:**
- Spam keywords: "click here", "buy now", "free money", etc.
- Excessive capitalization (>50% caps)
- Excessive punctuation (!!!, ???)
- Excessive special characters

**Spam Score Calculation:**
- Spam keyword found: +2 points
- Excessive caps: +1 point
- Excessive punctuation: +1 point
- Excessive special chars: +1 point
- **Threshold**: 3+ points = spam

**User Experience:**
```
❌ Quote: "CLICK HERE TO WIN FREE MONEY!!!"
Error: "Your quote appears to be spam. Please ensure you're posting genuine quotes."
```

### **3. URL Detection**

**Detects URLs and links:**
- http://, https://
- www.
- Common TLDs (.com, .net, .org, .io, .co)
- URL shorteners (bit.ly, tinyurl)

**User Experience:**
```
⚠️ Quote contains: "Check out www.example.com for more"
Warning: "Note: Your quote contains URLs. It may be reviewed by moderators."
(Still allowed, but flagged)
```

---

## 🔄 Moderation Workflow

### **Quote Creation Flow**

```
1. User submits quote
   ↓
2. Check rate limit
   ├─ Exceeded? → Error: "You've reached your quote limit"
   └─ OK → Continue
   ↓
3. Validate content
   ├─ Profanity? → Error: "Contains inappropriate language"
   ├─ Spam? → Error: "Appears to be spam"
   ├─ URLs? → Warning: "May be reviewed"
   └─ Clean → Continue
   ↓
4. Create quote (auto-approved)
   ↓
5. Success!
```

### **Quote Editing Flow**

Same validation applies to edits to prevent users from:
- Adding profanity after approval
- Editing to include spam
- Bypassing moderation

---

## 🎯 API Endpoints

### **Get User Moderation Info**
```http
GET /api/moderation/info
Authorization: Bearer {token}

Response:
{
  "trust_score": 75,
  "is_low_trust": false,
  "trust_level": "High",
  "rate_limit": {
    "limit": 10,
    "used": 3,
    "remaining": 7,
    "time_window_minutes": 60
  }
}
```

### **Validate Content**
```http
POST /api/moderation/validate
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Your quote text here"
}

Response:
{
  "valid": true,
  "issues": [],
  "flags": [],
  "should_auto_approve": true
}
```

---

## 📋 Admin Tools

### **Report System**

Users can report problematic content:
- **Reasons**: spam, inappropriate, harassment, misinformation, copyright, other
- **Admin actions**: dismiss, warn, remove
- **Tracking**: Who reported, when, admin notes

### **Admin Dashboard**

Located at `/admin/reports`:
- View all reports (pending, reviewed, dismissed)
- See reported quote content
- Take action (warn user or remove quote)
- Add admin notes
- Track review history

---

## 🔧 Configuration

### **Customizing Profanity List**

Edit `app/Services/ContentModerationService.php`:

```php
protected array $profanityList = [
    'word1', 'word2', 'word3',
    // Add more words as needed
];
```

### **Customizing Spam Keywords**

```php
protected array $spamKeywords = [
    'click here', 'buy now', 'free money',
    // Add more keywords as needed
];
```

### **Adjusting Rate Limits**

In `ContentModerationService::isRateLimited()`:

```php
if ($trustScore >= 70) {
    $limit = 20;  // Change this
    $timeWindow = 60;  // Minutes
}
```

### **Adjusting Trust Score Weights**

In `ContentModerationService::getUserTrustScore()`:

```php
// Account age bonus
$score += min(20, floor($accountAgeDays / 7)); // Adjust divisor

// Quote count bonus
$score += min(15, floor($quoteCount / 2)); // Adjust divisor
```

---

## 📊 Monitoring

### **Key Metrics to Track**

1. **Rate Limit Hits**: How many users hit rate limits?
2. **Profanity Blocks**: How much inappropriate content is blocked?
3. **Spam Blocks**: How effective is spam detection?
4. **Trust Score Distribution**: What's the average trust score?
5. **Report Volume**: How many reports are submitted daily?

### **Recommended Queries**

```sql
-- Users hitting rate limits (check logs)
-- Blocked profanity attempts (check logs)
-- Average trust score
SELECT AVG(trust_score) FROM users;

-- Low trust users
SELECT COUNT(*) FROM users WHERE trust_score < 30;

-- Pending reports
SELECT COUNT(*) FROM reports WHERE status = 'pending';
```

---

## 🚀 Future Enhancements

### **Planned Features**

1. **AI-Powered Moderation**
   - OpenAI Moderation API integration
   - Automated toxicity detection
   - Sentiment analysis

2. **Advanced Spam Detection**
   - Machine learning models
   - Pattern recognition
   - Duplicate quote detection

3. **User Reputation System**
   - Public reputation badges
   - Verified creator status
   - Community moderators

4. **Appeal System**
   - Users can appeal rejected quotes
   - Admin review queue
   - Automated re-review

5. **Automated Actions**
   - Auto-ban users with very low trust
   - Auto-approve high-trust users
   - Auto-flag suspicious patterns

---

## ✅ Best Practices

### **For Users**

1. ✅ Post genuine, meaningful quotes
2. ✅ Verify your email to boost trust score
3. ✅ Engage positively (likes, follows)
4. ✅ Avoid spam, profanity, and URLs
5. ✅ Build your reputation over time

### **For Admins**

1. ✅ Review reports promptly
2. ✅ Be consistent with moderation decisions
3. ✅ Add clear notes to reviews
4. ✅ Monitor trust score distribution
5. ✅ Adjust filters based on community needs

### **For Developers**

1. ✅ Monitor rate limit effectiveness
2. ✅ Update profanity list regularly
3. ✅ Track false positives/negatives
4. ✅ Optimize trust score algorithm
5. ✅ Consider user feedback

---

## 🎉 Summary

QuotesHub's moderation system provides:

- ✅ **Automated Protection**: Blocks profanity and spam automatically
- ✅ **Scalable**: Rate limits prevent abuse without manual intervention
- ✅ **Fair**: Trust scores reward good behavior
- ✅ **Flexible**: Easy to customize and adjust
- ✅ **User-Friendly**: Clear error messages and warnings

**Result**: A high-quality, safe platform that scales with your community!
