<?php

namespace App\Services;

use App\Models\User;
use App\Models\Quote;
use App\Models\Like;
use App\Models\Save;
use App\Models\Follow;
use App\Models\QuoteView;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BotService
{
    /**
     * Post scheduled quotes (called by scheduler)
     */
    public function postScheduledQuote(): array
    {
        if (!config('bot.enabled')) {
            return ['success' => false, 'message' => 'Bot system is disabled'];
        }

        // Check if we're within active hours
        if (!$this->isActiveHour()) {
            return ['success' => false, 'message' => 'Outside active hours'];
        }

        // Check if we've reached daily quote limit for NEW quotes only
        // (exclude imported quotes from today's count)
        $dailyQuotesPosted = Quote::whereIn('user_id', User::bots()->pluck('id'))
            ->whereDate('created_at', today())
            ->whereTime('created_at', '>=', now()->startOfDay()->addHours(6)) // Only count from 6 AM
            ->count();

        $dailyLimit = config('bot.behavior.daily_quote_limit', 40);

        if ($dailyQuotesPosted >= $dailyLimit) {
            return ['success' => false, 'message' => 'Daily quote limit reached'];
        }

        // Get a random bot user
        $bot = User::bots()
            ->where('is_active', true)
            ->inRandomOrder()
            ->first();

        if (!$bot) {
            return ['success' => false, 'message' => 'No bot users available'];
        }

        // Get a random quote that hasn't been posted recently
        $availableQuote = $this->getAvailableQuoteForPosting($bot);
        
        if (!$availableQuote) {
            return ['success' => false, 'message' => 'No quotes available to post'];
        }

        // Post the quote
        if ($this->postQuote($bot, $availableQuote)) {
            return [
                'success' => true,
                'bot_username' => $bot->username,
                'quotes_posted_today' => $dailyQuotesPosted + 1,
                'daily_limit' => $dailyLimit,
            ];
        }

        return ['success' => false, 'message' => 'Failed to create quote'];
    }

    /**
     * Perform random bot activities (likes, saves, follows)
     */
    public function performActivities(): array
    {
        if (!config('bot.enabled')) {
            return ['success' => false, 'message' => 'Bot system is disabled'];
        }

        // Check if we're within active hours
        if (!$this->isActiveHour()) {
            return ['success' => false, 'message' => 'Outside active hours'];
        }

        $results = [
            'quotes_created' => 0,
            'likes_given' => 0,
            'saves_made' => 0,
            'follows_made' => 0,
            'views_recorded' => 0,
            'errors' => [],
        ];

        // Get active bots
        $bots = $this->getActiveBots();

        if ($bots->isEmpty()) {
            return ['success' => false, 'message' => 'No bot users available'];
        }

        foreach ($bots as $bot) {
            // Reset daily counter if needed
            $this->resetDailyCounterIfNeeded($bot);

            // Perform various activities based on probability
            try {
                if ($this->shouldPerformAction('like_quote', $bot)) {
                    if ($this->likeRandomQuote($bot)) {
                        $results['likes_given']++;
                    }
                }

                if ($this->shouldPerformAction('save_quote', $bot)) {
                    if ($this->saveRandomQuote($bot)) {
                        $results['saves_made']++;
                    }
                }

                if ($this->shouldPerformAction('follow_user', $bot)) {
                    if ($this->followRandomUser($bot)) {
                        $results['follows_made']++;
                    }
                }

                if ($this->shouldPerformAction('view_quote', $bot)) {
                    if ($this->viewRandomQuote($bot)) {
                        $results['views_recorded']++;
                    }
                }
            } catch (\Exception $e) {
                $results['errors'][] = "Bot {$bot->username}: " . $e->getMessage();
                Log::error('Bot activity error', [
                    'bot_id' => $bot->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return array_merge(['success' => true], $results);
    }

    /**
     * Get active bot users
     */
    protected function getActiveBots()
    {
        return User::bots()
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(config('bot.bot_count', 50))
            ->get();
    }

    /**
     * Check if current time is within active hours
     */
    protected function isActiveHour(): bool
    {
        $currentHour = now()->hour;
        $start = config('bot.behavior.active_hours.start', 6);
        $end = config('bot.behavior.active_hours.end', 23);

        return $currentHour >= $start && $currentHour <= $end;
    }

    /**
     * Determine if bot should perform an action
     */
    protected function shouldPerformAction(string $action, User $bot): bool
    {
        $probability = config("bot.probability.{$action}", 50);
        
        // Check daily limits
        $maxActions = $this->getMaxActionsForType($action);
        if ($bot->daily_action_count >= $maxActions) {
            return false;
        }

        return rand(1, 100) <= $probability;
    }

    /**
     * Get maximum actions for a specific type
     */
    protected function getMaxActionsForType(string $action): int
    {
        $limits = [
            'create_quote' => config('bot.behavior.max_quotes_per_day', 5),
            'like_quote' => config('bot.behavior.max_likes_per_day', 100),
            'save_quote' => config('bot.behavior.max_saves_per_day', 30),
            'follow_user' => config('bot.behavior.max_follows_per_day', 20),
            'view_quote' => 999999, // No real limit on views
        ];

        return $limits[$action] ?? 100;
    }

    /**
     * Reset daily counter if it's a new day
     */
    protected function resetDailyCounterIfNeeded(User $bot): void
    {
        if (!$bot->last_bot_activity || 
            $bot->last_bot_activity->isToday() === false) {
            $bot->update(['daily_action_count' => 0]);
        }
    }

    /**
     * Get an available quote for posting
     */
    protected function getAvailableQuoteForPosting(User $bot): ?object
    {
        // Get quotes that haven't been posted in the last 7 days
        return DB::table('quotes')
            ->where('status', 'approved')
            ->where(function ($query) use ($bot) {
                $query->where(function ($q) {
                    // Never posted quotes assigned to bots
                    $q->whereIn('user_id', User::bots()->pluck('id'))
                      ->where('created_at', '<', now()->subDays(7));
                })
                ->orWhere(function ($q) {
                    // Unassigned quotes
                    $q->whereNull('user_id');
                });
            })
            ->inRandomOrder()
            ->first();
    }

    /**
     * Post a quote for a bot user
     */
    protected function postQuote(User $bot, object $quoteData): bool
    {
        try {
            $quote = Quote::create([
                'user_id' => $bot->id,
                'content' => $quoteData->content,
                'author' => $quoteData->author,
                'source' => $quoteData->source,
                'status' => 'approved',
            ]);

            // Copy categories from original if it has an ID
            if (isset($quoteData->id)) {
                $categories = DB::table('category_quote')
                    ->where('quote_id', $quoteData->id)
                    ->pluck('category_id');
                    
                if ($categories->isNotEmpty()) {
                    $quote->categories()->attach($categories);
                }
            }

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'create_quote', $quote->id);

            Log::info('Bot posted scheduled quote', [
                'bot_username' => $bot->username,
                'quote_id' => $quote->id,
                'content_preview' => substr($quote->content, 0, 50) . '...',
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot post quote error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Create a quote from dataset as a bot
     */
    public function createQuoteFromDataset(User $bot): bool
    {
        try {
            // Get a random unposted quote
            $quote = DB::table('quotes')
                ->where('status', 'approved')
                ->whereNull('user_id')
                ->orWhere(function ($query) {
                    $query->whereIn('user_id', User::bots()->pluck('id'))
                        ->where('created_at', '<', now()->subDays(30)); // Can repost old quotes
                })
                ->inRandomOrder()
                ->first();

            if (!$quote) {
                // Fallback to creating from config samples
                return $this->createQuote($bot);
            }

            // Create the quote
            $newQuote = Quote::create([
                'user_id' => $bot->id,
                'content' => $quote->content,
                'author' => $quote->author,
                'source' => $quote->source,
                'status' => 'approved',
            ]);

            // Copy categories if they exist
            if ($quote->id) {
                $categories = DB::table('category_quote')
                    ->where('quote_id', $quote->id)
                    ->pluck('category_id');
                    
                if ($categories->isNotEmpty()) {
                    $newQuote->categories()->attach($categories);
                }
            }

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'create_quote', $newQuote->id);

            Log::info('Bot posted quote', [
                'bot_username' => $bot->username,
                'quote_id' => $newQuote->id,
                'content_preview' => substr($newQuote->content, 0, 50) . '...',
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot create quote from dataset error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Create a quote as a bot
     */
    public function createQuote(User $bot): bool
    {
        try {
            $quotes = config('bot.content.sample_quotes', []);
            $authors = config('bot.content.sample_authors', []);

            if (empty($quotes) || empty($authors)) {
                return false;
            }

            $content = $quotes[array_rand($quotes)];
            $author = $authors[array_rand($authors)];

            $quote = Quote::create([
                'user_id' => $bot->id,
                'content' => $content,
                'author' => $author,
                'status' => 'approved', // Auto-approve bot quotes
            ]);

            // Attach random categories
            $categories = Category::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            if ($categories->isNotEmpty()) {
                $quote->categories()->attach($categories);
            }

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'create_quote', $quote->id);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot create quote error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Like a random quote as a bot
     */
    public function likeRandomQuote(User $bot): bool
    {
        try {
            // Get a random quote that this bot hasn't liked yet
            $quote = Quote::approved()
                ->whereNotIn('id', function ($query) use ($bot) {
                    $query->select('quote_id')
                        ->from('likes')
                        ->where('user_id', $bot->id);
                })
                ->inRandomOrder()
                ->first();

            if (!$quote) {
                return false;
            }

            // Check if already liked
            $exists = Like::where('user_id', $bot->id)
                ->where('quote_id', $quote->id)
                ->exists();

            if ($exists) {
                return false;
            }

            Like::create([
                'user_id' => $bot->id,
                'quote_id' => $quote->id,
            ]);

            // Update quote likes count
            $quote->increment('likes_count');

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'like_quote', $quote->id);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot like quote error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Save a random quote as a bot
     */
    public function saveRandomQuote(User $bot): bool
    {
        try {
            // Get a random quote that this bot hasn't saved yet
            $quote = Quote::approved()
                ->whereNotIn('id', function ($query) use ($bot) {
                    $query->select('quote_id')
                        ->from('saves')
                        ->where('user_id', $bot->id);
                })
                ->inRandomOrder()
                ->first();

            if (!$quote) {
                return false;
            }

            // Check if already saved
            $exists = Save::where('user_id', $bot->id)
                ->where('quote_id', $quote->id)
                ->exists();

            if ($exists) {
                return false;
            }

            Save::create([
                'user_id' => $bot->id,
                'quote_id' => $quote->id,
            ]);

            // Update quote saves count
            $quote->increment('saves_count');

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'save_quote', $quote->id);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot save quote error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Follow a random user as a bot
     */
    public function followRandomUser(User $bot): bool
    {
        try {
            // Get a random user that this bot isn't following yet
            $user = User::realUsers() // Don't follow other bots
                ->where('id', '!=', $bot->id)
                ->whereNotIn('id', function ($query) use ($bot) {
                    $query->select('following_id')
                        ->from('follows')
                        ->where('follower_id', $bot->id);
                })
                ->inRandomOrder()
                ->first();

            if (!$user) {
                return false;
            }

            // Check if already following
            $exists = Follow::where('follower_id', $bot->id)
                ->where('following_id', $user->id)
                ->exists();

            if ($exists) {
                return false;
            }

            Follow::create([
                'follower_id' => $bot->id,
                'following_id' => $user->id,
            ]);

            // Update counters
            $bot->increment('following_count');
            $user->increment('followers_count');

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'follow_user', $user->id);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot follow user error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * View a random quote as a bot
     */
    public function viewRandomQuote(User $bot): bool
    {
        try {
            $quote = Quote::approved()
                ->inRandomOrder()
                ->first();

            if (!$quote) {
                return false;
            }

            QuoteView::create([
                'quote_id' => $quote->id,
                'user_id' => $bot->id,
                'ip_address' => '127.0.0.1', // Bot IP
                'user_agent' => 'Bot/' . config('app.name'),
            ]);

            // Update quote views count
            $quote->increment('views_count');

            $this->incrementBotActivity($bot);
            $this->logActivity($bot, 'view_quote', $quote->id);

            return true;
        } catch (\Exception $e) {
            Log::error('Bot view quote error', [
                'bot_id' => $bot->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Increment bot activity counter
     */
    protected function incrementBotActivity(User $bot): void
    {
        $bot->increment('daily_action_count');
        $bot->update(['last_bot_activity' => now()]);
    }

    /**
     * Log bot activity
     */
    protected function logActivity(User $bot, string $action, ?int $targetId = null): void
    {
        if (config('bot.logging.enabled') && config('bot.logging.log_all_actions')) {
            Log::channel(config('bot.logging.channel', 'stack'))->info('Bot activity', [
                'bot_id' => $bot->id,
                'bot_username' => $bot->username,
                'action' => $action,
                'target_id' => $targetId,
                'timestamp' => now()->toDateTimeString(),
            ]);
        }
    }

    /**
     * Get bot activity statistics
     */
    public function getStatistics(): array
    {
        return [
            'total_bots' => User::bots()->count(),
            'active_bots' => User::bots()->where('is_active', true)->count(),
            'bots_active_today' => User::bots()
                ->whereDate('last_bot_activity', today())
                ->count(),
            'total_bot_quotes' => Quote::whereIn('user_id', User::bots()->pluck('id'))->count(),
            'total_bot_likes' => Like::whereIn('user_id', User::bots()->pluck('id'))->count(),
            'total_bot_saves' => Save::whereIn('user_id', User::bots()->pluck('id'))->count(),
            'total_bot_follows' => Follow::whereIn('follower_id', User::bots()->pluck('id'))->count(),
        ];
    }

    /**
     * Clean up old bot activities
     */
    public function cleanup(int $daysOld = 30): int
    {
        $count = 0;

        // Delete old bot quotes with no engagement
        $oldQuotes = Quote::whereIn('user_id', User::bots()->pluck('id'))
            ->where('created_at', '<', now()->subDays($daysOld))
            ->where('likes_count', 0)
            ->where('saves_count', 0)
            ->where('views_count', '<', 10);

        $count += $oldQuotes->count();
        $oldQuotes->delete();

        return $count;
    }
}
