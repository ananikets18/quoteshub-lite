<?php

namespace App\Policies;

use App\Models\Quote;
use App\Models\User;

class QuotePolicy
{
    /**
     * Determine if the user can view the quote.
     */
    public function view(?User $user, Quote $quote): bool
    {
        // Anyone can view approved quotes
        if ($quote->status === 'approved') {
            return true;
        }

        // Only the owner or moderators can view pending/rejected quotes
        return $user && ($user->id === $quote->user_id || $user->isModerator());
    }

    /**
     * Determine if the user can update the quote.
     */
    public function update(User $user, Quote $quote): bool
    {
        // Only the owner can update
        return $user->id === $quote->user_id;
    }

    /**
     * Determine if the user can delete the quote.
     */
    public function delete(User $user, Quote $quote): bool
    {
        // Owner or moderators can delete
        return $user->id === $quote->user_id || $user->isModerator();
    }
}
