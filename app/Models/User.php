<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'bio',
        'avatar',
        'cover_image',
        'website',
        'location',
        'role',
        
        // Cached counter columns - NOT source of truth
        // These are denormalized for performance
        // Update via events/observers to keep in sync
        'quotes_count',
        'followers_count',
        'following_count',
        
        // Activity tracking
        'daily_streak',      // TODO: Consider moving to user_stats table
        'last_active_at',    // Changed from last_active_date for precision
        
        // Status flags
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_active_at' => 'datetime',  // Changed from date to datetime
            'is_active' => 'boolean',
            
            // Cached counters (denormalized)
            'quotes_count' => 'integer',
            'followers_count' => 'integer',
            'following_count' => 'integer',
            'daily_streak' => 'integer',
        ];
    }

    /**
     * Get the quotes created by the user
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Get the likes made by the user
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    /**
     * Get the saves made by the user
     */
    public function saves(): HasMany
    {
        return $this->hasMany(Save::class);
    }

    /**
     * Get the users that this user is following
     */
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    /**
     * Get the users that are following this user
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withTimestamps();
    }
    
    /**
     * Get the user's collections
     */
    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }

    /**
     * Get the achievements for the user
     */
    public function achievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class);
    }

    /**
     * Get the user's notifications
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class)->orderByDesc('created_at');
    }

    /**
     * Get the user's category preferences for recommendations
     */
    public function categoryPreferences(): HasMany
    {
        return $this->hasMany(\App\Models\UserCategoryPreference::class);
    }

    /**
     * Get the user's author preferences for recommendations
     */
    public function authorPreferences(): HasMany
    {
        return $this->hasMany(\App\Models\UserAuthorPreference::class);
    }

    /**
     * Get the user's interaction pattern
     */
    public function interactionPattern(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\UserInteractionPattern::class);
    }

    /**
     * Check if user is following another user
     */
    public function isFollowing(User $user): bool
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    /**
     * Check if user is followed by another user
     */
    public function isFollowedBy(User $user): bool
    {
        return $this->followers()->where('follower_id', $user->id)->exists();
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is moderator or admin
     */
    public function isModerator(): bool
    {
        return in_array($this->role, ['moderator', 'admin']);
    }

    /**
     * Update daily streak
     * 
     * TODO: Consider moving streak logic to a separate service
     * or computing from activity logs instead of storing in users table
     */
    public function updateDailyStreak(): void
    {
        $today = now()->toDateString();
        $lastActive = $this->last_active_at?->toDateString();

        if ($lastActive === $today) {
            return; // Already active today
        }

        $yesterday = now()->subDay()->toDateString();

        if ($lastActive === $yesterday) {
            // Continue streak
            $this->increment('daily_streak');
        } else {
            // Reset streak
            $this->daily_streak = 1;
        }

        $this->last_active_at = now();
        $this->save();
    }

    /**
     * Get user's liked quotes
     */
    public function likedQuotes(): BelongsToMany
    {
        return $this->belongsToMany(Quote::class, 'likes')
            ->withTimestamps();
    }

    /**
     * Get user's saved quotes
     */
    public function savedQuotes(): BelongsToMany
    {
        return $this->belongsToMany(Quote::class, 'saves')
            ->withPivot('collection')
            ->withTimestamps();
    }

    /**
     * Get unread notifications count
     */
    public function unreadNotificationsCount(): int
    {
        return $this->notifications()->whereNull('read_at')->count();
    }
}
