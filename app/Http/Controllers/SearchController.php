<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Global search for quotes
     */
    public function index(Request $request): Response
    {
        $query = Quote::query()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves']);

        // Search by content, author, or username
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('content', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'LIKE', "%{$search}%")
                               ->orWhere('username', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Filter by category
        if ($categoryId = $request->input('category')) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        // Filter by tag
        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', function ($q) use ($tag) {
                $q->where('tags.name', $tag);
            });
        }

        // Date range filter
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Sort by popularity or date
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('likes_count');
                break;
            case 'most_saved':
                $query->orderByDesc('saves_count');
                break;
            case 'oldest':
                $query->orderBy('created_at');
                break;
            case 'latest':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $quotes = $query->paginate(12)->withQueryString();

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

        // Load filter options
        $categories = Category::orderBy('name')->get();
        $popularTags = Tag::withCount('quotes')
            ->orderByDesc('quotes_count')
            ->take(20)
            ->get();
        
        // Get user's collections if authenticated
        $collections = auth()->check() 
            ? auth()->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];

        return Inertia::render('Search/Index', [
            'quotes' => $quotes,
            'categories' => $categories,
            'popularTags' => $popularTags,
            'collections' => $collections,
            'filters' => [
                'q' => $request->input('q'),
                'category' => $request->input('category'),
                'tag' => $request->input('tag'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show quotes in a specific category
     */
    public function category(Request $request, string $slug): Response
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $query = $category->quotes()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves']);

        // Apply sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('likes_count');
                break;
            case 'most_saved':
                $query->orderByDesc('saves_count');
                break;
            case 'latest':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $quotes = $query->paginate(12)->withQueryString();

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
        
        // Get user's collections if authenticated
        $collections = auth()->check() 
            ? auth()->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];

        return Inertia::render('Search/Category', [
            'category' => $category,
            'quotes' => $quotes,
            'sort' => $sort,
            'collections' => $collections,
        ]);
    }

    /**
     * Show quotes with a specific tag
     */
    public function tag(Request $request, string $name): Response
    {
        $tag = Tag::where('name', $name)->firstOrFail();

        $query = $tag->quotes()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves']);

        // Apply sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('likes_count');
                break;
            case 'most_saved':
                $query->orderByDesc('saves_count');
                break;
            case 'latest':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $quotes = $query->paginate(12)->withQueryString();

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
        
        // Get user's collections if authenticated
        $collections = auth()->check() 
            ? auth()->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];

        return Inertia::render('Search/Tag', [
            'tag' => $tag,
            'quotes' => $quotes,
            'sort' => $sort,
            'collections' => $collections,
        ]);
    }
}
