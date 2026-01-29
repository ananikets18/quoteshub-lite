<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserAchievement;
use App\Models\Quote;

class AchievementService
{
    // Achievement type constants
    const FIRST_QUOTE = 'first_quote';
    const QUOTE_MASTER_5 = 'quote_master_5';
    const QUOTE_MASTER_10 = 'quote_master_10';
    const QUOTE_MASTER_25 = 'quote_master_25';
    const QUOTE_MASTER_50 = 'quote_master_50';
    const QUOTE_MASTER_100 = 'quote_master_100';
    
    const POPULAR_QUOTE_10 = 'popular_quote_10';
    const POPULAR_QUOTE_50 = 'popular_quote_50';
    const POPULAR_QUOTE_100 = 'popular_quote_100';
    const POPULAR_QUOTE_500 = 'popular_quote_500';
    
    const FIRST_FOLLOWER = 'first_follower';
    const INFLUENCER_10 = 'influencer_10';
    const INFLUENCER_50 = 'influencer_50';
    const INFLUENCER_100 = 'influencer_100';
    const INFLUENCER_500 = 'influencer_500';
    
    const FIRST_SAVE = 'first_save';
    const COLLECTOR_10 = 'collector_10';
    const COLLECTOR_50 = 'collector_50';
    const COLLECTOR_100 = 'collector_100';
    
    const STREAK_7 = 'streak_7';
    const STREAK_30 = 'streak_30';
    const STREAK_100 = 'streak_100';
    const STREAK_365 = 'streak_365';
    
    const FEATURED_QUOTE = 'featured_quote';
    const VERIFIED_CREATOR = 'verified_creator';

    /**
     * Get all achievement definitions
     */
    public static function getDefinitions(): array
    {
        return [
            // Quote Creation Achievements
            self::FIRST_QUOTE => [
                'name' => 'First Steps',
                'description' => 'Share your first quote',
                'icon' => '✍️',
                'target' => 1,
                'category' => 'creation',
                'points' => 10,
            ],
            self::QUOTE_MASTER_5 => [
                'name' => 'Quote Enthusiast',
                'description' => 'Share 5 quotes',
                'icon' => '📝',
                'target' => 5,
                'category' => 'creation',
                'points' => 25,
            ],
            self::QUOTE_MASTER_10 => [
                'name' => 'Quote Master',
                'description' => 'Share 10 quotes',
                'icon' => '📚',
                'target' => 10,
                'category' => 'creation',
                'points' => 50,
            ],
            self::QUOTE_MASTER_25 => [
                'name' => 'Wisdom Keeper',
                'description' => 'Share 25 quotes',
                'icon' => '🎓',
                'target' => 25,
                'category' => 'creation',
                'points' => 100,
            ],
            self::QUOTE_MASTER_50 => [
                'name' => 'Quote Legend',
                'description' => 'Share 50 quotes',
                'icon' => '👑',
                'target' => 50,
                'category' => 'creation',
                'points' => 200,
            ],
            self::QUOTE_MASTER_100 => [
                'name' => 'Quote Deity',
                'description' => 'Share 100 quotes',
                'icon' => '⚡',
                'target' => 100,
                'category' => 'creation',
                'points' => 500,
            ],

            // Popularity Achievements
            self::POPULAR_QUOTE_10 => [
                'name' => 'Rising Star',
                'description' => 'Get 10 likes on a single quote',
                'icon' => '⭐',
                'target' => 10,
                'category' => 'popularity',
                'points' => 25,
            ],
            self::POPULAR_QUOTE_50 => [
                'name' => 'Crowd Favorite',
                'description' => 'Get 50 likes on a single quote',
                'icon' => '🌟',
                'target' => 50,
                'category' => 'popularity',
                'points' => 75,
            ],
            self::POPULAR_QUOTE_100 => [
                'name' => 'Viral Sensation',
                'description' => 'Get 100 likes on a single quote',
                'icon' => '💫',
                'target' => 100,
                'category' => 'popularity',
                'points' => 150,
            ],
            self::POPULAR_QUOTE_500 => [
                'name' => 'Internet Famous',
                'description' => 'Get 500 likes on a single quote',
                'icon' => '🔥',
                'target' => 500,
                'category' => 'popularity',
                'points' => 500,
            ],

            // Follower Achievements
            self::FIRST_FOLLOWER => [
                'name' => 'First Fan',
                'description' => 'Get your first follower',
                'icon' => '👤',
                'target' => 1,
                'category' => 'social',
                'points' => 10,
            ],
            self::INFLUENCER_10 => [
                'name' => 'Growing Influence',
                'description' => 'Reach 10 followers',
                'icon' => '👥',
                'target' => 10,
                'category' => 'social',
                'points' => 50,
            ],
            self::INFLUENCER_50 => [
                'name' => 'Influencer',
                'description' => 'Reach 50 followers',
                'icon' => '👨‍👩‍👧‍👦',
                'target' => 50,
                'category' => 'social',
                'points' => 150,
            ],
            self::INFLUENCER_100 => [
                'name' => 'Community Leader',
                'description' => 'Reach 100 followers',
                'icon' => '🎖️',
                'target' => 100,
                'category' => 'social',
                'points' => 300,
            ],
            self::INFLUENCER_500 => [
                'name' => 'Celebrity',
                'description' => 'Reach 500 followers',
                'icon' => '🏆',
                'target' => 500,
                'category' => 'social',
                'points' => 1000,
            ],

            // Collection Achievements
            self::FIRST_SAVE => [
                'name' => 'Collector',
                'description' => 'Save your first quote',
                'icon' => '🔖',
                'target' => 1,
                'category' => 'collection',
                'points' => 5,
            ],
            self::COLLECTOR_10 => [
                'name' => 'Avid Collector',
                'description' => 'Save 10 quotes',
                'icon' => '📌',
                'target' => 10,
                'category' => 'collection',
                'points' => 25,
            ],
            self::COLLECTOR_50 => [
                'name' => 'Curator',
                'description' => 'Save 50 quotes',
                'icon' => '📚',
                'target' => 50,
                'category' => 'collection',
                'points' => 75,
            ],
            self::COLLECTOR_100 => [
                'name' => 'Master Curator',
                'description' => 'Save 100 quotes',
                'icon' => '🗃️',
                'target' => 100,
                'category' => 'collection',
                'points' => 150,
            ],

            // Streak Achievements
            self::STREAK_7 => [
                'name' => 'Week Warrior',
                'description' => 'Maintain a 7-day streak',
                'icon' => '🔥',
                'target' => 7,
                'category' => 'engagement',
                'points' => 50,
            ],
            self::STREAK_30 => [
                'name' => 'Monthly Master',
                'description' => 'Maintain a 30-day streak',
                'icon' => '💪',
                'target' => 30,
                'category' => 'engagement',
                'points' => 200,
            ],
            self::STREAK_100 => [
                'name' => 'Dedication Champion',
                'description' => 'Maintain a 100-day streak',
                'icon' => '🎯',
                'target' => 100,
                'category' => 'engagement',
                'points' => 500,
            ],
            self::STREAK_365 => [
                'name' => 'Year-Long Legend',
                'description' => 'Maintain a 365-day streak',
                'icon' => '👑',
                'target' => 365,
                'category' => 'engagement',
                'points' => 2000,
            ],

            // Special Achievements
            self::FEATURED_QUOTE => [
                'name' => 'Featured Creator',
                'description' => 'Have a quote featured by admins',
                'icon' => '⭐',
                'target' => 1,
                'category' => 'special',
                'points' => 100,
            ],
            self::VERIFIED_CREATOR => [
                'name' => 'Verified Creator',
                'description' => 'Become a verified creator',
                'icon' => '✓',
                'target' => 1,
                'category' => 'special',
                'points' => 500,
            ],
        ];
    }

    /**
     * Check and award achievements for a user
     */
    public function checkAchievements(User $user, string $type, int $currentValue = null): array
    {
        $awarded = [];
        $definitions = self::getDefinitions();

        switch ($type) {
            case 'quote_created':
                $count = $currentValue ?? $user->quotes()->count();
                $awarded = array_merge($awarded, $this->checkQuoteAchievements($user, $count));
                break;

            case 'quote_liked':
                $quote = Quote::find($currentValue);
                if ($quote) {
                    $awarded = array_merge($awarded, $this->checkPopularityAchievements($user, $quote));
                }
                break;

            case 'follower_gained':
                $count = $currentValue ?? $user->followers_count;
                $awarded = array_merge($awarded, $this->checkFollowerAchievements($user, $count));
                break;

            case 'quote_saved':
                $count = $currentValue ?? $user->saves()->count();
                $awarded = array_merge($awarded, $this->checkCollectionAchievements($user, $count));
                break;

            case 'streak_updated':
                $streak = $currentValue ?? $user->daily_streak;
                $awarded = array_merge($awarded, $this->checkStreakAchievements($user, $streak));
                break;

            case 'quote_featured':
                $awarded = array_merge($awarded, $this->awardAchievement($user, self::FEATURED_QUOTE));
                break;
        }

        return $awarded;
    }

    /**
     * Check quote creation achievements
     */
    protected function checkQuoteAchievements(User $user, int $count): array
    {
        $awarded = [];
        $milestones = [
            1 => self::FIRST_QUOTE,
            5 => self::QUOTE_MASTER_5,
            10 => self::QUOTE_MASTER_10,
            25 => self::QUOTE_MASTER_25,
            50 => self::QUOTE_MASTER_50,
            100 => self::QUOTE_MASTER_100,
        ];

        if (isset($milestones[$count])) {
            $awarded = $this->awardAchievement($user, $milestones[$count]);
        }

        return $awarded;
    }

    /**
     * Check popularity achievements
     */
    protected function checkPopularityAchievements(User $user, Quote $quote): array
    {
        $awarded = [];
        $likes = $quote->likes_count;
        $milestones = [
            10 => self::POPULAR_QUOTE_10,
            50 => self::POPULAR_QUOTE_50,
            100 => self::POPULAR_QUOTE_100,
            500 => self::POPULAR_QUOTE_500,
        ];

        if (isset($milestones[$likes])) {
            $awarded = $this->awardAchievement($user, $milestones[$likes]);
        }

        return $awarded;
    }

    /**
     * Check follower achievements
     */
    protected function checkFollowerAchievements(User $user, int $count): array
    {
        $awarded = [];
        $milestones = [
            1 => self::FIRST_FOLLOWER,
            10 => self::INFLUENCER_10,
            50 => self::INFLUENCER_50,
            100 => self::INFLUENCER_100,
            500 => self::INFLUENCER_500,
        ];

        if (isset($milestones[$count])) {
            $awarded = $this->awardAchievement($user, $milestones[$count]);
        }

        return $awarded;
    }

    /**
     * Check collection achievements
     */
    protected function checkCollectionAchievements(User $user, int $count): array
    {
        $awarded = [];
        $milestones = [
            1 => self::FIRST_SAVE,
            10 => self::COLLECTOR_10,
            50 => self::COLLECTOR_50,
            100 => self::COLLECTOR_100,
        ];

        if (isset($milestones[$count])) {
            $awarded = $this->awardAchievement($user, $milestones[$count]);
        }

        return $awarded;
    }

    /**
     * Check streak achievements
     */
    protected function checkStreakAchievements(User $user, int $streak): array
    {
        $awarded = [];
        $milestones = [
            7 => self::STREAK_7,
            30 => self::STREAK_30,
            100 => self::STREAK_100,
            365 => self::STREAK_365,
        ];

        if (isset($milestones[$streak])) {
            $awarded = $this->awardAchievement($user, $milestones[$streak]);
        }

        return $awarded;
    }

    /**
     * Award an achievement to a user
     */
    protected function awardAchievement(User $user, string $achievementType): array
    {
        // Check if already awarded
        $existing = UserAchievement::where('user_id', $user->id)
            ->where('achievement_type', $achievementType)
            ->first();

        if ($existing) {
            return []; // Already has this achievement
        }

        $definition = self::getDefinitions()[$achievementType] ?? null;
        if (!$definition) {
            return [];
        }

        // Create achievement
        $achievement = UserAchievement::create([
            'user_id' => $user->id,
            'achievement_type' => $achievementType,
            'progress' => $definition['target'],
            'target' => $definition['target'],
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        // Send notification
        $notificationService = app(NotificationService::class);
        $notificationService->notifyAchievementUnlocked(
            $user,
            $definition['name'],
            $definition['description']
        );

        return [$achievement];
    }

    /**
     * Get user's achievements with definitions
     */
    public function getUserAchievements(User $user): array
    {
        $achievements = $user->achievements()->completed()->get();
        $definitions = self::getDefinitions();

        return $achievements->map(function ($achievement) use ($definitions) {
            $definition = $definitions[$achievement->achievement_type] ?? null;
            return array_merge($achievement->toArray(), [
                'definition' => $definition,
            ]);
        })->toArray();
    }

    /**
     * Get achievement progress for a user
     */
    public function getProgress(User $user): array
    {
        $definitions = self::getDefinitions();
        $userAchievements = $user->achievements()->pluck('achievement_type')->toArray();

        $progress = [];
        foreach ($definitions as $type => $definition) {
            $progress[$type] = [
                'definition' => $definition,
                'unlocked' => in_array($type, $userAchievements),
                'unlocked_at' => null,
            ];

            if ($progress[$type]['unlocked']) {
                $achievement = $user->achievements()
                    ->where('achievement_type', $type)
                    ->first();
                $progress[$type]['unlocked_at'] = $achievement->completed_at;
            }
        }

        return $progress;
    }

    /**
     * Get total points for a user
     */
    public function getTotalPoints(User $user): int
    {
        $achievements = $user->achievements()->completed()->get();
        $definitions = self::getDefinitions();
        $total = 0;

        foreach ($achievements as $achievement) {
            $definition = $definitions[$achievement->achievement_type] ?? null;
            if ($definition) {
                $total += $definition['points'];
            }
        }

        return $total;
    }
}
