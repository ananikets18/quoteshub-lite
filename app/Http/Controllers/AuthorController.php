<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Show an author's page: all approved quotes attributed to them.
     */
    public function show(Request $request, string $author)
    {
        // Decode the URL-encoded author name
        $authorName = urldecode($author);

        $quotes = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->where('author', $authorName)
            ->withCount(['likes', 'saves'])
            ->latest()
            ->paginate(15);

        if ($quotes->isEmpty() && $quotes->currentPage() === 1) {
            abort(404, "No quotes found for author '{$authorName}'.");
        }

        // Add user interaction flags
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

        // Related authors (share a category)
        $relatedAuthors = Quote::approved()
            ->where('author', '!=', $authorName)
            ->whereHas('categories', function ($q) use ($quotes) {
                $categoryIds = $quotes->getCollection()
                    ->flatMap(fn($q) => $q->categories->pluck('id'))
                    ->unique();
                $q->whereIn('categories.id', $categoryIds);
            })
            ->select('author')
            ->distinct()
            ->inRandomOrder()
            ->limit(6)
            ->pluck('author');

        $totalQuotes = Quote::approved()->where('author', $authorName)->count();

        return view('authors.show', compact('quotes', 'authorName', 'relatedAuthors', 'totalQuotes'));
    }
}
