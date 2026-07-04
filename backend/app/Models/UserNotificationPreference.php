<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserNotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'new_follower',
        'quote_liked',
        'quote_saved',
        'comment_added',
        'achievement_unlocked',
        'admin_warning',
        'quote_removed',
        'quote_featured',
        'in_app_notifications',
        'email_notifications',
        'push_notifications',
        'notification_sounds',
        'group_similar_notifications',
    ];

    protected $casts = [
        'new_follower' => 'boolean',
        'quote_liked' => 'boolean',
        'quote_saved' => 'boolean',
        'comment_added' => 'boolean',
        'achievement_unlocked' => 'boolean',
        'admin_warning' => 'boolean',
        'quote_removed' => 'boolean',
        'quote_featured' => 'boolean',
        'in_app_notifications' => 'boolean',
        'email_notifications' => 'boolean',
        'push_notifications' => 'boolean',
        'notification_sounds' => 'boolean',
        'group_similar_notifications' => 'boolean',
    ];

    /**
     * Get the user that owns the preferences
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a specific notification type is enabled
     */
    public function isEnabled(string $notificationType): bool
    {
        return $this->{$notificationType} ?? true;
    }

    /**
     * Get all enabled notification types
     */
    public function getEnabledTypes(): array
    {
        $types = [
            'new_follower',
            'quote_liked',
            'quote_saved',
            'comment_added',
            'achievement_unlocked',
            'admin_warning',
            'quote_removed',
            'quote_featured',
        ];

        return array_filter($types, fn($type) => $this->{$type});
    }
}
