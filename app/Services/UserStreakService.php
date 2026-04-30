<?php

namespace App\Services;

use App\Jobs\CheckUserAchievements;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserStreakService
{
    public function update(User $user): void
    {
        $today = now()->toDateString();
        $lastActive = $user->last_active_at?->toDateString();

        if ($lastActive === $today) {
            return;
        }

        $yesterday = now()->subDay()->toDateString();

        DB::transaction(function () use ($user, $today, $lastActive, $yesterday): void {
            $lockedUser = User::whereKey($user->id)->lockForUpdate()->first();

            if (! $lockedUser) {
                return;
            }

            if ($lockedUser->last_active_at?->toDateString() === $today) {
                return;
            }

            if ($lastActive === $yesterday) {
                $lockedUser->increment('daily_streak');
            } else {
                $lockedUser->daily_streak = 1;
            }

            $lockedUser->last_active_at = now();
            $lockedUser->save();

            $user->refresh();

            CheckUserAchievements::dispatch($user->id, 'streak_updated', $user->daily_streak)->afterCommit();
        });
    }
}