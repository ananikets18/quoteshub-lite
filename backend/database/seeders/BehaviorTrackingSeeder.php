<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Quote;
use App\Models\QuoteView;
use App\Models\UserCategoryPreference;
use App\Models\UserAuthorPreference;
use Illuminate\Database\Seeder;

class BehaviorTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeds sample interaction data to test the recommendation engine
     */
    public function run(): void
    {
        $this->command->info('Seeding behavior tracking data...');

        $users = User::take(10)->get();
        $quotes = Quote::approved()->take(50)->get();

        if ($users->isEmpty() || $quotes->isEmpty()) {
            $this->command->warn('Not enough users or quotes to seed. Please run UserSeeder and QuoteSeeder first.');
            return;
        }

        foreach ($users as $user) {
            // Simulate user viewing random quotes
            $viewedQuotes = $quotes->random(rand(10, 30));
            
            foreach ($viewedQuotes as $quote) {
                QuoteView::create([
                    'user_id' => $user->id,
                    'quote_id' => $quote->id,
                    'duration_seconds' => rand(5, 120),
                    'source' => ['feed', 'profile', 'category', 'search'][rand(0, 3)],
                ]);

                // Track category preferences
                foreach ($quote->categories as $category) {
                    $preference = UserCategoryPreference::firstOrCreate(
                        [
                            'user_id' => $user->id,
                            'category_id' => $category->id,
                        ],
                        [
                            'view_count' => 0,
                            'like_count' => 0,
                            'save_count' => 0,
                            'share_count' => 0,
                        ]
                    );

                    $preference->view_count++;
                    
                    // Random interactions
                    if (rand(1, 5) === 1) {
                        $preference->like_count++;
                    }
                    if (rand(1, 10) === 1) {
                        $preference->save_count++;
                    }
                    
                    $preference->last_interacted_at = now()->subDays(rand(0, 30));
                    $preference->save();
                }

                // Track author preferences
                $authorPreference = UserAuthorPreference::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'author_id' => $quote->user_id,
                    ],
                    [
                        'view_count' => 0,
                        'like_count' => 0,
                        'save_count' => 0,
                        'follow_exists' => 0,
                    ]
                );

                $authorPreference->view_count++;
                
                if (rand(1, 5) === 1) {
                    $authorPreference->like_count++;
                }
                if (rand(1, 10) === 1) {
                    $authorPreference->save_count++;
                }
                
                $authorPreference->last_interacted_at = now()->subDays(rand(0, 30));
                $authorPreference->save();
            }

            $this->command->info("Processed user: {$user->name}");
        }

        // Calculate engagement scores
        $this->command->info('Calculating engagement scores...');
        
        UserCategoryPreference::all()->each(function ($preference) {
            $preference->calculateEngagementScore();
        });

        UserAuthorPreference::all()->each(function ($preference) {
            $preference->calculateEngagementScore();
        });

        $this->command->info('✓ Behavior tracking data seeded successfully!');
    }
}
