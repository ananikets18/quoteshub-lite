<?php

namespace App\Console\Commands;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportBotQuotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:import-quotes 
                            {file? : Path to CSV file}
                            {--delay-min=2 : Minimum delay in seconds between quotes}
                            {--delay-max=10 : Maximum delay in seconds between quotes}
                            {--batch=10 : Number of quotes to import per batch}
                            {--no-delay : Import all quotes without delay}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import quotes from CSV file and assign to bot users with random intervals';

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

        $this->info("Reading quotes from: {$filePath}");
        $this->newLine();

        // Get all bot users
        $bots = User::bots()->where('is_active', true)->pluck('id')->toArray();
        
        if (empty($bots)) {
            $this->error('No active bot users found. Please create bot users first.');
            return 1;
        }

        $this->info("Found " . count($bots) . " active bot users");

        // Read CSV file
        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Skip header row
        
        $quotes = [];
        while (($row = fgetcsv($file)) !== false) {
            if (count($row) < 3) continue; // Skip invalid rows
            
            $quotes[] = [
                'user_id' => $row[0] ?? null,
                'content' => $row[1] ?? null,
                'author' => $row[2] ?? null,
                'source' => ($row[3] ?? null) === 'null' ? null : $row[3],
                'status' => $row[4] ?? 'approved',
                'categories' => isset($row[5]) ? json_decode($row[5], true) : [],
                'tags' => isset($row[6]) ? json_decode($row[6], true) : [],
            ];
        }
        fclose($file);

        $totalQuotes = count($quotes);
        $this->info("Found {$totalQuotes} quotes to import");
        $this->newLine();

        // Shuffle quotes for randomness
        shuffle($quotes);

        $delayMin = (int) $this->option('delay-min');
        $delayMax = (int) $this->option('delay-max');
        $noDelay = $this->option('no-delay');
        $batchSize = (int) $this->option('batch');

        $imported = 0;
        $skipped = 0;
        $errors = 0;

        $progressBar = $this->output->createProgressBar($totalQuotes);
        $progressBar->start();

        foreach ($quotes as $index => $quoteData) {
            try {
                // Validate required fields
                if (empty($quoteData['content'])) {
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }

                // Assign random bot user
                $botUserId = $bots[array_rand($bots)];

                // Create quote
                $quote = Quote::create([
                    'user_id' => $botUserId,
                    'content' => $quoteData['content'],
                    'author' => $quoteData['author'],
                    'source' => $quoteData['source'],
                    'status' => 'approved', // Auto-approve bot quotes
                ]);

                // Attach categories if valid
                if (!empty($quoteData['categories']) && is_array($quoteData['categories'])) {
                    $validCategories = Category::whereIn('id', $quoteData['categories'])->pluck('id')->toArray();
                    if (!empty($validCategories)) {
                        $quote->categories()->attach($validCategories);
                    }
                }

                // Attach tags if valid
                if (!empty($quoteData['tags']) && is_array($quoteData['tags'])) {
                    $validTags = Tag::whereIn('id', $quoteData['tags'])->pluck('id')->toArray();
                    if (!empty($validTags)) {
                        $quote->tags()->attach($validTags);
                    }
                }

                $imported++;
                $progressBar->advance();

                // Add delay between quotes (except for last one and if no-delay option)
                if (!$noDelay && $index < $totalQuotes - 1) {
                    // Batch delay - longer pause after each batch
                    if (($imported % $batchSize) === 0) {
                        $batchDelay = rand($delayMax * 2, $delayMax * 5);
                        sleep($batchDelay);
                    } else {
                        // Regular delay between individual quotes
                        $delay = rand($delayMin, $delayMax);
                        sleep($delay);
                    }
                }

            } catch (\Exception $e) {
                $errors++;
                Log::error('Error importing bot quote', [
                    'quote' => $quoteData,
                    'error' => $e->getMessage(),
                ]);
                $progressBar->advance();
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        // Display summary
        $this->info('Import Summary:');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Quotes', $totalQuotes],
                ['Successfully Imported', $imported],
                ['Skipped (Invalid)', $skipped],
                ['Errors', $errors],
            ]
        );

        if (!$noDelay) {
            $this->newLine();
            $this->info("Quotes imported with delays between {$delayMin}-{$delayMax} seconds");
            $this->info("Batch pauses after every {$batchSize} quotes");
        }

        return 0;
    }
}
