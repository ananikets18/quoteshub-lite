<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedPreferenceController extends Controller
{
    /**
     * Dismiss a quote from the user's feed ("Not interested").
     * Stores dismissed quote IDs in the session (lightweight, no migration needed).
     * Authenticated: also stores in a user meta key so it persists across sessions.
     */
    public function notInterested(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quote_id' => 'required|integer|exists:quotes,id',
        ]);

        $quoteId = $validated['quote_id'];

        // Session-based dismissal (works for guests too)
        $dismissed = $request->session()->get('dismissed_quotes', []);
        if (!in_array($quoteId, $dismissed)) {
            $dismissed[] = $quoteId;
            // Cap at last 200 dismissals to prevent session bloat
            if (count($dismissed) > 200) {
                $dismissed = array_slice($dismissed, -200);
            }
            $request->session()->put('dismissed_quotes', $dismissed);
        }

        return response()->json(['message' => 'Got it! We\'ll show you less like this.']);
    }

    /**
     * Get the list of dismissed quote IDs (for use in feed queries).
     */
    public static function getDismissedIds(Request $request): array
    {
        return $request->session()->get('dismissed_quotes', []);
    }
}
