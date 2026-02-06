<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Like;
use App\Models\Save;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    /**
     * Display a listing of quotes
     */
    public function index(Request $request)
    {
        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved();

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->popular();
                break;
            case 'trending':
                $query->trending();
                break;
            case 'featured':
                $query->featured();
                break;
            default:
                $query->latest();
        }

        $quotes = $query->paginate($request->get('per_page', 20));

        // Add user interaction flags
        if (Auth::check()) {
            $quotes->getCollection()->transform(function ($quote) {
                $quote->is_liked = $quote->isLikedBy(Auth::user());
                $quote->is_saved = $quote->isSavedBy(Auth::user());
                return $quote;
            });
        }

        return response()->json($quotes);
    }

    /**
     * Store a newly created quote
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'author' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'background_gradient' => 'nullable|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $quote = Auth::user()->quotes()->create([
            'content' => $validated['content'],
            'author' => $validated['author'] ?? null,
            'source' => $validated['source'] ?? null,
            'background_gradient' => $validated['background_gradient'] ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'status' => 'pending', // Requires approval
        ]);

        // Attach categories
        if (isset($validated['category_ids'])) {
            $quote->categories()->attach($validated['category_ids']);
        }

        // Handle tags
        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => \Illuminate\Support\Str::slug($tagName)]
                );
                $tag->increment('usage_count');
                $tagIds[] = $tag->id;
            }
            $quote->tags()->attach($tagIds);
        }

        // Increment user's quote count
        Auth::user()->increment('quotes_count');

        return response()->json([
            'message' => 'Quote created successfully and pending approval',
            'quote' => $quote->load(['categories', 'tags', 'user']),
        ], 201);
    }

    /**
     * Display the specified quote
     */
    public function show($id)
    {
        $quote = Quote::with(['user', 'categories', 'tags'])
            ->findOrFail($id);

        // Increment views
        $quote->incrementViews();

        // Add user interaction flags
        if (Auth::check()) {
            $quote->is_liked = $quote->isLikedBy(Auth::user());
            $quote->is_saved = $quote->isSavedBy(Auth::user());
        }

        return response()->json($quote);
    }

    /**
     * Update the specified quote
     */
    public function update(Request $request, $id)
    {
        $quote = Quote::findOrFail($id);

        // Check authorization
        if ($quote->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'sometimes|required|string|max:1000',
            'author' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'background_gradient' => 'nullable|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $quote->update($validated);

        // Update categories if provided
        if (isset($validated['category_ids'])) {
            $quote->categories()->sync($validated['category_ids']);
        }

        // Update tags if provided
        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => \Illuminate\Support\Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $quote->tags()->sync($tagIds);
        }

        return response()->json([
            'message' => 'Quote updated successfully',
            'quote' => $quote->load(['categories', 'tags', 'user']),
        ]);
    }

    /**
     * Remove the specified quote
     */
    public function destroy($id)
    {
        $quote = Quote::findOrFail($id);

        // Check authorization
        if ($quote->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ownerId = $quote->user_id;
        $quote->delete();

        // Decrement the quote owner's count (not the deleter's if moderator)
        User::where('id', $ownerId)->decrement('quotes_count');

        return response()->json([
            'message' => 'Quote deleted successfully',
        ]);
    }

    /**
     * Toggle like on a quote
     */
    public function like($id)
    {
        $quote = Quote::findOrFail($id);
        $user = Auth::user();

        try {
            \DB::transaction(function () use ($quote, $user, &$is_liked, &$message) {
                $like = $quote->likes()->where('user_id', $user->id)->lockForUpdate()->first();

                if ($like) {
                    // Unlike
                    $like->delete();
                    app(\App\Services\NotificationService::class)->removeQuoteLikedNotification($user, $quote);
                    $message = 'Quote unliked';
                    $is_liked = false;
                } else {
                    // Like - use firstOrCreate to handle race conditions
                    $created = $quote->likes()->firstOrCreate(['user_id' => $user->id]);
                    
                    if ($created->wasRecentlyCreated) {
                        app(\App\Services\NotificationService::class)->notifyQuoteLiked($user, $quote);
                    }
                    $message = 'Quote liked';
                    $is_liked = true;
                }
            });

            // Refresh to get latest counts
            $quote->refresh();

            return response()->json([
                'message' => $message,
                'is_liked' => $is_liked,
                'likes_count' => $quote->likes_count,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('API Like toggle error', [
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to update like. Please try again.',
                'error' => true
            ], 500);
        }
    }

    /**
     * Toggle save on a quote
     */
    public function save(Request $request, $id)
    {
        $quote = Quote::findOrFail($id);
        $user = Auth::user();

        $validated = $request->validate([
            'collection' => 'nullable|string|max:100',
        ]);

        try {
            \DB::transaction(function () use ($quote, $user, $validated, &$is_saved, &$message) {
                $save = $quote->saves()->where('user_id', $user->id)->lockForUpdate()->first();

                if ($save) {
                    // Unsave
                    $save->delete();
                    app(\App\Services\NotificationService::class)->removeQuoteSavedNotification($user, $quote);
                    $message = 'Quote removed from saved';
                    $is_saved = false;
                } else {
                    // Save - use firstOrCreate to handle race conditions
                    $created = $quote->saves()->firstOrCreate(
                        ['user_id' => $user->id],
                        ['collection' => $validated['collection'] ?? 'default']
                    );
                    
                    if ($created->wasRecentlyCreated) {
                        app(\App\Services\NotificationService::class)->notifyQuoteSaved($user, $quote);
                    }
                    $message = 'Quote saved';
                    $is_saved = true;
                }
            });

            // Refresh to get latest counts
            $quote->refresh();

            return response()->json([
                'message' => $message,
                'is_saved' => $is_saved,
                'saves_count' => $quote->saves_count,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('API Save toggle error', [
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to save quote. Please try again.',
                'error' => true
            ], 500);
        }
    }

    /**
     * Track share
     */
    public function share($id)
    {
        $quote = Quote::findOrFail($id);
        $user = auth()->user();
        
        // Increment share count
        $quote->increment('shares_count');
        
        // Track user category preferences
        if ($user && $quote->category_id) {
            app(RecommendationService::class)->trackCategoryInteraction(
                $user,
                $quote->category_id,
                'share'
            );
        }

        return response()->json([
            'message' => 'Share tracked',
            'shares_count' => $quote->shares_count,
        ]);
    }
}
