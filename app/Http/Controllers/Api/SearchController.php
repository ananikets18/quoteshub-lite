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
        $query = $request->get('q', '');
        $category = $request->get('category');
        $author = $request->get('author');
        $sort = $request->get('sort', 'latest');

        $quotesQuery = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->where(function ($q) use ($query) {
                $q->where('content', 'like', "%{$query}%")
                    ->orWhere('author', 'like', "%{$query}%")
                    ->orWhere('source', 'like', "%{$query}%");
            });

        // Filter by category
        if ($category) {
            $quotesQuery->whereHas('categories', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // Filter by author (user)
        if ($author) {
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
    }

    /**
     * Search users
     */
    public function users(Request $request)
    {
        $query = $request->get('q', '');

        $users = User::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('username', 'like', "%{$query}%")
                    ->orWhere('bio', 'like', "%{$query}%");
            })
            ->orderBy('followers_count', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Search tags
     */
    public function tags(Request $request)
    {
        $query = $request->get('q', '');

        $tags = Tag::where('name', 'like', "%{$query}%")
            ->popular(20)
            ->get();

        return response()->json($tags);
    }

    /**
     * Global search
     */
    public function global(Request $request)
    {
        $query = $request->get('q', '');

        $results = [
            'quotes' => Quote::with(['user', 'categories', 'tags'])
                ->approved()
                ->where(function ($q) use ($query) {
                    $q->where('content', 'like', "%{$query}%")
                        ->orWhere('author', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(5)
                ->get(),

            'users' => User::where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('username', 'like', "%{$query}%");
                })
                ->orderBy('followers_count', 'desc')
                ->limit(5)
                ->get(),

            'tags' => Tag::where('name', 'like', "%{$query}%")
                ->popular(5)
                ->get(),
        ];

        return response()->json($results);
    }
}
