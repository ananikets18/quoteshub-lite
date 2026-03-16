<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    public function index(Request $request)
    {
        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved();

        // Apply sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'trending':
                $query->trending();
                break;
            case 'popular':
                $query->popular();
                break;
            case 'foryou':
                // Personalized feed handled separately
                if (auth()->check()) {
                    $quotes = $this->getForYouFeed($request);
                    $categories = \Illuminate\Support\Facades\Cache::remember('active_categories', now()->addHours(1), fn() => Category::active()->ordered()->get());
                    
                    return view('feed', compact('quotes', 'categories'));
                }
                // Fall back to latest for guests
                $query->latest();
                break;
            default:
                $query->latest();
        }

        $quotes = $query->paginate(15);

        // Add user interaction flags if authenticated
        if (auth()->check()) {
            $quotes->getCollection()->transform(function ($quote) {
                $quote->is_liked = $quote->isLikedBy(auth()->user());
                $quote->is_saved = $quote->isSavedBy(auth()->user());
                // Add collection IDs this quote is in
                $quote->collection_ids = $quote->collections()
                    ->where('user_id', auth()->id())
                    ->pluck('collections.id')
                    ->toArray();
                return $quote;
            });
        }

        $categories = \Illuminate\Support\Facades\Cache::remember('active_categories', now()->addHours(1), fn() => Category::active()->ordered()->get());
        
        // Get user's collections if authenticated
        $collections = auth()->check() 
            ? auth()->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];

        return view('feed', compact('quotes', 'categories', 'collections'));
    }

    /**
     * Get personalized "For You" feed
     */
    protected function getForYouFeed(Request $request)
    {
        $user = auth()->user();
        $page = $request->get('page', 1);
        $perPage = 15;

        // Get personalized recommendations with caching
        $cacheKey = 'feed_foryou_' . $user->id;
        $allRecommendations = \Illuminate\Support\Facades\Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user, $perPage) {
            return $this->recommendationService->getPersonalizedFeed($user, $perPage * 3);
        });
        
        // Paginate manually
        $quotes = $allRecommendations->forPage($page, $perPage);

        // Add user interaction flags
        $quotes->transform(function ($quote) use ($user) {
            $quote->is_liked = $quote->isLikedBy($user);
            $quote->is_saved = $quote->isSavedBy($user);
            return $quote;
        });

        // Create pagination structure
        return new \Illuminate\Pagination\LengthAwarePaginator(
            $quotes,
            $allRecommendations->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );
    }
}
