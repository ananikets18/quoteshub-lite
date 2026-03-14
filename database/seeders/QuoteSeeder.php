<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the test user or create one
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Get categories
        $motivation = Category::where('slug', 'motivation')->first();
        $love = Category::where('slug', 'love')->first();
        $success = Category::where('slug', 'success')->first();
        $life = Category::where('slug', 'life')->first();
        $wisdom = Category::where('slug', 'wisdom')->first();
        $courage = Category::where('slug', 'courage')->first();
        $dreams = Category::where('slug', 'dreams')->first();

        $quotes = [
            [
                'content' => 'The only way to do great work is to love what you do.',
                'author' => 'Steve Jobs',
                'categories' => [$success, $motivation],
                'gradient' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            ],
            [
                'content' => 'Life is what happens when you\'re busy making other plans.',
                'author' => 'John Lennon',
                'categories' => [$life, $wisdom],
                'gradient' => 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ],
            [
                'content' => 'The future belongs to those who believe in the beauty of their dreams.',
                'author' => 'Eleanor Roosevelt',
                'categories' => [$dreams, $motivation],
                'gradient' => 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            ],
            [
                'content' => 'It is during our darkest moments that we must focus to see the light.',
                'author' => 'Aristotle',
                'categories' => [$courage, $wisdom],
                'gradient' => 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            ],
            [
                'content' => 'The only impossible journey is the one you never begin.',
                'author' => 'Tony Robbins',
                'categories' => [$motivation, $success],
                'gradient' => 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            ],
            [
                'content' => 'Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.',
                'author' => 'Unknown',
                'categories' => [$love],
                'gradient' => 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            ],
            [
                'content' => 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
                'author' => 'Winston Churchill',
                'categories' => [$success, $courage],
                'gradient' => 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            ],
            [
                'content' => 'In the end, we only regret the chances we didn\'t take.',
                'author' => 'Lewis Carroll',
                'categories' => [$life, $courage],
                'gradient' => 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            ],
            [
                'content' => 'The best time to plant a tree was 20 years ago. The second best time is now.',
                'author' => 'Chinese Proverb',
                'categories' => [$wisdom, $motivation],
                'gradient' => 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            ],
            [
                'content' => 'Your time is limited, don\'t waste it living someone else\'s life.',
                'author' => 'Steve Jobs',
                'categories' => [$life, $motivation],
                'gradient' => 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
            ],
            [
                'content' => 'The only person you are destined to become is the person you decide to be.',
                'author' => 'Ralph Waldo Emerson',
                'categories' => [$motivation, $life],
                'gradient' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            ],
            [
                'content' => 'Believe you can and you\'re halfway there.',
                'author' => 'Theodore Roosevelt',
                'categories' => [$motivation, $success],
                'gradient' => 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ],
            [
                'content' => 'Everything you\'ve ever wanted is on the other side of fear.',
                'author' => 'George Addair',
                'categories' => [$courage, $motivation],
                'gradient' => 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            ],
            [
                'content' => 'Dream big and dare to fail.',
                'author' => 'Norman Vaughan',
                'categories' => [$dreams, $courage],
                'gradient' => 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            ],
            [
                'content' => 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
                'author' => 'Nelson Mandela',
                'categories' => [$courage, $wisdom],
                'gradient' => 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            ],
        ];

        foreach ($quotes as $quoteData) {
            $categories = $quoteData['categories'];
            unset($quoteData['categories']);

            $quote = Quote::create([
                'user_id' => $user->id,
                'content' => $quoteData['content'],
                'author' => $quoteData['author'],
                'status' => 'approved',
                'likes_count' => rand(10, 500),
                'saves_count' => rand(5, 200),
                'shares_count' => rand(0, 100),
                'views_count' => rand(50, 1000),
            ]);

            // Attach categories
            $categoryIds = array_filter(array_map(fn($cat) => $cat?->id, $categories));
            if (!empty($categoryIds)) {
                $quote->categories()->attach($categoryIds);
            }
        }

        $this->command->info('Created ' . count($quotes) . ' inspiring quotes!');
    }
}
