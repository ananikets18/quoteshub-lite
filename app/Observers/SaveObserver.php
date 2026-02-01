<?php

namespace App\Observers;

use App\Models\Save;
use App\Services\AchievementService;

class SaveObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the Save "created" event.
     */
    public function created(Save $save): void
    {
        // Check collection achievements for the user who saved
        $user = $save->user;
        if ($user) {
            try {
                $saveCount = $user->saves()->count();
                $this->achievementService->checkAchievements(
                    $user,
                    'quote_saved',
                    $saveCount
                );
            } catch (\Exception $e) {
                \Log::error('Failed to check save achievements: ' . $e->getMessage());
            }
        }
    }
}
