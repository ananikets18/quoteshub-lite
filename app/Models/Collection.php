<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Collection extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'is_public',
        'slug',
        'quotes_count',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($collection) {
            if (empty($collection->slug)) {
                $collection->slug = Str::slug($collection->name);
                
                // Ensure slug is globally unique (not just per-user)
                // This matches the database constraint: collections_slug_unique
                $originalSlug = $collection->slug;
                $count = 1;
                while (static::where('slug', $collection->slug)->exists()) {
                    $collection->slug = $originalSlug . '-' . $count++;
                }
            }
        });
    }

    /**
     * Get the user who owns the collection.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the quotes in this collection.
     */
    public function quotes(): BelongsToMany
    {
        return $this->belongsToMany(Quote::class, 'collection_quote')
            ->withTimestamps();
    }
}

