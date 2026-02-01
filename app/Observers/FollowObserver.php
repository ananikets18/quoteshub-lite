<?php

namespace App\Observers;

use App\Models\Follow;
use App\Services\AchievementService;

class FollowObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the Follow "created" event.
     */
    public function created(Follow $follow): void
    {
        // Check follower achievements for the followed user
        $followedUser = \App\Models\User::find($follow->following_id);
        if ($followedUser) {
            $followerCount = $followedUser->followers()->count();
            $this->achievementService->checkAchievements(
                $followedUser,
                'follower_gained',
                $followerCount
            );
        }
    }
}
