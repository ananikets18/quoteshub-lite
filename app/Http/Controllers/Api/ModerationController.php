<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContentModerationService;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    protected $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * Get user's trust score and moderation info
     */
    public function getUserModerationInfo(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        $trustScore = $this->moderationService->getUserTrustScore($user);
        $rateLimitInfo = $this->moderationService->getRemainingQuotes($user);
        $isLowTrust = $this->moderationService->isLowTrustUser($user);

        return response()->json([
            'trust_score' => $trustScore,
            'is_low_trust' => $isLowTrust,
            'rate_limit' => $rateLimitInfo,
            'trust_level' => $this->getTrustLevel($trustScore),
        ]);
    }

    /**
     * Validate content before submission (client-side check)
     */
    public function validateContent(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $moderationResult = $this->moderationService->validateContent(
            $request->input('content'),
            $user
        );

        return response()->json([
            'valid' => $moderationResult['valid'],
            'issues' => $moderationResult['issues'],
            'flags' => $moderationResult['flags'],
            'should_auto_approve' => $moderationResult['should_auto_approve'],
        ]);
    }

    /**
     * Get trust level label
     */
    protected function getTrustLevel(int $score): string
    {
        if ($score >= 80) return 'Excellent';
        if ($score >= 60) return 'High';
        if ($score >= 40) return 'Medium';
        if ($score >= 20) return 'Low';
        return 'Very Low';
    }
}
