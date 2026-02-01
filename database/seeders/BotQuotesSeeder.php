<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BotQuotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = base_path('bot/quotes_100_dataset.csv');

        if (!file_exists($filePath)) {
            $this->command->error("CSV file not found: {$filePath}");
            return;
        }

        $this->command->info("Reading quotes from CSV...");

        // Get all bot users
        $bots = User::bots()->where('is_active', true)->pluck('id')->toArray();
        
        if (empty($bots)) {
            $this->command->error('No active bot users found. Run BotUserSeeder first.');
            return;
        }

        $this->command->info("Found " . count($bots) . " bot users");

        // Read CSV
        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Skip header
        
        $quotes = [];
        $lineNumber = 1;
        
        while (($row = fgetcsv($file)) !== false) {
            $lineNumber++;
            
            if (count($row) < 3) {
                $this->command->warn("Skipping line {$lineNumber}: insufficient data");
                continue;
            }
            
            $quotes[] = [
                'content' => $row[1] ?? null,
                'author' => $row[2] ?? null,
                'source' => ($row[3] ?? null) === 'null' ? null : $row[3],
                'categories' => isset($row[5]) ? json_decode($row[5], true) : [],
                'tags' => isset($row[6]) ? json_decode($row[6], true) : [],
            ];
        }
        fclose($file);

        $this->command->info("Found " . count($quotes) . " quotes to import");

        // Shuffle for random distribution
        shuffle($quotes);

        $imported = 0;
        $skipped = 0;

        foreach ($quotes as $quoteData) {
            try {
                if (empty($quoteData['content'])) {
                    $skipped++;
                    continue;
                }

                // Assign to random bot
                $botUserId = $bots[array_rand($bots)];

                // Create quote
                $quote = Quote::create([
                    'user_id' => $botUserId,
                    'content' => $quoteData['content'],
                    'author' => $quoteData['author'],
                    'source' => $quoteData['source'],
                    'status' => 'approved', // Auto-approve bot quotes
                ]);

                // Attach categories
                if (!empty($quoteData['categories']) && is_array($quoteData['categories'])) {
                    $validCategories = Category::whereIn('id', $quoteData['categories'])
                        ->pluck('id')
                        ->toArray();
                    
                    if (!empty($validCategories)) {
                        $quote->categories()->attach($validCategories);
                    }
                }

                // Attach tags
                if (!empty($quoteData['tags']) && is_array($quoteData['tags'])) {
                    $validTags = Tag::whereIn('id', $quoteData['tags'])
                        ->pluck('id')
                        ->toArray();
                    
                    if (!empty($validTags)) {
                        $quote->tags()->attach($validTags);
                    }
                }

                $imported++;

                if ($imported % 20 == 0) {
                    $this->command->info("Imported {$imported} quotes...");
                }

            } catch (\Exception $e) {
                $this->command->error("Error importing quote: " . $e->getMessage());
                $skipped++;
            }
        }

        $this->command->info("Successfully imported {$imported} bot quotes!");
        if ($skipped > 0) {
            $this->command->warn("Skipped {$skipped} quotes");
        }
    }
}
