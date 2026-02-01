<?php

namespace App\Observers;

use App\Models\Quote;
use App\Services\AchievementService;

class QuoteObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the Quote "created" event.
     */
    public function created(Quote $quote): void
    {
        // Check quote creation achievements
        $user = $quote->user;
        if ($user) {
            try {
                $quoteCount = $user->quotes()->count();
                $this->achievementService->checkAchievements($user, 'quote_created', $quoteCount);
            } catch (\Exception $e) {
                \Log::error('Failed to check quote creation achievements: ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle the Quote "updated" event.
     */
    public function updated(Quote $quote): void
    {
        // Check if quote was featured
        if ($quote->isDirty('is_featured') && $quote->is_featured) {
            $user = $quote->user;
            if ($user) {
                try {
                    $this->achievementService->checkAchievements($user, 'quote_featured');
                } catch (\Exception $e) {
                    \Log::error('Failed to check quote featured achievements: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Handle the Quote "deleted" event.
     */
    public function deleted(Quote $quote): void
    {
        //
    }

    /**
     * Handle the Quote "restored" event.
     */
    public function restored(Quote $quote): void
    {
        //
    }

    /**
     * Handle the Quote "force deleted" event.
     */
    public function forceDeleted(Quote $quote): void
    {
        //
    }
}

