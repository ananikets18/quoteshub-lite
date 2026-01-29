<?php

namespace App\Observers;

use App\Models\Like;
use App\Services\AchievementService;

class LikeObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the Like "created" event.
     */
    public function created(Like $like): void
    {
        // Check popularity achievements for the quote owner
        $quote = $like->quote;
        if ($quote && $quote->user) {
            $this->achievementService->checkAchievements(
                $quote->user,
                'quote_liked',
                $quote->id
            );
        }
    }
}
