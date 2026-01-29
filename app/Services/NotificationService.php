<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Quote;

class NotificationService
{
    /**
     * Create a new follower notification
     */
    public function notifyNewFollower(User $follower, User $followedUser): void
    {
        Notification::create([
            'user_id' => $followedUser->id,
            'actor_id' => $follower->id,
            'type' => Notification::TYPE_NEW_FOLLOWER,
            'data' => [
                'follower_username' => $follower->username,
            ],
        ]);
    }

    /**
     * Create a quote liked notification
     */
    public function notifyQuoteLiked(User $liker, Quote $quote): void
    {
        // Don't notify if user likes their own quote
        if ($liker->id === $quote->user_id) {
            return;
        }

        // Check if there's already a recent notification for this (prevent spam)
        $recentNotification = Notification::where('user_id', $quote->user_id)
            ->where('actor_id', $liker->id)
            ->where('type', Notification::TYPE_QUOTE_LIKED)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->whereJsonContains('data->quote_id', $quote->id)
            ->first();

        if ($recentNotification) {
            return; // Don't create duplicate notification
        }

        Notification::create([
            'user_id' => $quote->user_id,
            'actor_id' => $liker->id,
            'type' => Notification::TYPE_QUOTE_LIKED,
            'data' => [
                'quote_id' => $quote->id,
                'quote_content' => substr($quote->content, 0, 100),
            ],
        ]);
    }

    /**
     * Create a quote saved notification
     */
    public function notifyQuoteSaved(User $saver, Quote $quote): void
    {
        // Don't notify if user saves their own quote
        if ($saver->id === $quote->user_id) {
            return;
        }

        // Check for recent duplicate
        $recentNotification = Notification::where('user_id', $quote->user_id)
            ->where('actor_id', $saver->id)
            ->where('type', Notification::TYPE_QUOTE_SAVED)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->whereJsonContains('data->quote_id', $quote->id)
            ->first();

        if ($recentNotification) {
            return;
        }

        Notification::create([
            'user_id' => $quote->user_id,
            'actor_id' => $saver->id,
            'type' => Notification::TYPE_QUOTE_SAVED,
            'data' => [
                'quote_id' => $quote->id,
                'quote_content' => substr($quote->content, 0, 100),
            ],
        ]);
    }

    /**
     * Create a comment added notification
     */
    public function notifyCommentAdded(User $commenter, Quote $quote, string $commentContent): void
    {
        // Don't notify if user comments on their own quote
        if ($commenter->id === $quote->user_id) {
            return;
        }

        Notification::create([
            'user_id' => $quote->user_id,
            'actor_id' => $commenter->id,
            'type' => Notification::TYPE_COMMENT_ADDED,
            'data' => [
                'quote_id' => $quote->id,
                'quote_content' => substr($quote->content, 0, 100),
                'comment_content' => substr($commentContent, 0, 100),
            ],
        ]);
    }

    /**
     * Create an achievement unlocked notification
     */
    public function notifyAchievementUnlocked(User $user, string $achievementName, string $achievementDescription): void
    {
        Notification::create([
            'user_id' => $user->id,
            'actor_id' => null,
            'type' => Notification::TYPE_ACHIEVEMENT_UNLOCKED,
            'data' => [
                'achievement_name' => $achievementName,
                'achievement_description' => $achievementDescription,
            ],
        ]);
    }

    /**
     * Create an admin warning notification
     */
    public function notifyAdminWarning(User $user, string $reason, ?User $admin = null): void
    {
        Notification::create([
            'user_id' => $user->id,
            'actor_id' => $admin?->id,
            'type' => Notification::TYPE_ADMIN_WARNING,
            'data' => [
                'reason' => $reason,
                'admin_name' => $admin?->name ?? 'Admin',
            ],
        ]);
    }

    /**
     * Create a quote removed notification
     */
    public function notifyQuoteRemoved(User $user, Quote $quote, string $reason, ?User $admin = null): void
    {
        Notification::create([
            'user_id' => $user->id,
            'actor_id' => $admin?->id,
            'type' => Notification::TYPE_QUOTE_REMOVED,
            'data' => [
                'quote_id' => $quote->id,
                'quote_content' => substr($quote->content, 0, 100),
                'reason' => $reason,
                'admin_name' => $admin?->name ?? 'Admin',
            ],
        ]);
    }

    /**
     * Create a quote featured notification
     */
    public function notifyQuoteFeatured(User $user, Quote $quote): void
    {
        Notification::create([
            'user_id' => $user->id,
            'actor_id' => null,
            'type' => Notification::TYPE_QUOTE_FEATURED,
            'data' => [
                'quote_id' => $quote->id,
                'quote_content' => substr($quote->content, 0, 100),
            ],
        ]);
    }

    /**
     * Delete all notifications for a specific quote (when quote is deleted)
     */
    public function deleteQuoteNotifications(Quote $quote): void
    {
        Notification::whereJsonContains('data->quote_id', $quote->id)->delete();
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * Get unread count for a user
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }
}
