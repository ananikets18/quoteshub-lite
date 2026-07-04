<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationService;
use App\Services\UserPreferenceAnalyzer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    protected $recommendationService;
    protected $preferenceAnalyzer;

    public function __construct(
        RecommendationService $recommendationService,
        UserPreferenceAnalyzer $preferenceAnalyzer
    ) {
        $this->recommendationService = $recommendationService;
        $this->preferenceAnalyzer = $preferenceAnalyzer;
    }

    /**
     * Mark quote/category/author as not interested
     */
    public function markNotInterested(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|in:quote,category,author',
            'item_id' => 'required|integer',
            'reason' => 'nullable|string|in:not_relevant,seen_too_often,dont_like,other',
        ]);

        $user = Auth::user();

        $success = $this->recommendationService->markNotInterested(
            $user,
            $validated['item_type'],
            $validated['item_id'],
            $validated['reason'] ?? null
        );

        if ($success) {
            return response()->json([
                'message' => 'Preference updated. We\'ll show you less of this.',
                'success' => true,
            ]);
        }

        return response()->json([
            'message' => 'Failed to update preference.',
            'success' => false,
        ], 400);
    }

    /**
     * Undo not interested
     */
    public function undoNotInterested(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|in:quote,category,author',
            'item_id' => 'required|integer',
        ]);

        $user = Auth::user();

        $success = $this->recommendationService->undoNotInterested(
            $user,
            $validated['item_type'],
            $validated['item_id']
        );

        if ($success) {
            return response()->json([
                'message' => 'Preference removed. This content may appear again.',
                'success' => true,
            ]);
        }

        return response()->json([
            'message' => 'Failed to remove preference.',
            'success' => false,
        ], 400);
    }

    /**
     * Get user's preferences (categories, authors, patterns)
     */
    public function getPreferences()
    {
        $user = Auth::user();

        $topCategories = $user->categoryPreferences()
            ->orderByDesc('engagement_score')
            ->take(10)
            ->with('category')
            ->get()
            ->map(function ($pref) {
                return [
                    'category' => $pref->category,
                    'engagement_score' => $pref->engagement_score,
                    'view_count' => $pref->view_count,
                    'like_count' => $pref->like_count,
                    'save_count' => $pref->save_count,
                ];
            });

        $topAuthors = $user->authorPreferences()
            ->orderByDesc('engagement_score')
            ->take(10)
            ->with('author')
            ->get()
            ->map(function ($pref) {
                return [
                    'author' => $pref->author,
                    'engagement_score' => $pref->engagement_score,
                    'view_count' => $pref->view_count,
                    'like_count' => $pref->like_count,
                    'save_count' => $pref->save_count,
                ];
            });

        $pattern = $user->interactionPattern;
        $lengthPreference = $this->preferenceAnalyzer->getPreferredQuoteLength($user);

        return response()->json([
            'categories' => $topCategories,
            'authors' => $topAuthors,
            'patterns' => [
                'preferred_hour' => $pattern->preferred_hour ?? null,
                'quote_length' => $lengthPreference,
                'diversity_score' => $pattern->diversity_score ?? 0.5,
            ],
        ]);
    }

    /**
     * Update user preferences manually (for future dashboard)
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'boost' => 'nullable|integer|min:-50|max:50',
        ]);

        // This is a placeholder for manual preference adjustments
        // Can be expanded when building preference dashboard

        return response()->json([
            'message' => 'Preferences updated',
            'success' => true,
        ]);
    }

    /**
     * Recalculate all user preferences
     */
    public function recalculatePreferences()
    {
        $user = Auth::user();

        $this->preferenceAnalyzer->updateAllPreferences($user);

        return response()->json([
            'message' => 'Preferences recalculated successfully',
            'success' => true,
        ]);
    }
}
