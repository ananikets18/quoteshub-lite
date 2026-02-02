<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Quote;
use App\Models\UserNotificationPreference;
use App\Events\NotificationSent;


class NotificationService
{
    /**
     * Create a new follower notification
     */
    public function notifyNewFollower(User $follower, User $followedUser): void
    {
        $this->createAndBroadcast([
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

        $this->createAndBroadcast([
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

        $this->createAndBroadcast([
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
     * Remove quote liked notification when unlike happens
     */
    public function removeQuoteLikedNotification(User $liker, Quote $quote): void
    {
        // Don't try to remove if user unliked their own quote
        if ($liker->id === $quote->user_id) {
            return;
        }

        // Delete the notification
        Notification::where('user_id', $quote->user_id)
            ->where('actor_id', $liker->id)
            ->where('type', Notification::TYPE_QUOTE_LIKED)
            ->whereJsonContains('data->quote_id', $quote->id)
            ->delete();
    }

    /**
     * Remove quote saved notification when unsave happens
     */
    public function removeQuoteSavedNotification(User $saver, Quote $quote): void
    {
        // Don't try to remove if user unsaved their own quote
        if ($saver->id === $quote->user_id) {
            return;
        }

        // Delete the notification
        Notification::where('user_id', $quote->user_id)
            ->where('actor_id', $saver->id)
            ->where('type', Notification::TYPE_QUOTE_SAVED)
            ->whereJsonContains('data->quote_id', $quote->id)
            ->delete();
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

    /**
     * Check if user has enabled this notification type
     */
    protected function isNotificationEnabled(User $user, string $notificationType): bool
    {
        $preferences = $user->notificationPreferences;
        
        if (!$preferences) {
            return true; // Default to enabled if no preferences set
        }

        return $preferences->isEnabled($notificationType);
    }

    /**
     * Create and broadcast a notification
     */
    protected function createAndBroadcast(array $data): ?Notification
    {
        $user = User::find($data['user_id']);
        
        // Extract notification type from data
        $typeMap = [
            Notification::TYPE_NEW_FOLLOWER => 'new_follower',
            Notification::TYPE_QUOTE_LIKED => 'quote_liked',
            Notification::TYPE_QUOTE_SAVED => 'quote_saved',
            Notification::TYPE_COMMENT_ADDED => 'comment_added',
            Notification::TYPE_ACHIEVEMENT_UNLOCKED => 'achievement_unlocked',
            Notification::TYPE_ADMIN_WARNING => 'admin_warning',
            Notification::TYPE_QUOTE_REMOVED => 'quote_removed',
        ];

        $preferenceKey = $typeMap[$data['type']] ?? null;

        // Check if user has this notification type enabled
        if ($preferenceKey && !$this->isNotificationEnabled($user, $preferenceKey)) {
            return null; // User has disabled this notification type
        }

        // Create the notification
        $notification = Notification::create($data);

        // Load the actor relationship for broadcasting
        $notification->load('actor');

        // Broadcast the notification in real-time
        broadcast(new NotificationSent($notification))->toOthers();

        return $notification;
    }

    /**
     * Group similar notifications (e.g., "John and 5 others liked your quote")
     */
    public function groupSimilarNotifications(User $user): array
    {
        $preferences = $user->notificationPreferences;
        
        if (!$preferences || !$preferences->group_similar_notifications) {
            return []; // Grouping disabled
        }

        // Get recent unread notifications
        $notifications = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->where('created_at', '>=', now()->subHours(24))
            ->with('actor')
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = [];

        // Group by type and related item (e.g., quote_id)
        foreach ($notifications as $notification) {
            $key = $notification->type;
            
            // Add quote_id to key if it exists
            if (isset($notification->data['quote_id'])) {
                $key .= '_' . $notification->data['quote_id'];
            }

            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'type' => $notification->type,
                    'notifications' => [],
                    'count' => 0,
                    'latest' => $notification,
                ];
            }

            $grouped[$key]['notifications'][] = $notification;
            $grouped[$key]['count']++;
        }

        // Filter groups with more than 1 notification
        return array_filter($grouped, fn($group) => $group['count'] > 1);
    }
}

