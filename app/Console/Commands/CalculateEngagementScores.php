<?php

namespace App\Console\Commands;

use App\Models\UserCategoryPreference;
use App\Models\UserAuthorPreference;
use Illuminate\Console\Command;

class CalculateEngagementScores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engagement:calculate 
                            {--user= : Specific user ID to calculate for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate and update engagement scores for user preferences';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Calculating engagement scores...');

        $userId = $this->option('user');

        // Calculate category preferences
        $categoryQuery = UserCategoryPreference::query();
        if ($userId) {
            $categoryQuery->where('user_id', $userId);
        }

        $categoryPreferences = $categoryQuery->get();
        $this->info("Processing {$categoryPreferences->count()} category preferences...");

        $bar = $this->output->createProgressBar($categoryPreferences->count());
        foreach ($categoryPreferences as $preference) {
            $preference->calculateEngagementScore();
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();

        // Calculate author preferences
        $authorQuery = UserAuthorPreference::query();
        if ($userId) {
            $authorQuery->where('user_id', $userId);
        }

        $authorPreferences = $authorQuery->get();
        $this->info("Processing {$authorPreferences->count()} author preferences...");

        $bar = $this->output->createProgressBar($authorPreferences->count());
        foreach ($authorPreferences as $preference) {
            $preference->calculateEngagementScore();
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();

        $this->info('✓ Engagement scores calculated successfully!');

        return 0;
    }
}
