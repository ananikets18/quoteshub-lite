<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInteractionPattern extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preferred_hour',
        'avg_quote_length_min',
        'avg_quote_length_max',
        'avg_session_duration',
        'preferred_quote_styles',
        'diversity_score',
    ];

    protected $casts = [
        'preferred_hour' => 'integer',
        'avg_quote_length_min' => 'integer',
        'avg_quote_length_max' => 'integer',
        'avg_session_duration' => 'integer',
        'preferred_quote_styles' => 'array',
        'diversity_score' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
