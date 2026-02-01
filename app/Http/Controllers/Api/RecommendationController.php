<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\QuoteView;
use App\Models\Category;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    /**
     * Get personalized quote recommendations
     */
    public function forYou(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Authentication required for personalized recommendations'
            ], 401);
        }

        $user = Auth::user();
        $limit = $request->get('limit', 20);
        
        $quotes = $this->recommendationService->getPersonalizedFeed($user, $limit);

        // Add interaction flags
        $quotes->transform(function ($quote) use ($user) {
            $quote->is_liked = $quote->isLikedBy($user);
            $quote->is_saved = $quote->isSavedBy($user);
            return $quote;
        });

        return response()->json([
            'data' => $quotes,
            'count' => $quotes->count(),
        ]);
    }

    /**
     * Get similar quotes to a specific quote
     */
    public function similar(Quote $quote, Request $request)
    {
        $limit = $request->get('limit', 10);
        $user = Auth::user();
        
        $similarQuotes = $this->recommendationService->getSimilarQuotes($quote, $user, $limit);

        // Add interaction flags if authenticated
        if ($user) {
            $similarQuotes->transform(function ($q) use ($user) {
                $q->is_liked = $q->isLikedBy($user);
                $q->is_saved = $q->isSavedBy($user);
                return $q;
            });
        }

        return response()->json([
            'data' => $similarQuotes,
            'count' => $similarQuotes->count(),
        ]);
    }

    /**
     * Get recommended authors
     */
    public function authors(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Authentication required'
            ], 401);
        }

        $user = Auth::user();
        $limit = $request->get('limit', 10);
        
        $authors = $this->recommendationService->getRecommendedAuthors($user, $limit);

        return response()->json([
            'data' => $authors,
            'count' => $authors->count(),
        ]);
    }

    /**
     * Get collaborative filtering recommendations
     */
    public function collaborative(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Authentication required'
            ], 401);
        }

        $user = Auth::user();
        $limit = $request->get('limit', 10);
        
        $quotes = $this->recommendationService->getCollaborativeRecommendations($user, $limit);

        // Add interaction flags
        $quotes->transform(function ($quote) use ($user) {
            $quote->is_liked = $quote->isLikedBy($user);
            $quote->is_saved = $quote->isSavedBy($user);
            return $quote;
        });

        return response()->json([
            'data' => $quotes,
            'count' => $quotes->count(),
            'message' => 'Users who liked similar quotes also liked these',
        ]);
    }

    /**
     * Track quote view
     */
    public function trackView(Quote $quote, Request $request)
    {
        $validated = $request->validate([
            'duration' => 'nullable|integer|min:0',
            'source' => 'nullable|string|max:50',
        ]);

        $viewData = [
            'quote_id' => $quote->id,
            'duration_seconds' => $validated['duration'] ?? 0,
            'source' => $validated['source'] ?? 'feed',
        ];

        if (Auth::check()) {
            $viewData['user_id'] = Auth::id();
            
            // Track interaction for recommendations
            $this->recommendationService->trackInteraction(Auth::user(), $quote, 'view');
        } else {
            // For API routes, generate a session ID from IP and user agent
            $viewData['session_id'] = md5($request->ip() . $request->userAgent());
        }

        QuoteView::create($viewData);

        // Increment quote views count
        $quote->increment('views_count');

        return response()->json([
            'message' => 'View tracked successfully',
        ]);
    }

    /**
     * Get quotes by category (for deep dive)
     */
    public function byCategory(Category $category, Request $request)
    {
        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->whereHas('categories', function ($q) use ($category) {
                $q->where('categories.id', $category->id);
            });

        // Sorting options
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('likes_count');
                break;
            case 'trending':
                $query->trending();
                break;
            default:
                $query->latest();
        }

        $quotes = $query->paginate($request->get('per_page', 20));

        // Add interaction flags
        if (Auth::check()) {
            $user = Auth::user();
            $quotes->getCollection()->transform(function ($quote) use ($user) {
                $quote->is_liked = $quote->isLikedBy($user);
                $quote->is_saved = $quote->isSavedBy($user);
                return $quote;
            });
        }

        return response()->json($quotes);
    }
}
