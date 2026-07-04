<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Follow;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FollowController extends Controller
{
    /**
     * Follow a user via API.
     */
    public function follow(Request $request, int $userId): JsonResponse
    {
        $userToFollow = User::findOrFail($userId);
        $currentUser = $request->user();

        if ($currentUser->id === $userToFollow->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot follow yourself.',
            ], 400);
        }

        if (!$currentUser->following()->where('following_id', $userToFollow->id)->exists()) {
            // Use Follow model to ensure observers are triggered
            Follow::create([
                'follower_id' => $currentUser->id,
                'following_id' => $userToFollow->id,
            ]);
            
            // Refresh user models to get updated counts
            $currentUser->refresh();
            $userToFollow->refresh();
            
            // Clear dashboard cache for both users to reflect updated counts
            $this->clearDashboardCache($currentUser->id);
            $this->clearDashboardCache($userToFollow->id);
            
            // Trigger notification
            app(NotificationService::class)->notifyNewFollower($currentUser, $userToFollow);
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully followed user.',
        ]);
    }

    /**
     * Unfollow a user via API.
     */
    public function unfollow(Request $request, int $userId): JsonResponse
    {
        $userToUnfollow = User::findOrFail($userId);
        $currentUser = $request->user();

        if ($currentUser->following()->where('following_id', $userToUnfollow->id)->exists()) {
            // Use Follow model to ensure observers are triggered
            Follow::where('follower_id', $currentUser->id)
                ->where('following_id', $userToUnfollow->id)
                ->delete();
            
            // Refresh user models to get updated counts
            $currentUser->refresh();
            $userToUnfollow->refresh();
            
            // Clear dashboard cache for both users to reflect updated counts
            $this->clearDashboardCache($currentUser->id);
            $this->clearDashboardCache($userToUnfollow->id);
            
            // Remove the follower notification
            app(NotificationService::class)->removeFollowerNotification($currentUser, $userToUnfollow);
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully unfollowed user.',
        ]);
    }

    /**
     * Clear dashboard cache for a user from default store.
     */
    private function clearDashboardCache(int $userId): void
    {
        $cacheKey = 'dashboard_stats_' . $userId;
        
        // Clear from default cache
        \Illuminate\Support\Facades\Cache::forget($cacheKey);
    }
}
