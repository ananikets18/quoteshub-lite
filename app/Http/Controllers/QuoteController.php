<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
    /**
     * Show the form for creating a new quote.
     */
    public function create()
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('CreateQuote', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created quote in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:10|max:500',
            'author' => 'required|string|max:100',
            'source' => 'nullable|string|max:200',
            'background_gradient' => 'required|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $quote = Quote::create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'author' => $validated['author'],
            'source' => $validated['source'] ?? null,
            'background_gradient' => $validated['background_gradient'],
            'status' => 'approved', // Auto-approve for now, can add moderation later
            'is_featured' => false,
        ]);

        // Attach categories
        if (!empty($validated['category_ids'])) {
            $quote->categories()->attach($validated['category_ids']);
        }

        return redirect()->route('home')->with('success', 'Quote created successfully!');
    }

    /**
     * Display the specified quote.
     */
    public function show(Quote $quote)
    {
        $quote->load(['user', 'categories', 'tags']);
        $quote->incrementViews();

        // Add user interaction flags if authenticated
        if (auth()->check()) {
            $quote->is_liked = $quote->isLikedBy(auth()->user());
            $quote->is_saved = $quote->isSavedBy(auth()->user());
        }

        return Inertia::render('ShowQuote', [
            'quote' => $quote,
        ]);
    }
}
