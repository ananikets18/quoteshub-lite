<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAuthorPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'author_id',
        'view_count',
        'like_count',
        'save_count',
        'follow_exists',
        'engagement_score',
        'last_interacted_at',
    ];

    protected $casts = [
        'view_count' => 'integer',
        'like_count' => 'integer',
        'save_count' => 'integer',
        'follow_exists' => 'integer',
        'engagement_score' => 'decimal:2',
        'last_interacted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Calculate and update engagement score
     */
    public function calculateEngagementScore(): void
    {
        $score = ($this->save_count * 10) + 
                 ($this->like_count * 5) + 
                 ($this->view_count * 1) + 
                 ($this->follow_exists * 50); // Follow is strong signal
        
        // Recency bonus
        if ($this->last_interacted_at) {
            $daysAgo = $this->last_interacted_at->diffInDays(now());
            $recencyBonus = max(0, 1 - ($daysAgo / 30)) * 0.2;
            $score = $score * (1 + $recencyBonus);
        }
        
        $this->engagement_score = round($score, 2);
        $this->save();
    }
}
