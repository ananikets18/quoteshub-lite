<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
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
            case 'featured':
                $query->featured()->latest();
                break;
            case 'popular':
                $query->popular();
                break;
            default:
                $query->latest();
        }

        $quotes = $query->paginate(20);

        // Add user interaction flags if authenticated
        if (auth()->check()) {
            $quotes->getCollection()->transform(function ($quote) {
                $quote->is_liked = $quote->isLikedBy(auth()->user());
                $quote->is_saved = $quote->isSavedBy(auth()->user());
                return $quote;
            });
        }

        $categories = Category::active()->ordered()->get();

        return Inertia::render('Feed', [
            'quotes' => $quotes,
            'categories' => $categories,
        ]);
    }
}
