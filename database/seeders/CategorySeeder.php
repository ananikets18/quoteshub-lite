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
                'color' => 'orange',
                'order' => 1,
            ],
            [
                'name' => 'Love',
                'slug' => 'love',
                'description' => 'Beautiful quotes about love and relationships',
                'icon' => '❤️',
                'color' => 'pink',
                'order' => 2,
            ],
            [
                'name' => 'Success',
                'slug' => 'success',
                'description' => 'Quotes about achieving success',
                'icon' => '🏆',
                'color' => 'green',
                'order' => 3,
            ],
            [
                'name' => 'Life',
                'slug' => 'life',
                'description' => 'Wisdom about life and living',
                'icon' => '🌟',
                'color' => 'indigo',
                'order' => 4,
            ],
            [
                'name' => 'Happiness',
                'slug' => 'happiness',
                'description' => 'Quotes to bring joy and happiness',
                'icon' => '😊',
                'color' => 'yellow',
                'order' => 5,
            ],
            [
                'name' => 'Wisdom',
                'slug' => 'wisdom',
                'description' => 'Timeless wisdom and knowledge',
                'icon' => '🦉',
                'color' => 'purple',
                'order' => 6,
            ],
            [
                'name' => 'Friendship',
                'slug' => 'friendship',
                'description' => 'Quotes celebrating friendship',
                'icon' => '🤝',
                'color' => 'blue',
                'order' => 7,
            ],
            [
                'name' => 'Courage',
                'slug' => 'courage',
                'description' => 'Quotes about bravery and courage',
                'icon' => '💪',
                'color' => 'red',
                'order' => 8,
            ],
            [
                'name' => 'Dreams',
                'slug' => 'dreams',
                'description' => 'Quotes about following your dreams',
                'icon' => '✨',
                'color' => 'purple',
                'order' => 9,
            ],
            [
                'name' => 'Leadership',
                'slug' => 'leadership',
                'description' => 'Quotes for leaders and visionaries',
                'icon' => '👑',
                'color' => 'orange',
                'order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
