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
        });

        static::deleted(function ($follow) {
            User::where('id', $follow->follower_id)->decrement('following_count');
            User::where('id', $follow->following_id)->decrement('followers_count');
        });
    }
}
