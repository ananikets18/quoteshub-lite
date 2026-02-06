<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'following_id',
    ];

    /**
     * Get the follower user
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * Get the following user
     */
    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id');
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($follow) {
            User::where('id', $follow->follower_id)->increment('following_count');
            User::where('id', $follow->following_id)->increment('followers_count');
            
            // Invalidate dashboard cache for both users (both Redis and default cache)
            self::clearDashboardCache($follow->follower_id);
            self::clearDashboardCache($follow->following_id);
        });

        static::deleted(function ($follow) {
            User::where('id', $follow->follower_id)->decrement('following_count');
            User::where('id', $follow->following_id)->decrement('followers_count');
            
            // Invalidate dashboard cache for both users (both Redis and default cache)
            self::clearDashboardCache($follow->follower_id);
            self::clearDashboardCache($follow->following_id);
        });
    }

    /**
     * Clear dashboard cache for a user
     */
    protected static function clearDashboardCache($userId)
    {
        $cacheKey = 'dashboard_stats_' . $userId;
        
        // Clear from default cache
        \Illuminate\Support\Facades\Cache::forget($cacheKey);
        
        // Clear from Redis cache if available
        try {
            \Illuminate\Support\Facades\Cache::store('redis')->forget($cacheKey);
        } catch (\Throwable $e) {
            // Redis not available, already cleared from default cache
        }
    }
}
