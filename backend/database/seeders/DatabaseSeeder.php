<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed users with different roles
        $this->call([
            UserSeeder::class,
            CreatorSeeder::class,
            CategorySeeder::class,
            QuoteSeeder::class,
        ]);
    }
}
