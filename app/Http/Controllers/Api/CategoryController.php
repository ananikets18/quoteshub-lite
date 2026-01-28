<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Quote;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::active()
            ->ordered()
            ->withCount(['quotes' => function ($query) {
                $query->approved();
            }])
            ->get();

        return response()->json($categories);
    }

    /**
     * Display quotes for a specific category with filtering
     */
    public function show($slug, Request $request)
    {
        $category = Category::where('slug', $slug)
            ->active()
            ->firstOrFail();

        // Get quotes for this category
        $quotesQuery = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->whereHas('categories', function ($q) use ($category) {
                $q->where('categories.id', $category->id);
            });

        // Apply sorting
        $sort = $request->get('sort', 'latest');
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
            case 'views':
                $quotesQuery->orderByDesc('views_count');
                break;
            default:
                $quotesQuery->latest();
        }

        $quotes = $quotesQuery->paginate($request->get('per_page', 20));

        // Add interaction flags if authenticated
        if (auth()->check()) {
            $user = auth()->user();
            $quotes->getCollection()->transform(function ($quote) use ($user) {
                $quote->is_liked = $quote->isLikedBy($user);
                $quote->is_saved = $quote->isSavedBy($user);
                return $quote;
            });
        }

        return response()->json([
            'category' => $category,
            'quotes' => $quotes,
        ]);
    }
}

