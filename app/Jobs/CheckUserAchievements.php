<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\AchievementService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CheckUserAchievements implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $userId,
        public readonly string $type,
        public readonly ?int $currentValue = null,
    ) {}

    public function handle(AchievementService $service): void
    {
        try {
            $user = User::find($this->userId);
            if ($user) {
                $service->checkAchievements($user, $this->type, $this->currentValue);
            }
        } catch (\Exception $e) {
            Log::error('CheckUserAchievements job failed', [
                'user_id' => $this->userId,
                'type' => $this->type,
                'error' => $e->getMessage()
            ]);
        }
    }
}
