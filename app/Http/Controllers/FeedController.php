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

        $quotes = $query->paginate(15);

        // Add user interaction flags if authenticated
        if (auth()->check()) {
            $quotes->getCollection()->transform(function ($quote) {
                $quote->is_liked = $quote->isLikedBy(auth()->user());
                $quote->is_saved = $quote->isSavedBy(auth()->user());
                $quote->collection_ids = $quote->collections()
                    ->where('user_id', auth()->id())
                    ->pluck('collections.id')
                    ->toArray();
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
            : collect();

        return view('feed', compact('quotes', 'categories', 'suggestedUsers'));
    }
}
