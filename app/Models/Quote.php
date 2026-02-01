<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'content',
        'author',
        'source',
        'status',
        'likes_count',
        'saves_count',
        'shares_count',
        'views_count',
    ];

    protected $casts = [
        'likes_count' => 'integer',
        'saves_count' => 'integer',
        'shares_count' => 'integer',
        'views_count' => 'integer',
    ];

    protected $with = ['user'];

    /**
     * Get the user that created the quote
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the categories for the quote
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Get the tags for the quote
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Get the likes for the quote
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    /**
     * Get the saves for the quote
     */
    public function saves(): HasMany
    {
        return $this->hasMany(Save::class);
    }

    /**
     * Get the collections that contain this quote
     */
    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collection_quote')
            ->withTimestamps();
    }

    /**
     * Check if the quote is liked by a user
     */
    public function isLikedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->likes()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if the quote is saved by a user
     */
    public function isSavedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->saves()->where('user_id', $user->id)->exists();
    }

    /**
     * Increment views count
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Scope for approved quotes
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for popular quotes
     */
    public function scopePopular($query)
    {
        return $query->orderBy('likes_count', 'desc');
    }

    /**
     * Scope for trending quotes (recent + popular)
     */
    public function scopeTrending($query)
    {
        return $query->where('created_at', '>=', now()->subDays(7))
            ->orderBy('likes_count', 'desc')
            ->orderBy('views_count', 'desc');
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Decrement tag usage counts when quote is deleted
        static::deleting(function ($quote) {
            try {
                // Decrement usage count for all tags
                if ($quote->tags()->exists()) {
                    $quote->tags()->each(function ($tag) {
                        if ($tag && \Schema::hasColumn('tags', 'usage_count')) {
                            $tag->decrement('usage_count');
                        }
                    });
                }

                // Decrement user's quote count
                if ($quote->user && \Schema::hasColumn('users', 'quotes_count')) {
                    $quote->user->decrement('quotes_count');
                }
            } catch (\Exception $e) {
                \Log::error('Error in Quote deleting event', [
                    'quote_id' => $quote->id,
                    'error' => $e->getMessage()
                ]);
                // Don't throw - allow deletion to proceed
            }
        });
    }
}
