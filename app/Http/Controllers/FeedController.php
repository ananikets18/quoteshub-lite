<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\FeedPreferenceController;
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

        // Exclude dismissed quotes (stored in session)
        $dismissed = FeedPreferenceController::getDismissedIds($request);
        if (!empty($dismissed)) {
            $query->whereNotIn('id', $dismissed);
        }

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->whereHas('categories', fn($q) => $q->where('slug', $request->category));
        }

        // Apply sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'trending' => $query->trending(),
            'popular'  => $query->popular(),
            default    => $query->latest(),
        };

        // Add user interaction flags if authenticated
        if (auth()->check()) {
            $query->withExists([
                'likes as is_liked' => fn($q) => $q->where('user_id', auth()->id()),
                'saves as is_saved' => fn($q) => $q->where('user_id', auth()->id())
            ])->with(['collections' => function($q) {
                $q->where('user_id', auth()->id())->select('collections.id');
            }]);
        }

        $quotes = $query->paginate(15);

        if (auth()->check()) {
            $quotes->getCollection()->transform(function ($quote) {
                // map collections relation to simple array of IDs
                $quote->collection_ids = $quote->collections->pluck('id')->toArray();
                // Ensure the appended or logic handles boolean properly
                $quote->is_liked = (bool) $quote->is_liked;
                $quote->is_saved = (bool) $quote->is_saved;
                return $quote;
            });
        }

        $categories = \Illuminate\Support\Facades\Cache::remember(
            'active_categories',
            now()->addHours(1),
            fn() => Category::active()->ordered()->get()
        );

        // AJAX infinite scroll — return HTML partial for pages > 1
        if ($request->ajax() && $quotes->currentPage() > 1) {
            $html = '';
            foreach ($quotes->getCollection() as $quote) {
                $html .= view('components.quote-card', ['quote' => $quote])->render();
            }
            return response()->json([
                'html'     => $html,
                'hasMore'  => $quotes->hasMorePages(),
                'nextPage' => $quotes->currentPage() + 1,
            ]);
        }

        // Suggested users for right sidebar
        $suggestedUsers = auth()->check()
            ? \App\Models\User::where('id', '!=', auth()->id())
                ->whereDoesntHave('followers', fn($q) => $q->where('follower_id', auth()->id()))
                ->withCount('quotes')
                ->orderByDesc('quotes_count')
                ->limit(5)
                ->get()
                ->map(fn($u) => tap($u, fn($u) => $u->is_following = false))
            : \App\Models\User::withCount('quotes')
                ->orderByDesc('quotes_count')
                ->limit(5)
                ->get()
                ->map(fn($u) => tap($u, fn($u) => $u->is_following = false));

        return view('feed', compact('quotes', 'categories', 'suggestedUsers'));
    }
}
