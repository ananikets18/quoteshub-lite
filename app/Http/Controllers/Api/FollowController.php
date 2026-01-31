<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            $currentUser->following()->attach($userToFollow->id);
            $currentUser->increment('following_count');
            $userToFollow->increment('followers_count');
            
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
            $currentUser->following()->detach($userToUnfollow->id);
            $currentUser->decrement('following_count');
            $userToUnfollow->decrement('followers_count');
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully unfollowed user.',
        ]);
    }
}
