<?php

namespace App\Jobs;

use App\Models\Quote;
use App\Models\User;
use App\Services\RecommendationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class TrackUserInteraction implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $userId,
        public readonly int $quoteId,
        public readonly string $interactionType,
    ) {}

    public function handle(RecommendationService $service): void
    {
        try {
            $user = User::find($this->userId);
            $quote = Quote::with('categories')->find($this->quoteId);

            if ($user && $quote) {
                $service->trackInteraction($user, $quote, $this->interactionType);
            }
        } catch (\Exception $e) {
            Log::error('TrackUserInteraction job failed', [
                'user_id' => $this->userId,
                'quote_id' => $this->quoteId,
                'type' => $this->interactionType,
                'error' => $e->getMessage()
            ]);
        }
    }
}
