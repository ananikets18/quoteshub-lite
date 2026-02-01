<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\CategorySeeder;

class SeedCategoriesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'categories:seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the categories/topics table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Seeding categories...');
        
        $seeder = new CategorySeeder();
        $seeder->run();
        
        $this->info('Categories seeded successfully!');
        
        return Command::SUCCESS;
    }
}
