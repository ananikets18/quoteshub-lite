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

    /**
     * Show the form for editing the specified quote.
     */
    public function edit(Quote $quote)
    {
        // Ensure the user owns the quote
        if ($quote->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $categories = Category::active()->ordered()->get();

        return Inertia::render('EditQuote', [
            'quote' => $quote->load('categories'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified quote in storage.
     */
    public function update(Request $request, Quote $quote)
    {
        // Ensure the user owns the quote
        if ($quote->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'content' => 'required|string|min:10|max:500',
            'author' => 'required|string|max:100',
            'source' => 'nullable|string|max:200',
            'background_gradient' => 'required|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $quote->update([
            'content' => $validated['content'],
            'author' => $validated['author'],
            'source' => $validated['source'] ?? null,
            'background_gradient' => $validated['background_gradient'],
        ]);

        // Sync categories
        if (isset($validated['category_ids'])) {
            $quote->categories()->sync($validated['category_ids']);
        } else {
            $quote->categories()->detach();
        }

        return redirect()->route('quotes.show', $quote)->with('success', 'Quote updated successfully!');
    }

    /**
     * Remove the specified quote from storage.
     */
    public function destroy(Quote $quote)
    {
        // Ensure the user owns the quote
        if ($quote->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $quote->delete();

        return redirect()->route('home')->with('success', 'Quote deleted successfully!');
    }

    /**
     * Toggle like on a quote.
     */
    public function like(Quote $quote)
    {
        $user = auth()->user();
        $like = $quote->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
        } else {
            $quote->likes()->create(['user_id' => $user->id]);
        }

        return back();
    }

    /**
     * Toggle save on a quote.
     */
    public function save(Quote $quote)
    {
        $user = auth()->user();
        $save = $quote->saves()->where('user_id', $user->id)->first();

        if ($save) {
            $save->delete();
        } else {
            $quote->saves()->create([
                'user_id' => $user->id,
                'collection' => 'default',
            ]);
        }

        return back();
    }

    /**
     * Track share.
     */
    public function share(Quote $quote)
    {
        $quote->increment('shares_count');

        return back();
    }

    /**
     * Report a quote.
     */
    public function report(Quote $quote, Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|string|in:spam,inappropriate,harassment,misinformation,copyright,other',
            'description' => 'nullable|string|max:500',
        ]);

        // Here you would typically save to a reports table
        // For now, we'll just return success
        // You can create a Report model and migration later

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. We will review it soon.',
        ]);
    }
}
