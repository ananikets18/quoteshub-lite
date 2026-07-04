<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'usage_count',
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    /**
     * Get the quotes for the tag
     */
    public function quotes(): BelongsToMany
    {
        return $this->belongsToMany(Quote::class);
    }

    /**
     * Scope for popular tags
     */
    public function scopePopular($query, $limit = 20)
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }
}
