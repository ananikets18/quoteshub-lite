<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\User;
use App\Models\Tag;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search quotes
     */
    public function quotes(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'q' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:100',
            'sort' => 'nullable|in:latest,popular,trending,saved',
        ]);

        try {
            $query = $validated['q'] ?? '';
            $category = $validated['category'] ?? null;
            $author = $validated['author'] ?? null;
            $sort = $validated['sort'] ?? 'latest';

            $quotesQuery = Quote::with(['user', 'categories', 'tags'])
                ->approved()
                ->withCount(['likes', 'saves'])  // Ensure counts are loaded
                ->where(function ($q) use ($query) {
                    if ($query) {
                        $query = trim($query);
                        $q->where('content', 'like', "%{$query}%")
                            ->orWhere('author', 'like', "%{$query}%")
                            ->orWhere('source', 'like', "%{$query}%");
                    }
                });

            // Filter by category
            if ($category) {
                $category = trim($category);
                $quotesQuery->whereHas('categories', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            }

            // Filter by author (user)
            if ($author) {
                $author = trim($author);
                $quotesQuery->whereHas('user', function ($q) use ($author) {
                    $q->where('username', $author);
                });
            }

            // Apply sorting
            switch ($sort) {
                case 'popular':
                    $quotesQuery->orderByDesc('likes_count');
                    break;
                case 'trending':
                    $quotesQuery->trending();
                    break;
                case 'saved':
                    $quotesQuery->orderByDesc('saves_count');
                    break;
                default:
                    $quotesQuery->latest();
            }

            $quotes = $quotesQuery->paginate(20);

            // Add interaction flags if authenticated
            if (auth()->check()) {
                $user = auth()->user();
                $quotes->getCollection()->transform(function ($quote) use ($user) {
                    $quote->is_liked = $quote->isLikedBy($user);
                    $quote->is_saved = $quote->isSavedBy($user);
                    return $quote;
                });
            }

            return response()->json($quotes);
        } catch (\Exception $e) {
            \Log::error('API Quote search error: ' . $e->getMessage());
            return response()->json(['error' => 'Search failed'], 500);
        }
    }

    /**
     * Search users
     */
    public function users(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'q' => 'nullable|string|max:500',
        ]);

        try {
            $query = trim($validated['q'] ?? '');

            $users = User::where('is_active', true)
                ->where(function ($q) use ($query) {
                    if ($query) {
                        $q->where('name', 'like', "%{$query}%")
                            ->orWhere('username', 'like', "%{$query}%")
                            ->orWhere('bio', 'like', "%{$query}%");
                    }
                })
                ->orderBy('followers_count', 'desc')
                ->paginate(20);

            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('API User search error: ' . $e->getMessage());
            return response()->json(['error' => 'Search failed'], 500);
        }
    }

    /**
     * Search tags
     */
    public function tags(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'q' => 'nullable|string|max:100',
        ]);

        try {
            $query = trim($validated['q'] ?? '');

            $tags = Tag::where('name', 'like', "%{$query}%")
                ->popular(20)
                ->get();

            return response()->json($tags);
        } catch (\Exception $e) {
            \Log::error('API Tag search error: ' . $e->getMessage());
            return response()->json(['error' => 'Search failed'], 500);
        }
    }

    /**
     * Global search
     */
    public function global(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'q' => 'nullable|string|max:500',
        ]);

        try {
            $query = trim($validated['q'] ?? '');

            $results = [
                'quotes' => Quote::with(['user', 'categories', 'tags'])
                    ->approved()
                    ->where(function ($q) use ($query) {
                        if ($query) {
                            $q->where('content', 'like', "%{$query}%")
                                ->orWhere('author', 'like', "%{$query}%");
                        }
                    })
                    ->latest()
                    ->limit(5)
                    ->get(),

                'users' => User::where('is_active', true)
                    ->where(function ($q) use ($query) {
                        if ($query) {
                            $q->where('name', 'like', "%{$query}%")
                                ->orWhere('username', 'like', "%{$query}%");
                        }
                    })
                    ->orderBy('followers_count', 'desc')
                    ->limit(5)
                    ->get(),

                'tags' => Tag::where('name', 'like', "%{$query}%")
                    ->popular(5)
                    ->get(),
            ];

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error('API Global search error: ' . $e->getMessage());
            return response()->json(['error' => 'Search failed'], 500);
        }
    }
}
