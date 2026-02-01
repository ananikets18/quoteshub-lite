<?php

namespace App\Console\Commands;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GradualBotQuoteImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:gradual-import 
                            {file? : Path to CSV file}
                            {--rate=5 : Number of quotes to import per hour}
                            {--duration=20 : How many hours to spread the import over}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gradually import quotes over time to simulate natural bot activity';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file') ?? base_path('bot/quotes_100_dataset.csv');

        if (!file_exists($filePath)) {
            $this->error("CSV file not found: {$filePath}");
            return 1;
        }

        $rate = (int) $this->option('rate'); // quotes per hour
        $duration = (int) $this->option('duration'); // hours

        $this->info("Gradual Quote Import Configuration:");
        $this->info("- Rate: {$rate} quotes per hour");
        $this->info("- Duration: {$duration} hours");
        $this->info("- File: {$filePath}");
        $this->newLine();

        // Calculate timing
        $secondsBetweenQuotes = 3600 / $rate; // seconds in an hour / quotes per hour
        $totalQuotesToImport = $rate * $duration;

        $this->info("Will import {$totalQuotesToImport} quotes total");
        $this->info("One quote every ~" . round($secondsBetweenQuotes) . " seconds");
        $this->newLine();

        // Get bot users
        $bots = User::bots()->where('is_active', true)->pluck('id')->toArray();
        
        if (empty($bots)) {
            $this->error('No active bot users found.');
            return 1;
        }

        // Read CSV
        $file = fopen($filePath, 'r');
        $header = fgetcsv($file);
        
        $quotes = [];
        while (($row = fgetcsv($file)) !== false) {
            if (count($row) < 3) continue;
            
            $quotes[] = [
                'content' => $row[1] ?? null,
                'author' => $row[2] ?? null,
                'source' => ($row[3] ?? null) === 'null' ? null : $row[3],
                'categories' => isset($row[5]) ? json_decode($row[5], true) : [],
                'tags' => isset($row[6]) ? json_decode($row[6], true) : [],
            ];
        }
        fclose($file);

        // Shuffle for randomness
        shuffle($quotes);

        // Limit to total quotes to import
        $quotes = array_slice($quotes, 0, $totalQuotesToImport);

        $this->info("Starting gradual import of " . count($quotes) . " quotes...");
        $this->info("Press Ctrl+C to stop");
        $this->newLine();

        $imported = 0;
        $startTime = now();

        foreach ($quotes as $index => $quoteData) {
            try {
                if (empty($quoteData['content'])) continue;

                // Random bot user
                $botUserId = $bots[array_rand($bots)];

                // Create quote
                $quote = Quote::create([
                    'user_id' => $botUserId,
                    'content' => $quoteData['content'],
                    'author' => $quoteData['author'],
                    'source' => $quoteData['source'],
                    'status' => 'approved',
                ]);

                // Attach categories
                if (!empty($quoteData['categories']) && is_array($quoteData['categories'])) {
                    $validCategories = Category::whereIn('id', $quoteData['categories'])->pluck('id')->toArray();
                    if (!empty($validCategories)) {
                        $quote->categories()->attach($validCategories);
                    }
                }

                // Attach tags
                if (!empty($quoteData['tags']) && is_array($quoteData['tags'])) {
                    $validTags = Tag::whereIn('id', $quoteData['tags'])->pluck('id')->toArray();
                    if (!empty($validTags)) {
                        $quote->tags()->attach($validTags);
                    }
                }

                $imported++;
                $elapsed = now()->diffInMinutes($startTime);
                
                $this->info("[{$imported}/{$totalQuotesToImport}] Quote imported (Elapsed: {$elapsed}m) - \"{$quoteData['author']}\"");

                // Wait before next quote (add random variation ±20%)
                if ($index < count($quotes) - 1) {
                    $variation = $secondsBetweenQuotes * 0.2;
                    $actualDelay = $secondsBetweenQuotes + rand(-$variation, $variation);
                    sleep((int) $actualDelay);
                }

            } catch (\Exception $e) {
                Log::error('Gradual import error', [
                    'quote' => $quoteData,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Gradual import completed!");
        $this->info("Total imported: {$imported} quotes");
        $this->info("Total time: " . now()->diffInMinutes($startTime) . " minutes");

        return 0;
    }
}
