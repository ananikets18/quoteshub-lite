<?php

namespace App\Console\Commands;

use App\Services\BotService;
use Illuminate\Console\Command;

class RunBotActivity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:activity 
                            {--stats : Show bot statistics}
                            {--cleanup : Clean up old bot activities}
                            {--cleanup-days=30 : Days old for cleanup}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run bot activities to simulate user engagement';

    /**
     * Execute the console command.
     */
    public function handle(BotService $botService)
    {
        // Show statistics
        if ($this->option('stats')) {
            $this->showStatistics($botService);
            return 0;
        }

        // Run cleanup
        if ($this->option('cleanup')) {
            $this->runCleanup($botService);
            return 0;
        }

        // Check if bot system is enabled
        if (!config('bot.enabled')) {
            $this->error('Bot system is disabled. Enable it in config/bot.php or set BOT_SYSTEM_ENABLED=true in .env');
            return 1;
        }

        $this->info('Starting bot activities...');
        $this->newLine();

        // Perform bot activities
        $results = $botService->performActivities();

        if (!$results['success']) {
            $this->error('Bot activities failed: ' . $results['message']);
            return 1;
        }

        // Display results
        $this->info('Bot Activities Summary:');
        $this->newLine();
        
        $this->table(
            ['Activity', 'Count'],
            [
                ['Quotes Created', $results['quotes_created']],
                ['Likes Given', $results['likes_given']],
                ['Saves Made', $results['saves_made']],
                ['Follows Made', $results['follows_made']],
                ['Views Recorded', $results['views_recorded']],
            ]
        );

        // Show errors if any
        if (!empty($results['errors'])) {
            $this->newLine();
            $this->warn('Errors encountered:');
            foreach ($results['errors'] as $error) {
                $this->error('  - ' . $error);
            }
        }

        $this->newLine();
        $this->info('Bot activities completed successfully!');
        
        return 0;
    }

    /**
     * Show bot statistics
     */
    protected function showStatistics(BotService $botService): void
    {
        $this->info('Bot System Statistics:');
        $this->newLine();

        $stats = $botService->getStatistics();

        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Bots', $stats['total_bots']],
                ['Active Bots', $stats['active_bots']],
                ['Bots Active Today', $stats['bots_active_today']],
                ['Total Bot Quotes', $stats['total_bot_quotes']],
                ['Total Bot Likes', $stats['total_bot_likes']],
                ['Total Bot Saves', $stats['total_bot_saves']],
                ['Total Bot Follows', $stats['total_bot_follows']],
            ]
        );

        $this->newLine();
    }

    /**
     * Run cleanup of old bot activities
     */
    protected function runCleanup(BotService $botService): void
    {
        $days = (int) $this->option('cleanup-days');
        
        $this->info("Cleaning up bot activities older than {$days} days...");
        $this->newLine();

        $count = $botService->cleanup($days);

        $this->info("Cleaned up {$count} old bot quotes with no engagement.");
        $this->newLine();
    }
}
