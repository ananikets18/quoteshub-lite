<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Motivation',
                'slug' => 'motivation',
                'description' => 'Quotes to inspire and motivate you',
                'icon' => '🔥',
                'color' => '#f59e0b',
                'order' => 1,
            ],
            [
                'name' => 'Love',
                'slug' => 'love',
                'description' => 'Beautiful quotes about love and relationships',
                'icon' => '❤️',
                'color' => '#ec4899',
                'order' => 2,
            ],
            [
                'name' => 'Success',
                'slug' => 'success',
                'description' => 'Quotes about achieving success',
                'icon' => '🏆',
                'color' => '#10b981',
                'order' => 3,
            ],
            [
                'name' => 'Life',
                'slug' => 'life',
                'description' => 'Wisdom about life and living',
                'icon' => '🌟',
                'color' => '#6366f1',
                'order' => 4,
            ],
            [
                'name' => 'Happiness',
                'slug' => 'happiness',
                'description' => 'Quotes to bring joy and happiness',
                'icon' => '😊',
                'color' => '#fbbf24',
                'order' => 5,
            ],
            [
                'name' => 'Wisdom',
                'slug' => 'wisdom',
                'description' => 'Timeless wisdom and knowledge',
                'icon' => '🦉',
                'color' => '#8b5cf6',
                'order' => 6,
            ],
            [
                'name' => 'Friendship',
                'slug' => 'friendship',
                'description' => 'Quotes celebrating friendship',
                'icon' => '🤝',
                'color' => '#06b6d4',
                'order' => 7,
            ],
            [
                'name' => 'Courage',
                'slug' => 'courage',
                'description' => 'Quotes about bravery and courage',
                'icon' => '💪',
                'color' => '#ef4444',
                'order' => 8,
            ],
            [
                'name' => 'Dreams',
                'slug' => 'dreams',
                'description' => 'Quotes about following your dreams',
                'icon' => '✨',
                'color' => '#a855f7',
                'order' => 9,
            ],
            [
                'name' => 'Leadership',
                'slug' => 'leadership',
                'description' => 'Quotes for leaders and visionaries',
                'icon' => '👑',
                'color' => '#f97316',
                'order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
