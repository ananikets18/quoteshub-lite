<?php

namespace App\Services;

use App\Models\Quote;
use App\Models\User;
use App\Models\UserCategoryPreference;
use App\Models\UserAuthorPreference;
use App\Models\UserInteractionPattern;
use App\Models\UserNotInterested;
use App\Models\Like;
use App\Models\Save;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class RecommendationService
{
    protected $preferenceAnalyzer;

    public function __construct(UserPreferenceAnalyzer $preferenceAnalyzer)
    {
        $this->preferenceAnalyzer = $preferenceAnalyzer;
    }
    /**
     * Get personalized quotes for a user
     * 
     * @param User $user
     * @param int $limit
     * @param float $personalizedRatio (0.7 = 70% personalized, 30% discovery)
     * @return Collection
     */
    public function getPersonalizedFeed(User $user, int $limit = 20, float $personalizedRatio = 0.7): Collection
    {
        $personalizedCount = (int) ($limit * $personalizedRatio);
        $discoveryCount = $limit - $personalizedCount;

        // Get personalized quotes based on user preferences
        $personalizedQuotes = $this->getPersonalizedQuotes($user, $personalizedCount);
        
        // Get discovery quotes (popular but from unexplored categories/authors)
        $discoveryQuotes = $this->getDiscoveryQuotes($user, $discoveryCount, $personalizedQuotes->pluck('id')->toArray());
        
        // Merge and shuffle for variety
        $allQuotes = $personalizedQuotes->concat($discoveryQuotes);
        
        return $allQuotes->shuffle()->take($limit);
    }

    /**
     * Get personalized quotes based on user's engagement history
     */
    protected function getPersonalizedQuotes(User $user, int $limit): Collection
    {
        // Get user's top categories and authors
        $topCategories = $this->getUserTopCategories($user, 5);
        $topAuthors = $this->getUserTopAuthors($user, 5);
        
        // Build query
        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->where('user_id', '!=', $user->id); // Don't recommend own quotes

        // Apply not interested filters
        $this->applyNotInterestedFilters($query, $user);

        // Apply quote length preferences
        $this->applyLengthPreference($query, $user);

        // Filter by preferred categories or authors
        if ($topCategories->isNotEmpty() || $topAuthors->isNotEmpty()) {
            $query->where(function ($q) use ($topCategories, $topAuthors) {
                // Match categories
                if ($topCategories->isNotEmpty()) {
                    $q->whereHas('categories', function ($categoryQuery) use ($topCategories) {
                        $categoryQuery->whereIn('categories.id', $topCategories->pluck('category_id'));
                    });
                }
                
                // OR match authors
                if ($topAuthors->isNotEmpty()) {
                    $q->orWhereIn('user_id', $topAuthors->pluck('author_id'));
                }
            });
        }

        // Exclude already liked/saved quotes
        $query->whereDoesntHave('likes', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->whereDoesntHave('saves', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });

        // Apply recency and quality scoring
        $query->where('created_at', '>=', now()->subMonths(6)) // Recent quotes
              ->where('likes_count', '>=', 1); // Some quality signal

        // Order by engagement score
        $query->orderByDesc(DB::raw('(likes_count * 3 + saves_count * 5 + views_count * 0.1)'))
              ->orderByDesc('created_at');

        return $query->take($limit)->get();
    }

    /**
     * Get discovery quotes from unexplored areas
     */
    protected function getDiscoveryQuotes(User $user, int $limit, array $excludeIds = []): Collection
    {
        // Get categories user hasn't explored much
        $exploredCategories = UserCategoryPreference::where('user_id', $user->id)
            ->pluck('category_id')
            ->toArray();

        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->where('user_id', '!=', $user->id)
            ->whereNotIn('id', $excludeIds);

        // Find quotes from unexplored categories
        if (!empty($exploredCategories)) {
            $query->whereHas('categories', function ($q) use ($exploredCategories) {
                $q->whereNotIn('categories.id', $exploredCategories);
            });
        }

        // Get popular quotes for discovery
        $query->where('likes_count', '>=', 5)
              ->where('created_at', '>=', now()->subMonths(3))
              ->orderByDesc('likes_count')
              ->orderByDesc('created_at');

        return $query->take($limit)->get();
    }

    /**
     * Get quotes similar to a specific quote
     */
    public function getSimilarQuotes(Quote $quote, ?User $user = null, int $limit = 10): Collection
    {
        $query = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->where('id', '!=', $quote->id);

        // Match by categories
        $categoryIds = $quote->categories->pluck('id')->toArray();
        if (!empty($categoryIds)) {
            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
        }

        // Prefer same author's quotes
        $query->orderByRaw('CASE WHEN user_id = ? THEN 0 ELSE 1 END', [$quote->user_id])
              ->orderByDesc('likes_count')
              ->orderByDesc('created_at');

        if ($user) {
            // Exclude already interacted quotes
            $query->whereDoesntHave('likes', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        return $query->take($limit)->get();
    }

    /**
     * Get recommended authors for a user
     */
    public function getRecommendedAuthors(User $user, int $limit = 10): Collection
    {
        // Get users who create quotes in categories the user likes
        $topCategories = $this->getUserTopCategories($user, 5);
        
        if ($topCategories->isEmpty()) {
            // New user: return trending authors
            return User::has('quotes')
                ->where('id', '!=', $user->id)
                ->orderByDesc('quotes_count')
                ->take($limit)
                ->get();
        }

        $categoryIds = $topCategories->pluck('category_id')->toArray();

        $authors = User::whereHas('quotes', function ($q) use ($categoryIds) {
                $q->approved()
                  ->whereHas('categories', function ($catQuery) use ($categoryIds) {
                      $catQuery->whereIn('categories.id', $categoryIds);
                  });
            })
            ->where('id', '!=', $user->id)
            ->whereDoesntHave('followers', function ($q) use ($user) {
                $q->where('follower_id', $user->id);
            })
            ->withCount(['quotes as approved_quotes_count' => function ($q) {
                $q->approved();
            }])
            ->orderByDesc('approved_quotes_count')
            ->take($limit)
            ->get();

        return $authors;
    }

    /**
     * Get collaborative filtering recommendations (users who liked X also liked Y)
     */
    public function getCollaborativeRecommendations(User $user, int $limit = 10): Collection
    {
        // Find similar users based on likes
        $userLikedQuoteIds = Like::where('user_id', $user->id)
            ->pluck('quote_id')
            ->toArray();

        if (empty($userLikedQuoteIds)) {
            return collect();
        }

        // Find users who liked the same quotes
        $similarUserIds = Like::whereIn('quote_id', $userLikedQuoteIds)
            ->where('user_id', '!=', $user->id)
            ->select('user_id', DB::raw('COUNT(*) as common_likes'))
            ->groupBy('user_id')
            ->having('common_likes', '>=', 2) // At least 2 common likes
            ->orderByDesc('common_likes')
            ->take(20) // Top 20 similar users
            ->pluck('user_id')
            ->toArray();

        if (empty($similarUserIds)) {
            return collect();
        }

        // Get quotes liked by similar users but not by current user
        $recommendedQuotes = Quote::with(['user', 'categories', 'tags'])
            ->approved()
            ->whereHas('likes', function ($q) use ($similarUserIds) {
                $q->whereIn('user_id', $similarUserIds);
            })
            ->whereDoesntHave('likes', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->whereDoesntHave('saves', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->select('quotes.*', DB::raw('COUNT(likes.id) as similar_user_likes'))
            ->join('likes', 'quotes.id', '=', 'likes.quote_id')
            ->whereIn('likes.user_id', $similarUserIds)
            ->groupBy('quotes.id')
            ->orderByDesc('similar_user_likes')
            ->orderByDesc('quotes.likes_count')
            ->take($limit)
            ->get();

        return $recommendedQuotes;
    }

    /**
     * Get user's top categories by engagement
     */
    protected function getUserTopCategories(User $user, int $limit = 5): Collection
    {
        return UserCategoryPreference::where('user_id', $user->id)
            ->orderByDesc('engagement_score')
            ->take($limit)
            ->get();
    }

    /**
     * Get user's top authors by engagement
     */
    protected function getUserTopAuthors(User $user, int $limit = 5): Collection
    {
        return UserAuthorPreference::where('user_id', $user->id)
            ->orderByDesc('engagement_score')
            ->take($limit)
            ->get();
    }

    /**
     * Track user interaction and update preferences
     */
    public function trackInteraction(User $user, Quote $quote, string $interactionType): void
    {
        // Update category preferences
        foreach ($quote->categories as $category) {
            $preference = UserCategoryPreference::firstOrCreate(
                ['user_id' => $user->id, 'category_id' => $category->id],
                ['view_count' => 0, 'like_count' => 0, 'save_count' => 0, 'share_count' => 0]
            );

            switch ($interactionType) {
                case 'view':
                    $preference->view_count++;
                    break;
                case 'like':
                    $preference->like_count++;
                    break;
                case 'save':
                    $preference->save_count++;
                    break;
                case 'share':
                    $preference->share_count++;
                    break;
            }

            $preference->last_interacted_at = now();
            $preference->save();
            $preference->calculateEngagementScore();
        }

        // Update author preferences
        $authorPreference = UserAuthorPreference::firstOrCreate(
            ['user_id' => $user->id, 'author_id' => $quote->user_id],
            ['view_count' => 0, 'like_count' => 0, 'save_count' => 0]
        );

        switch ($interactionType) {
            case 'view':
                $authorPreference->view_count++;
                break;
            case 'like':
                $authorPreference->like_count++;
                break;
            case 'save':
                $authorPreference->save_count++;
                break;
        }

        $authorPreference->last_interacted_at = now();
        $authorPreference->save();
        $authorPreference->calculateEngagementScore();

        // Update quote length preferences periodically
        if (in_array($interactionType, ['like', 'save'])) {
            $this->preferenceAnalyzer->analyzeQuoteLengthPreference($user);
        }
    }

    /**
     * Apply "not interested" filters to quote query
     */
    protected function applyNotInterestedFilters($query, User $user): void
    {
        // Exclude quotes user marked as not interested
        $notInterestedQuotes = UserNotInterested::quotesForUser($user->id)
            ->pluck('item_id')
            ->toArray();

        if (!empty($notInterestedQuotes)) {
            $query->whereNotIn('id', $notInterestedQuotes);
        }

        // Exclude quotes from categories user is not interested in
        $notInterestedCategories = UserNotInterested::categoriesForUser($user->id)
            ->pluck('item_id')
            ->toArray();

        if (!empty($notInterestedCategories)) {
            $query->whereDoesntHave('categories', function ($q) use ($notInterestedCategories) {
                $q->whereIn('categories.id', $notInterestedCategories);
            });
        }

        // Exclude quotes from authors user is not interested in
        $notInterestedAuthors = UserNotInterested::authorsForUser($user->id)
            ->pluck('item_id')
            ->toArray();

        if (!empty($notInterestedAuthors)) {
            $query->whereNotIn('user_id', $notInterestedAuthors);
        }
    }

    /**
     * Apply quote length preference filter
     */
    protected function applyLengthPreference($query, User $user): void
    {
        $lengthPreference = $this->preferenceAnalyzer->getPreferredQuoteLength($user);

        if ($lengthPreference) {
            $query->whereRaw('LENGTH(content) BETWEEN ? AND ?', [
                $lengthPreference['min'],
                $lengthPreference['max']
            ]);
        }
    }

    /**
     * Mark item as not interested
     */
    public function markNotInterested(User $user, string $itemType, int $itemId, ?string $reason = null): bool
    {
        try {
            UserNotInterested::create([
                'user_id' => $user->id,
                'item_type' => $itemType,
                'item_id' => $itemId,
                'reason' => $reason,
            ]);

            // If marking category as not interested, reduce its engagement score
            if ($itemType === 'category') {
                $preference = UserCategoryPreference::where('user_id', $user->id)
                    ->where('category_id', $itemId)
                    ->first();

                if ($preference) {
                    $preference->engagement_score = max(0, $preference->engagement_score - 50);
                    $preference->save();
                }
            }

            // If marking author as not interested, reduce their engagement score
            if ($itemType === 'author') {
                $preference = UserAuthorPreference::where('user_id', $user->id)
                    ->where('author_id', $itemId)
                    ->first();

                if ($preference) {
                    $preference->engagement_score = max(0, $preference->engagement_score - 50);
                    $preference->save();
                }
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Undo not interested
     */
    public function undoNotInterested(User $user, string $itemType, int $itemId): bool
    {
        return UserNotInterested::where('user_id', $user->id)
            ->where('item_type', $itemType)
            ->where('item_id', $itemId)
            ->delete() > 0;
    }
}
