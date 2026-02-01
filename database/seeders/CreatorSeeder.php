<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreatorSeeder extends Seeder
{
    /**
     * Seed the creators table.
     */
    public function run(): void
    {
        $creators = [
            [
                'name' => 'Aniket Shinde',
                'username' => 'ananiket',
                'email' => 'aniket@quoteshub.com',
                'bio' => 'Founder of QuotesHub | Building the best place to discover and share quotes',
                'role' => 'admin',
                'password' => Hash::make('password'), // Change in production
            ],
            [
                'name' => 'QuotesHub',
                'username' => 'quoteshub',
                'email' => 'official@quoteshub.com',
                'bio' => 'Official QuotesHub account | Daily inspiration and curated quotes',
                'role' => 'admin',
                'password' => Hash::make('password'), // Change in production
            ],
        ];

        foreach ($creators as $creator) {
            User::updateOrCreate(
                ['username' => $creator['username']],
                $creator
            );
        }
    }
}
