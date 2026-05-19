<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\QuoteView;

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
     * Get the comments for the quote
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->with('user', 'replies.user')->latest();
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
        // Buffer view in cache; flush via DB occasionally
        $cacheKey = 'quote_views_' . $this->id;
        $buffered = \Illuminate\Support\Facades\Cache::increment($cacheKey);

        // Keep the rendered count in sync with the buffered total for this request.
        $this->views_count = (int) $this->views_count + 1;

        // Flush to DB every 10 views to reduce write pressure
        if ($buffered % 10 === 0) {
            $this->increment('views_count', 10);
            \Illuminate\Support\Facades\Cache::put($cacheKey, 0, now()->addHour());
        }
    }

    /**
     * Record a view only if this user/session has not viewed the quote recently.
     */
    public function recordUniqueView(?User $user, ?string $sessionId, string $source = 'feed', int $durationSeconds = 0, int $windowMinutes = 60): bool
    {
        $identityColumn = $user ? 'user_id' : 'session_id';
        $identityValue = $user ? $user->id : $sessionId;

        if (!$identityValue) {
            return false;
        }

        $recentViewExists = QuoteView::where('quote_id', $this->id)
            ->where($identityColumn, $identityValue)
            ->where('created_at', '>=', now()->subMinutes($windowMinutes))
            ->exists();

        if ($recentViewExists) {
            return false;
        }

        QuoteView::create([
            'user_id' => $user?->id,
            'quote_id' => $this->id,
            'session_id' => $user ? null : $sessionId,
            'duration_seconds' => $durationSeconds,
            'source' => $source,
        ]);

        $this->increment('views_count');
        $this->views_count = (int) $this->views_count + 1;

        return true;
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

        // Update category counts when quote status changes to approved
        static::updated(function ($quote) {
            try {
                // If quote status changed to approved, increment category counts
                if ($quote->isDirty('status') && $quote->status === 'approved' && $quote->getOriginal('status') !== 'approved') {
                    if ($quote->categories()->exists()) {
                        $quote->categories()->each(function ($category) {
                            $category->increment('quotes_count');
                        });
                    }
                }
                
                // If quote status changed from approved to something else, decrement category counts
                if ($quote->isDirty('status') && $quote->status !== 'approved' && $quote->getOriginal('status') === 'approved') {
                    if ($quote->categories()->exists()) {
                        $quote->categories()->each(function ($category) {
                            $category->decrement('quotes_count');
                        });
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error in Quote updated event', [
                    'quote_id' => $quote->id,
                    'error' => $e->getMessage()
                ]);
            }
        });

        // Decrement tag usage counts and category counts when quote is deleted
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

                // Decrement category quotes_count if quote was approved
                if ($quote->status === 'approved' && $quote->categories()->exists()) {
                    $quote->categories()->each(function ($category) {
                        $category->decrement('quotes_count');
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
