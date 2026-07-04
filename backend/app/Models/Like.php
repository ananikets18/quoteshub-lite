<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quote_id',
    ];

    /**
     * Get the user that liked the quote
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the quote that was liked
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }


    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($like) {
            $like->quote->increment('likes_count');
            
            // Track interaction for recommendations
            if ($like->user) {
                $recommendationService = app(\App\Services\RecommendationService::class);
                $recommendationService->trackInteraction($like->user, $like->quote, 'like');
            }
        });

        static::deleted(function ($like) {
            $like->quote->decrement('likes_count');
        });
    }
}

