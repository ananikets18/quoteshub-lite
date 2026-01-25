<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Save extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quote_id',
        'collection',
    ];

    /**
     * Get the user that saved the quote
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the quote that was saved
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

        static::created(function ($save) {
            $save->quote->increment('saves_count');
        });

        static::deleted(function ($save) {
            $save->quote->decrement('saves_count');
        });
    }
}
