<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actor_id',
        'type',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Notification types constants
     */
    const TYPE_NEW_FOLLOWER = 'new_follower';
    const TYPE_QUOTE_LIKED = 'quote_liked';
    const TYPE_QUOTE_SAVED = 'quote_saved';
    const TYPE_COMMENT_ADDED = 'comment_added';
    const TYPE_ACHIEVEMENT_UNLOCKED = 'achievement_unlocked';
    const TYPE_ADMIN_WARNING = 'admin_warning';
    const TYPE_QUOTE_REMOVED = 'quote_removed';
    const TYPE_QUOTE_FEATURED = 'quote_featured';

    /**
     * Get the user who receives the notification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the user who triggered the notification (actor)
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): void
    {
        if ($this->read_at === null) {
            $this->update(['read_at' => now()]);
        }
    }

    /**
     * Check if notification is read
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    /**
     * Check if notification is unread
     */
    public function isUnread(): bool
    {
        return $this->read_at === null;
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    /**
     * Scope for recent notifications (last 30 days)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDays(30));
    }

    /**
     * Scope for specific notification type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get formatted notification message
     */
    public function getMessage(): string
    {
        $actorName = $this->actor ? $this->actor->name : 'Someone';

        return match($this->type) {
            self::TYPE_NEW_FOLLOWER => "{$actorName} started following you",
            self::TYPE_QUOTE_LIKED => "{$actorName} liked your quote",
            self::TYPE_QUOTE_SAVED => "{$actorName} saved your quote",
            self::TYPE_COMMENT_ADDED => "{$actorName} commented on your quote",
            self::TYPE_ACHIEVEMENT_UNLOCKED => "You unlocked a new achievement: {$this->data['achievement_name']}",
            self::TYPE_ADMIN_WARNING => "Admin warning: {$this->data['reason']}",
            self::TYPE_QUOTE_REMOVED => "Your quote was removed: {$this->data['reason']}",
            self::TYPE_QUOTE_FEATURED => "Your quote was featured!",
            default => "You have a new notification",
        };
    }

    /**
     * Get notification icon
     */
    public function getIcon(): string
    {
        return match($this->type) {
            self::TYPE_NEW_FOLLOWER => 'user-plus',
            self::TYPE_QUOTE_LIKED => 'heart',
            self::TYPE_QUOTE_SAVED => 'bookmark',
            self::TYPE_COMMENT_ADDED => 'message-circle',
            self::TYPE_ACHIEVEMENT_UNLOCKED => 'trophy',
            self::TYPE_ADMIN_WARNING => 'alert-triangle',
            self::TYPE_QUOTE_REMOVED => 'x-circle',
            self::TYPE_QUOTE_FEATURED => 'star',
            default => 'bell',
        };
    }

    /**
     * Get notification URL
     */
    public function getUrl(): ?string
    {
        return match($this->type) {
            self::TYPE_NEW_FOLLOWER => $this->actor ? "/u/{$this->actor->username}" : null,
            self::TYPE_QUOTE_LIKED, self::TYPE_QUOTE_SAVED, self::TYPE_COMMENT_ADDED => 
                isset($this->data['quote_id']) ? "/quotes/{$this->data['quote_id']}" : null,
            self::TYPE_ACHIEVEMENT_UNLOCKED => "/profile",
            self::TYPE_ADMIN_WARNING, self::TYPE_QUOTE_REMOVED => "/dashboard",
            self::TYPE_QUOTE_FEATURED => isset($this->data['quote_id']) ? "/quotes/{$this->data['quote_id']}" : null,
            default => null,
        };
    }
}
