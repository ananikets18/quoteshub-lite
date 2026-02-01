<?php

namespace App\Services;

use App\Models\User;
use App\Models\Quote;
use App\Models\UserInteractionPattern;
use App\Models\Like;
use App\Models\Save;
use App\Models\QuoteView;
use Illuminate\Support\Facades\DB;

class UserPreferenceAnalyzer
{
    /**
     * Analyze and update user's quote length preferences
     */
    public function analyzeQuoteLengthPreference(User $user): void
    {
        // Get quotes user has engaged with (liked or saved)
        $engagedQuoteIds = Like::where('user_id', $user->id)
            ->pluck('quote_id')
            ->merge(
                Save::where('user_id', $user->id)->pluck('quote_id')
            )
            ->unique();

        if ($engagedQuoteIds->isEmpty()) {
            return;
        }

        // Get the lengths of engaged quotes
        $quoteLengths = Quote::whereIn('id', $engagedQuoteIds)
            ->get()
            ->pluck('content')
            ->map(fn($content) => strlen($content))
            ->sort()
            ->values();

        if ($quoteLengths->isEmpty()) {
            return;
        }

        // Calculate preferred range (25th to 75th percentile)
        $count = $quoteLengths->count();
        $minIndex = (int) floor($count * 0.25);
        $maxIndex = (int) floor($count * 0.75);

        $minLength = $quoteLengths[$minIndex] ?? 50;
        $maxLength = $quoteLengths[$maxIndex] ?? 500;

        // Ensure reasonable bounds
        $minLength = max(20, $minLength - 50); // Add some buffer
        $maxLength = min(1000, $maxLength + 50);

        // Update or create interaction pattern
        $pattern = UserInteractionPattern::firstOrCreate(
            ['user_id' => $user->id],
            [
                'avg_quote_length_min' => $minLength,
                'avg_quote_length_max' => $maxLength,
            ]
        );

        $pattern->avg_quote_length_min = $minLength;
        $pattern->avg_quote_length_max = $maxLength;
        $pattern->save();
    }

    /**
     * Analyze and update user's preferred hour of activity
     */
    public function analyzePreferredHour(User $user): void
    {
        // Get most active hour from recent views
        $hourCounts = QuoteView::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('COUNT(*) as count'))
            ->groupBy('hour')
            ->orderByDesc('count')
            ->first();

        if ($hourCounts) {
            $pattern = UserInteractionPattern::firstOrCreate(['user_id' => $user->id]);
            $pattern->preferred_hour = $hourCounts->hour;
            $pattern->save();
        }
    }

    /**
     * Calculate diversity score (how varied user's interests are)
     */
    public function calculateDiversityScore(User $user): float
    {
        $categoryPreferences = $user->categoryPreferences;

        if ($categoryPreferences->isEmpty()) {
            return 0.5; // Default neutral diversity
        }

        // Calculate entropy of category distribution
        $totalEngagement = $categoryPreferences->sum('engagement_score');
        
        if ($totalEngagement == 0) {
            return 0.5;
        }

        $entropy = 0;
        foreach ($categoryPreferences as $pref) {
            $probability = $pref->engagement_score / $totalEngagement;
            if ($probability > 0) {
                $entropy -= $probability * log($probability);
            }
        }

        // Normalize entropy to 0-1 scale
        $maxEntropy = log($categoryPreferences->count());
        $diversityScore = $maxEntropy > 0 ? $entropy / $maxEntropy : 0.5;

        // Update pattern
        $pattern = UserInteractionPattern::firstOrCreate(['user_id' => $user->id]);
        $pattern->diversity_score = round($diversityScore, 2);
        $pattern->save();

        return $diversityScore;
    }

    /**
     * Get user's preferred quote length range
     */
    public function getPreferredQuoteLength(User $user): ?array
    {
        $pattern = UserInteractionPattern::where('user_id', $user->id)->first();

        if (!$pattern || !$pattern->avg_quote_length_min || !$pattern->avg_quote_length_max) {
            return null;
        }

        return [
            'min' => $pattern->avg_quote_length_min,
            'max' => $pattern->avg_quote_length_max,
        ];
    }

    /**
     * Update all user preferences (run periodically)
     */
    public function updateAllPreferences(User $user): void
    {
        $this->analyzeQuoteLengthPreference($user);
        $this->analyzePreferredHour($user);
        $this->calculateDiversityScore($user);
    }
}
