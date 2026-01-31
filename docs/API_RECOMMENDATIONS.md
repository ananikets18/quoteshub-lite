# QuotesHub Recommendation & Discovery API

## Authentication
Most endpoints work with and without authentication, but provide enhanced results when authenticated.
Include authentication token in header: `Authorization: Bearer {token}`

---

## 📱 Personalized Recommendations (Requires Auth)

### Get For You Feed
```http
GET /api/recommendations/for-you?limit=20
```

**Description:** Personalized feed based on user's preferences (70% personalized, 30% discovery)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "content": "Quote text...",
      "author": "Author name",
      "user": {...},
      "categories": [...],
      "likes_count": 10,
      "is_liked": false,
      "is_saved": false
    }
  ],
  "count": 20
}
```

---

### Get Recommended Authors
```http
GET /api/recommendations/authors?limit=10
```

**Description:** Authors you might like based on your preferences

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "quotes_count": 45,
      "followers_count": 120
    }
  ]
}
```

---

### Get Collaborative Recommendations
```http
GET /api/recommendations/collaborative?limit=10
```

**Description:** "Users who liked similar quotes also liked..."

**Response:**
```json
{
  "data": [...],
  "message": "Users who liked similar quotes also liked these"
}
```

---

## 🔍 Discovery (Public)

### Get Similar Quotes
```http
GET /api/quotes/{quote_id}/similar?limit=10
```

**Description:** Find quotes similar to a specific quote

**Example:**
```http
GET /api/quotes/123/similar?limit=5
```

---

### Track Quote View
```http
POST /api/quotes/{quote_id}/view
Content-Type: application/json

{
  "duration": 15,
  "source": "feed"
}
```

**Parameters:**
- `duration` (optional): Seconds spent viewing
- `source` (optional): Where viewed from (feed, modal, profile, category, search)

**Response:**
```json
{
  "message": "View tracked successfully"
}
```

---

### Category Deep Dive
```http
GET /api/categories/{category_slug}/quotes?sort=popular&per_page=20
```

**Sort Options:**
- `latest` - Most recent quotes
- `popular` - Most liked
- `trending` - Popular in last 7 days
- `saved` - Most saved
- `views` - Most viewed

**Example:**
```http
GET /api/categories/motivation/quotes?sort=popular
```

---

## 👥 User Discovery

### Get Suggested Users
```http
GET /api/users/discover/suggested?limit=10
```

**Description:** Authors to follow (personalized if authenticated)

---

### Get Similar Authors
```http
GET /api/users/{username}/similar?limit=10
```

**Description:** Find authors similar to a specific user

**Example:**
```http
GET /api/users/johndoe/similar?limit=5
```

---

## 🔎 Enhanced Search

### Search Quotes
```http
GET /api/search/quotes?q=success&category=motivation&author=johndoe&sort=popular
```

**Parameters:**
- `q` - Search query (searches content, author, source)
- `category` (optional) - Filter by category slug
- `author` (optional) - Filter by username
- `sort` (optional) - Sort by: latest, popular, trending, saved

**Example:**
```http
GET /api/search/quotes?q=inspiration&category=motivation&sort=popular
```

**Response:**
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 20,
  "total": 100
}
```

---

## 📊 How It Works

### Interaction Tracking

The system automatically tracks:
- **Views:** When you open a quote (tracked via modal)
- **Likes:** Updates preferences when you like quotes
- **Saves:** Updates preferences when you save quotes
- **Duration:** Time spent viewing each quote

### Recommendation Algorithm

1. **Personalized Feed (70%):**
   - Based on your top categories
   - Based on your favorite authors
   - Recent interactions weighted higher
   - Excludes already-liked/saved quotes

2. **Discovery Feed (30%):**
   - Popular quotes from unexplored categories
   - Helps prevent filter bubbles
   - Introduces variety

3. **Collaborative Filtering:**
   - Finds users with similar taste
   - Recommends what they liked
   - Requires at least 2 common likes

### Engagement Scoring

```
score = (saves × 10) + (likes × 5) + (views × 1) + (shares × 3)

With recency bonus (up to 20%):
final_score = score × (1 + recency_bonus)
```

---

## 🎨 Frontend Integration Examples

### 1. For You Tab (React/Inertia)

```javascript
// Feed.jsx - Already implemented!
const filters = auth.user 
  ? [
      { id: 'foryou', label: 'For You', icon: Sparkles },
      { id: 'latest', label: 'Latest', icon: Clock },
      // ...
    ]
  : [...];
```

### 2. Track Views (JavaScript)

```javascript
// When opening quote modal
useEffect(() => {
  if (isOpen && quote?.id) {
    const startTime = Date.now();
    
    fetch(`/api/quotes/${quote.id}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({
        source: 'modal',
        duration: 0,
      }),
    });
    
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // Track duration on unmount
    };
  }
}, [isOpen, quote?.id]);
```

### 3. Similar Quotes Component

```javascript
function SimilarQuotes({ quoteId }) {
  const [similar, setSimilar] = useState([]);
  
  useEffect(() => {
    fetch(`/api/quotes/${quoteId}/similar?limit=5`)
      .then(res => res.json())
      .then(data => setSimilar(data.data));
  }, [quoteId]);
  
  return (
    <div>
      <h3>More Like This</h3>
      {similar.map(quote => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}
```

### 4. Suggested Authors

```javascript
function SuggestedAuthors() {
  const [authors, setAuthors] = useState([]);
  
  useEffect(() => {
    fetch('/api/recommendations/authors?limit=5')
      .then(res => res.json())
      .then(data => setAuthors(data.data));
  }, []);
  
  return (
    <div>
      <h3>Authors You Might Like</h3>
      {authors.map(author => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}
```

---

## 🚀 Testing

### Test Recommendations

```bash
# Test for specific user
php artisan recommendations:test 1

# Calculate engagement scores
php artisan engagement:calculate

# Seed sample data
php artisan db:seed --class=BehaviorTrackingSeeder
```

---

## 📈 Performance Tips

1. **Pagination:** Always use `limit` parameter to avoid large responses
2. **Caching:** Consider caching personalized feeds for 5-10 minutes
3. **Debouncing:** Debounce view tracking to avoid too many requests
4. **Background:** Track views in background (don't block UI)

---

## 🔐 Privacy

- Guest tracking uses `session_id` (no personal data)
- Authenticated tracking requires consent
- Users can export/delete their data
- All tracking is transparent

---

## 💡 Future Enhancements

Planned features:
- Time-of-day personalization
- Quote length preferences
- Machine learning integration
- A/B testing framework
- User preference dashboard

---

## 📞 Support

For issues or questions about the API, check:
- Backend: `app/Services/RecommendationService.php`
- Controllers: `app/Http/Controllers/Api/RecommendationController.php`
- Documentation: `RECOMMENDATION_ENGINE_DOCS.php`
