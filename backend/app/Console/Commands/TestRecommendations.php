<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\RecommendationService;
use Illuminate\Console\Command;

class TestRecommendations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recommendations:test {user_id? : User ID to test recommendations for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the recommendation engine for a specific user';

    /**
     * Execute the console command.
     */
    public function handle(RecommendationService $recommendationService)
    {
        $userId = $this->argument('user_id') ?? $this->ask('Enter user ID to test');

        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found!");
            return 1;
        }

        $this->info("Testing recommendations for: {$user->name} (@{$user->username})");
        $this->newLine();

        // Test personalized feed
        $this->info('📱 Personalized Feed (For You):');
        $personalizedQuotes = $recommendationService->getPersonalizedFeed($user, 5);
        
        if ($personalizedQuotes->isEmpty()) {
            $this->warn('  No personalized recommendations yet. User needs more interaction history.');
        } else {
            foreach ($personalizedQuotes as $quote) {
                $this->line("  • {$quote->content}");
                $this->line("    by @{$quote->user->username} | ❤️  {$quote->likes_count}");
            }
        }
        $this->newLine();

        // Test collaborative recommendations
        $this->info('🤝 Collaborative Recommendations (Users who liked similar quotes):');
        $collaborativeQuotes = $recommendationService->getCollaborativeRecommendations($user, 3);
        
        if ($collaborativeQuotes->isEmpty()) {
            $this->warn('  Not enough data for collaborative filtering. User needs more likes.');
        } else {
            foreach ($collaborativeQuotes as $quote) {
                $this->line("  • {$quote->content}");
                $this->line("    by @{$quote->user->username}");
            }
        }
        $this->newLine();

        // Test recommended authors
        $this->info('👤 Recommended Authors:');
        $authors = $recommendationService->getRecommendedAuthors($user, 5);
        
        if ($authors->isEmpty()) {
            $this->warn('  No author recommendations available.');
        } else {
            foreach ($authors as $author) {
                $this->line("  • {$author->name} (@{$author->username})");
                $this->line("    {$author->quotes_count} quotes | {$author->followers_count} followers");
            }
        }
        $this->newLine();

        // Show user preferences
        $this->info('📊 User Preferences:');
        
        $topCategories = $user->categoryPreferences()
            ->orderByDesc('engagement_score')
            ->take(5)
            ->with('category')
            ->get();

        if ($topCategories->isNotEmpty()) {
            $this->line('  Top Categories:');
            foreach ($topCategories as $pref) {
                $this->line("    • {$pref->category->name}: Score {$pref->engagement_score}");
                $this->line("      (Views: {$pref->view_count}, Likes: {$pref->like_count}, Saves: {$pref->save_count})");
            }
        } else {
            $this->warn('  No category preferences recorded yet.');
        }

        $this->newLine();
        $this->info('✓ Test complete!');

        return 0;
    }
}
