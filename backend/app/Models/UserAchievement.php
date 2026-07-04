<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAchievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'achievement_type',
        'progress',
        'target',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'progress' => 'integer',
        'target' => 'integer',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user for the achievement
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark achievement as completed
     */
    public function complete(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Update progress
     */
    public function updateProgress(int $amount): void
    {
        $this->increment('progress', $amount);

        if ($this->progress >= $this->target && !$this->is_completed) {
            $this->complete();
        }
    }

    /**
     * Scope for completed achievements
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope for in-progress achievements
     */
    public function scopeInProgress($query)
    {
        return $query->where('is_completed', false);
    }
}
