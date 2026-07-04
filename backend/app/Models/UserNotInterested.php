<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserNotInterested extends Model
{
    use HasFactory;

    protected $table = 'user_not_interested';

    protected $fillable = [
        'user_id',
        'item_type',
        'item_id',
        'reason',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the item (polymorphic helper)
     */
    public function item()
    {
        switch ($this->item_type) {
            case 'quote':
                return Quote::find($this->item_id);
            case 'category':
                return Category::find($this->item_id);
            case 'author':
                return User::find($this->item_id);
            default:
                return null;
        }
    }

    /**
     * Scope to get not interested quotes for a user
     */
    public function scopeQuotesForUser($query, $userId)
    {
        return $query->where('user_id', $userId)
                    ->where('item_type', 'quote');
    }

    /**
     * Scope to get not interested categories for a user
     */
    public function scopeCategoriesForUser($query, $userId)
    {
        return $query->where('user_id', $userId)
                    ->where('item_type', 'category');
    }

    /**
     * Scope to get not interested authors for a user
     */
    public function scopeAuthorsForUser($query, $userId)
    {
        return $query->where('user_id', $userId)
                    ->where('item_type', 'author');
    }
}
