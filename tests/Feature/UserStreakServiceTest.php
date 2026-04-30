<?php

namespace Tests\Feature;

use App\Jobs\CheckUserAchievements;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class UserStreakServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_daily_streak_continues_a_consecutive_streak(): void
    {
        Bus::fake();

        $user = User::factory()->create([
            'daily_streak' => 4,
            'last_active_at' => now()->subDay(),
        ]);

        $user->updateDailyStreak();

        $user->refresh();

        $this->assertSame(5, $user->daily_streak);
        $this->assertTrue($user->last_active_at->isToday());

        Bus::assertDispatched(CheckUserAchievements::class, function (CheckUserAchievements $job) use ($user): bool {
            return $job->userId === $user->id
                && $job->type === 'streak_updated'
                && $job->currentValue === 5;
        });
    }

    public function test_update_daily_streak_resets_after_a_gap(): void
    {
        Bus::fake();

        $user = User::factory()->create([
            'daily_streak' => 8,
            'last_active_at' => now()->subDays(3),
        ]);

        $user->updateDailyStreak();

        $user->refresh();

        $this->assertSame(1, $user->daily_streak);
        $this->assertTrue($user->last_active_at->isToday());

        Bus::assertDispatched(CheckUserAchievements::class, function (CheckUserAchievements $job) use ($user): bool {
            return $job->userId === $user->id
                && $job->type === 'streak_updated'
                && $job->currentValue === 1;
        });
    }
}