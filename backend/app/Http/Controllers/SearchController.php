<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global search for quotes
     */
    public function index(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'q' => 'nullable|string|max:500',
        ]);

        try {
            $query = Quote::query()
                ->approved()  // Only show approved quotes
                ->with(['user', 'categories', 'tags']);

            // Search by content, author, or username
            if ($search = $validated['q'] ?? null) {
                // Sanitize search input
                $search = trim($search);
                
                $query->where(function ($q) use ($search) {
                    $q->where('content', 'LIKE', "%{$search}%")
                      ->orWhere('author', 'LIKE', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'LIKE', "%{$search}%")
                                   ->orWhere('username', 'LIKE', "%{$search}%");
                      });
                });
            }

            // Sort by latest
            $query->orderByDesc('created_at');

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
        } catch (\Exception $e) {
            \Log::error('Search error: ' . $e->getMessage());
            
            $filters = [
                'q' => $validated['q'] ?? '',
            ];
            $error = 'An error occurred while searching. Please try again.';
            $quotes = ['data' => [], 'links' => [], 'total' => 0];
            $collections = [];
            
            return view('search.index', compact('quotes', 'collections', 'filters', 'error'));
        }

        $filters = [
            'q' => $request->input('q'),
        ];
        
        return view('search.index', compact('quotes', 'collections', 'filters'));
    }

    /**
     * Show quotes in a specific category
     */
    public function category(Request $request, string $slug)
    {
        // Validate input
        $validated = $request->validate([
            'sort' => 'nullable|in:latest,popular,most_saved',
        ]);

        try {
            $category = Category::where('slug', $slug)->firstOrFail();

            $query = $category->quotes()
                ->approved()  // Only show approved quotes
                ->with(['user', 'categories', 'tags']);

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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            abort(404, 'Category not found');
        } catch (\Exception $e) {
            \Log::error('Category search error: ' . $e->getMessage());
            abort(500, 'An error occurred while loading the category');
        }

        return view('search.category', compact('category', 'quotes', 'sort', 'collections'));
    }

    /**
     * Show quotes with a specific tag
     */
    public function tag(Request $request, string $name)
    {
        // Validate input
        $validated = $request->validate([
            'sort' => 'nullable|in:latest,popular,most_saved',
        ]);

        // Sanitize tag name
        $name = trim($name);

        try {
            $tag = Tag::where('name', $name)->firstOrFail();

            $query = $tag->quotes()
                ->approved()  // Only show approved quotes
                ->with(['user', 'categories', 'tags']);

            // Apply sorting
            $sort = $validated['sort'] ?? 'latest';
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            abort(404, 'Tag not found');
        } catch (\Exception $e) {
            \Log::error('Tag search error: ' . $e->getMessage());
            abort(500, 'An error occurred while loading the tag');
        }

        return view('search.tag', compact('tag', 'quotes', 'sort', 'collections'));
    }
}
