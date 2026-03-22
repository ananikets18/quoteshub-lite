<?php

namespace App\Jobs;

use App\Mail\NewFollowerMail;
use App\Mail\QuoteLikedMail;
use App\Models\Quote;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
                    // In-app notification
                    $notificationService->notifyQuoteLiked($actor, $quote);

                    // Email notification (if user opted in)
                    if ($this->emailEnabled($targetUser, 'quote_liked') && $actor->id !== $targetUser->id) {
                        Mail::to($targetUser->email)->queue(new QuoteLikedMail($targetUser, $actor, $quote));
                    }
                }
            } elseif ($this->type === 'saved' && $this->quoteId) {
                $quote = Quote::find($this->quoteId);
                if ($quote) {
                    $notificationService->notifyQuoteSaved($actor, $quote);
                    // Note: no email for saves to reduce inbox noise
                }
            } elseif ($this->type === 'follower') {
                // In-app notification
                $notificationService->notifyNewFollower($actor, $targetUser);

                // Email notification (if user opted in)
                if ($this->emailEnabled($targetUser, 'new_follower')) {
                    Mail::to($targetUser->email)->queue(new NewFollowerMail($targetUser, $actor));
                }
            } elseif ($this->type === 'comment' && $this->quoteId && $this->commentContent) {
                $quote = Quote::find($this->quoteId);
                if ($quote) {
                    $notificationService->notifyCommentAdded($actor, $quote, $this->commentContent);
                    // No email for comments by default (could be noisy)
                }
            }
        } catch (\Exception $e) {
            Log::error('SendQuoteNotification job failed', [
                'type'     => $this->type,
                'actor_id' => $this->actorId,
                'target_id' => $this->targetUserId,
                'error'    => $e->getMessage()
            ]);
        }
    }

    /**
     * Check if the target user has email notifications enabled for this type.
     */
    protected function emailEnabled(User $user, string $preferenceKey): bool
    {
        $prefs = $user->notificationPreferences;

        if (!$prefs) {
            return false;
        }

        // Must have email_notifications globally enabled AND the specific type enabled
        return $prefs->email_notifications && $prefs->isEnabled($preferenceKey);
    }
}
