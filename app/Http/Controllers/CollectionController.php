<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CollectionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display all collections for the authenticated user.
     */
    public function index(Request $request): Response
    {
        // Ensure user is authenticated
        if (!$request->user()) {
            abort(403, 'Unauthorized access to collections.');
        }

        $collections = $request->user()
            ->collections()
            ->withCount('quotes')
            ->latest()
            ->get();

        return Inertia::render('Collections/Index', [
            'collections' => $collections,
        ]);
    }

    /**
     * Show a specific collection.
     */
    public function show(Request $request, string $slug): Response
    {
        $collection = Collection::where('slug', $slug)->firstOrFail();

        // Authorization: Only owner can view private collections
        if (!$collection->is_public) {
            if (!$request->user() || $collection->user_id !== $request->user()->id) {
                abort(403, 'This collection is private.');
            }
        }

        $isOwner = $request->user() && $collection->user_id === $request->user()->id;

        $quotes = $collection->quotes()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves'])
            ->latest('collection_quote.created_at')
            ->paginate(12);

        // Add user interaction flags if authenticated
        if ($request->user()) {
            $quotes->getCollection()->transform(function ($quote) use ($request) {
                $quote->is_liked = $quote->isLikedBy($request->user());
                $quote->is_saved = $quote->isSavedBy($request->user());
                // Add collection IDs this quote is in
                $quote->collection_ids = $quote->collections()
                    ->where('user_id', $request->user()->id)
                    ->pluck('collections.id')
                    ->toArray();
                return $quote;
            });
        }
        
        // Get user's collections if authenticated (for moving quotes between collections)
        $collections = $request->user() 
            ? $request->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];

        return Inertia::render('Collections/Show', [
            'collection' => $collection,
            'quotes' => $quotes,
            'isOwner' => $isOwner,
            'collections' => $collections,
        ]);
    }

    /**
     * Store a new collection.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_public' => 'boolean',
        ]);

        $collection = $request->user()->collections()->create($validated);

        return redirect()->route('collections.show', $collection->slug)
            ->with('success', 'Collection created successfully!');
    }

    /**
     * Update a collection.
     */
    public function update(Request $request, string $slug): RedirectResponse
    {
        $collection = Collection::where('slug', $slug)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('update', $collection);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_public' => 'boolean',
        ]);

        $collection->update($validated);

        return back()->with('success', 'Collection updated successfully!');
    }

    /**
     * Delete a collection.
     */
    public function destroy(Request $request, string $slug): RedirectResponse
    {
        $collection = Collection::where('slug', $slug)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('delete', $collection);

        $collection->delete();

        return redirect()->route('collections.index')
            ->with('success', 'Collection deleted successfully!');
    }

    /**
     * Add a quote to a collection.
     */
    public function addQuote(Request $request, string $slug, Quote $quote): RedirectResponse
    {
        $collection = Collection::where('slug', $slug)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('update', $collection);

        if (!$collection->quotes()->where('quote_id', $quote->id)->exists()) {
            $collection->quotes()->attach($quote->id);
            $collection->increment('quotes_count');
        }

        return back()->with('success', 'Quote added to collection!');
    }

    /**
     * Remove a quote from a collection.
     */
    public function removeQuote(Request $request, string $slug, Quote $quote): RedirectResponse
    {
        $collection = Collection::where('slug', $slug)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('update', $collection);

        if ($collection->quotes()->where('quote_id', $quote->id)->exists()) {
            $collection->quotes()->detach($quote->id);
            $collection->decrement('quotes_count');
        }

        return back()->with('success', 'Quote removed from collection!');
    }

    /**
     * Move a quote to a different collection.
     */
    public function moveQuote(Request $request, Quote $quote): RedirectResponse
    {
        $validated = $request->validate([
            'from_collection_id' => 'required|exists:collections,id',
            'to_collection_id' => 'required|exists:collections,id',
        ]);

        $fromCollection = Collection::findOrFail($validated['from_collection_id']);
        $toCollection = Collection::findOrFail($validated['to_collection_id']);

        $this->authorize('update', $fromCollection);
        $this->authorize('update', $toCollection);

        // Remove from source collection
        if ($fromCollection->quotes()->where('quote_id', $quote->id)->exists()) {
            $fromCollection->quotes()->detach($quote->id);
            $fromCollection->decrement('quotes_count');
        }

        // Add to destination collection
        if (!$toCollection->quotes()->where('quote_id', $quote->id)->exists()) {
            $toCollection->quotes()->attach($quote->id);
            $toCollection->increment('quotes_count');
        }

        return back()->with('success', 'Quote moved successfully!');
    }
}
