<?php

namespace App\Jobs;

use App\Models\Quote;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendQuoteNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $type,
        public readonly int $actorId,
        public readonly int $targetUserId,
        public readonly ?int $quoteId = null,
        public readonly ?string $commentContent = null
    ) {}

    public function handle(NotificationService $notificationService): void
    {
        try {
            $actor = User::find($this->actorId);
            $targetUser = User::find($this->targetUserId);
            
            if (!$actor || !$targetUser) {
                return;
            }

            if ($this->type === 'liked' && $this->quoteId) {
                $quote = Quote::find($this->quoteId);
                if ($quote) {
                    $notificationService->notifyQuoteLiked($actor, $quote);
                }
            } elseif ($this->type === 'saved' && $this->quoteId) {
                $quote = Quote::find($this->quoteId);
                if ($quote) {
                    $notificationService->notifyQuoteSaved($actor, $quote);
                }
            } elseif ($this->type === 'follower') {
                $notificationService->notifyNewFollower($actor, $targetUser);
            } elseif ($this->type === 'comment' && $this->quoteId && $this->commentContent) {
                $quote = Quote::find($this->quoteId);
                if ($quote) {
                    $notificationService->notifyCommentAdded($actor, $quote, $this->commentContent);
                }
            }
        } catch (\Exception $e) {
            Log::error('SendQuoteNotification job failed', [
                'type' => $this->type,
                'actor_id' => $this->actorId,
                'target_id' => $this->targetUserId,
                'error' => $e->getMessage()
            ]);
        }
    }
}
