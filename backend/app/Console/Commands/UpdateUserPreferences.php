<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\UserPreferenceAnalyzer;
use Illuminate\Console\Command;

class UpdateUserPreferences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'preferences:update 
                            {--user= : Specific user ID to update}
                            {--all : Update all users}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update user preferences (quote length, diversity, etc.)';

    /**
     * Execute the console command.
     */
    public function handle(UserPreferenceAnalyzer $analyzer)
    {
        $userId = $this->option('user');
        $all = $this->option('all');

        if ($userId) {
            // Update specific user
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found!");
                return 1;
            }

            $this->info("Updating preferences for: {$user->name}");
            $analyzer->updateAllPreferences($user);
            $this->info('✓ Preferences updated!');

        } elseif ($all) {
            // Update all active users
            $users = User::where('is_active', true)->get();
            $this->info("Updating preferences for {$users->count()} users...");

            $bar = $this->output->createProgressBar($users->count());
            foreach ($users as $user) {
                $analyzer->updateAllPreferences($user);
                $bar->advance();
            }
            $bar->finish();
            $this->newLine();
            $this->info('✓ All user preferences updated!');

        } else {
            $this->warn('Please specify --user=ID or --all');
            return 1;
        }

        return 0;
    }
}
