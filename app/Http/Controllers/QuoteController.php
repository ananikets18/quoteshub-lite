<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use App\Services\NotificationService;
use App\Services\ContentModerationService;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class QuoteController extends Controller
{
    use AuthorizesRequests;
    
    protected $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * Show the form for creating a new quote.
     */
    public function create()
    {
        $categories = Category::active()->ordered()->get();
        
        // Get user's rate limit info
        $rateLimitInfo = $this->moderationService->getRemainingQuotes(auth()->user());

        return Inertia::render('CreateQuote', [
            'categories' => $categories,
            'rateLimitInfo' => $rateLimitInfo,
        ]);
    }

    /**
     * Store a newly created quote in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        // Log incoming data for debugging
        \Log::info('Quote creation attempt', [
            'user_id' => $user->id,
            'data' => $request->only(['content', 'author', 'source', 'category_ids']),
            'categories_count' => \App\Models\Category::count()
        ]);

        // Check rate limiting
        if ($this->moderationService->isRateLimited($user)) {
             $rateLimitInfo = $this->moderationService->getRemainingQuotes($user);
            return back()->withErrors([
                'content' => "You've reached your quote limit. Please wait before posting more. (Limit: {$rateLimitInfo['limit']} quotes per hour)"
            ])->withInput();
        }

        $validated = $request->validate([
            'content' => 'required|string|min:10|max:500',
            'author' => 'required|string|max:100',
            'source' => 'nullable|string|max:200',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Content moderation checks
        $moderationResult = $this->moderationService->validateContent(
            $validated['content'] . ' ' . $validated['author'] . ' ' . ($validated['source'] ?? ''),
            $user
        );

        // Block content with profanity
        if (in_array('profanity', $moderationResult['flags'])) {
            return back()->withErrors([
                'content' => 'Your quote contains inappropriate language. Please revise and try again.'
            ])->withInput();
        }

        // Block obvious spam
        if (in_array('spam', $moderationResult['flags'])) {
            return back()->withErrors([
                'content' => 'Your quote appears to be spam. Please ensure you\'re posting genuine quotes.'
            ])->withInput();
        }

        // Warn about URLs but allow (for now)
        $warnings = [];
        if (in_array('contains_url', $moderationResult['flags'])) {
            $warnings[] = 'Note: Your quote contains URLs. It may be reviewed by moderators.';
        }

        $quote = \DB::transaction(function () use ($validated, $user) {
            $quote = Quote::create([
                'user_id' => $user->id,
                'content' => $validated['content'],
                'author' => $validated['author'],
                'source' => $validated['source'] ?? null,
                'status' => 'approved', // MVP: Auto-approve all quotes. Moderation via report system.
            ]);

            // Attach categories and increment their quotes_count
            if (!empty($validated['category_ids'])) {
                $quote->categories()->attach($validated['category_ids']);
                
                // Increment quotes_count for each category since quote is approved
                foreach ($validated['category_ids'] as $categoryId) {
                    \App\Models\Category::where('id', $categoryId)->increment('quotes_count');
                }
            }
            
            return $quote;
        });

        $successMessage = 'Quote created successfully!';
        if (!empty($warnings)) {
            $successMessage .= ' ' . implode(' ', $warnings);
        }

        return redirect()->route('home')->with('success', $successMessage);
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
        try {
            \Log::info('Quote edit attempt', [
                'quote_id' => $quote->id,
                'user_id' => auth()->id(),
                'quote_user_id' => $quote->user_id,
            ]);

            $this->authorize('update', $quote);

            $categories = Category::active()->ordered()->get();

            return Inertia::render('EditQuote', [
                'quote' => $quote->load('categories'),
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            \Log::error('Quote edit failed', [
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            abort(500, 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified quote in storage.
     */
    public function update(Request $request, Quote $quote)
    {
        $this->authorize('update', $quote);

        $validated = $request->validate([
            'content' => 'required|string|min:10|max:500',
            'author' => 'required|string|max:100',
            'source' => 'nullable|string|max:200',
            'background_gradient' => 'nullable|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Content moderation checks (prevent editing to add spam/profanity)
        $moderationResult = $this->moderationService->validateContent(
            $validated['content'] . ' ' . $validated['author'] . ' ' . ($validated['source'] ?? ''),
            auth()->user()
        );

        // Block content with profanity
        if (in_array('profanity', $moderationResult['flags'])) {
            return back()->withErrors([
                'content' => 'Your quote contains inappropriate language. Please revise and try again.'
            ])->withInput();
        }

        // Block obvious spam
        if (in_array('spam', $moderationResult['flags'])) {
            return back()->withErrors([
                'content' => 'Your quote appears to be spam. Please ensure you\'re posting genuine quotes.'
            ])->withInput();
        }

        // Warn about URLs but allow (for now)
        $warnings = [];
        if (in_array('contains_url', $moderationResult['flags'])) {
            $warnings[] = 'Note: Your quote contains URLs. It may be reviewed by moderators.';
        }

        \DB::transaction(function () use ($quote, $validated) {
            // Get old categories before sync
            $oldCategoryIds = $quote->categories->pluck('id')->toArray();
            
            $quote->update([
                'content' => $validated['content'],
                'author' => $validated['author'],
                'source' => $validated['source'] ?? null,
                'background_gradient' => $validated['background_gradient'] ?? $quote->background_gradient,
            ]);

            // Sync categories and update counts if quote is approved
            if (isset($validated['category_ids'])) {
                $newCategoryIds = $validated['category_ids'];
                $quote->categories()->sync($newCategoryIds);
                
                // Update category counts only if quote is approved
                if ($quote->status === 'approved') {
                    // Decrement count for removed categories
                    $removedCategories = array_diff($oldCategoryIds, $newCategoryIds);
                    if (!empty($removedCategories)) {
                        \App\Models\Category::whereIn('id', $removedCategories)->decrement('quotes_count');
                    }
                    
                    // Increment count for added categories
                    $addedCategories = array_diff($newCategoryIds, $oldCategoryIds);
                    if (!empty($addedCategories)) {
                        \App\Models\Category::whereIn('id', $addedCategories)->increment('quotes_count');
                    }
                }
            } else {
                // Detach all categories
                $quote->categories()->detach();
                
                // Decrement count for all old categories if quote is approved
                if ($quote->status === 'approved' && !empty($oldCategoryIds)) {
                    \App\Models\Category::whereIn('id', $oldCategoryIds)->decrement('quotes_count');
                }
            }
        });

        $successMessage = 'Quote updated successfully!';
        if (!empty($warnings)) {
            $successMessage .= ' ' . implode(' ', $warnings);
        }

        return redirect()->route('quotes.show', $quote)->with('success', $successMessage);
    }

    /**
     * Remove the specified quote from storage.
     */
    public function destroy(Quote $quote)
    {
        try {
            \Log::info('Quote deletion attempt', [
                'quote_id' => $quote->id,
                'user_id' => auth()->id(),
                'quote_user_id' => $quote->user_id,
            ]);

            $this->authorize('delete', $quote);

            $quote->delete();

            \Log::info('Quote deleted successfully', ['quote_id' => $quote->id]);

            return redirect()->route('home')->with('success', 'Quote deleted successfully!');
        } catch (\Exception $e) {
            \Log::error('Quote deletion failed', [
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to delete quote: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Toggle like on a quote.
     */
    public function like(Quote $quote)
    {
        $user = auth()->user();
        
        try {
            \DB::transaction(function () use ($quote, $user) {
                $like = $quote->likes()->where('user_id', $user->id)->lockForUpdate()->first();

                if ($like) {
                    // Unlike - remove the like and its notification
                    $like->delete();
                    app(NotificationService::class)->removeQuoteLikedNotification($user, $quote);
                } else {
                    // Like - use firstOrCreate to handle race conditions
                    $created = $quote->likes()->firstOrCreate(['user_id' => $user->id]);
                    
                    // Trigger notification only when actually creating a new like
                    if ($created->wasRecentlyCreated) {
                        app(NotificationService::class)->notifyQuoteLiked($user, $quote);
                    }
                }
            });

            // Refresh the quote to ensure we have the latest counts
            $quote->refresh();
            
        } catch (\Exception $e) {
            \Log::error('Like toggle error', [
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'like' => 'Failed to update like. Please try again.'
            ]);
        }

        return back();
    }

    /**
     * Toggle save on a quote.
     */
    public function save(Quote $quote)
    {
        $user = auth()->user();
        
        try {
            \DB::transaction(function () use ($quote, $user) {
                $save = $quote->saves()->where('user_id', $user->id)->lockForUpdate()->first();

                if ($save) {
                    // Unsave - remove the save and its notification
                    $save->delete();
                    app(NotificationService::class)->removeQuoteSavedNotification($user, $quote);
                } else {
                    // Save - use firstOrCreate to handle race conditions
                    $created = $quote->saves()->firstOrCreate(
                        ['user_id' => $user->id],
                        ['collection' => 'default']
                    );
                    
                    // Trigger notification only when actually creating a new save
                    if ($created->wasRecentlyCreated) {
                        app(NotificationService::class)->notifyQuoteSaved($user, $quote);
                    }
                }
            });

            // Refresh the quote to ensure we have the latest counts
            $quote->refresh();
            
        } catch (\Exception $e) {
            \Log::error('Save toggle error', [
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'save' => 'Failed to save quote. Please try again.'
            ]);
        }

        return back();
    }

    /**
     * Track share.
     */
    public function share(Quote $quote)
    {
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

        // Prevent duplicate reports from same user for same quote
        $existingReport = \App\Models\Report::where('user_id', auth()->id())
            ->where('quote_id', $quote->id)
            ->where('status', 'pending')
            ->first();

        if ($existingReport) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reported this quote. We are reviewing it.',
            ], 422);
        }

        // Save the report to database
        \App\Models\Report::create([
            'user_id' => auth()->id(),
            'quote_id' => $quote->id,
            'reason' => $validated['reason'],
            'details' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. We will review it soon.',
        ]);
    }
}
