<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Category;
use App\Services\NotificationService;
use App\Services\ContentModerationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
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

        $quote = Quote::create([
            'user_id' => $user->id,
            'content' => $validated['content'],
            'author' => $validated['author'],
            'source' => $validated['source'] ?? null,
            'status' => 'approved', // MVP: Auto-approve all quotes. Moderation via report system.
        ]);

        // Attach categories
        if (!empty($validated['category_ids'])) {
            $quote->categories()->attach($validated['category_ids']);
        }

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
            
            // Trigger notification
            app(NotificationService::class)->notifyQuoteLiked($user, $quote);
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
            
            // Trigger notification
            app(NotificationService::class)->notifyQuoteSaved($user, $quote);
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
