<?php

namespace App\Console\Commands;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CronBotQuoteImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:cron-import 
                            {--batch=5 : Number of quotes to import per run}
                            {--reset : Reset progress and start from beginning}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import a batch of quotes (cron-safe, tracks progress)';

    protected $progressFile = 'bot_import_progress.json';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $csvPath = base_path('bot/quotes_100_dataset.csv');
        
        if (!file_exists($csvPath)) {
            Log::error('Bot quotes CSV not found', ['path' => $csvPath]);
            return 1;
        }

        // Get bot users
        $bots = User::bots()->where('is_active', true)->pluck('id')->toArray();
        
        if (empty($bots)) {
            Log::error('No active bot users found');
            return 1;
        }

        // Load or initialize progress
        $progress = $this->loadProgress();
        
        if ($this->option('reset')) {
            $progress = ['imported_count' => 0, 'last_run' => null, 'completed' => false];
            $this->saveProgress($progress);
            $this->info('Progress reset. Starting fresh.');
        }

        // Check if already completed
        if ($progress['completed']) {
            $this->info('All quotes already imported. Use --reset to start over.');
            return 0;
        }

        // Read CSV
        $allQuotes = $this->readCSV($csvPath);
        $totalQuotes = count($allQuotes);
        
        // Get batch to import
        $batchSize = (int) $this->option('batch');
        $startIndex = $progress['imported_count'];
        $quotesToImport = array_slice($allQuotes, $startIndex, $batchSize);

        if (empty($quotesToImport)) {
            $progress['completed'] = true;
            $this->saveProgress($progress);
            $this->info('All quotes have been imported!');
            Log::info('Bot quote import completed', ['total' => $totalQuotes]);
            return 0;
        }

        // Import quotes
        $imported = 0;
        foreach ($quotesToImport as $quoteData) {
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
                
            } catch (\Exception $e) {
                Log::error('Error importing bot quote', [
                    'quote' => $quoteData['content'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Update progress
        $progress['imported_count'] += $imported;
        $progress['last_run'] = now()->toDateTimeString();
        
        if ($progress['imported_count'] >= $totalQuotes) {
            $progress['completed'] = true;
        }
        
        $this->saveProgress($progress);

        // Output
        $remaining = $totalQuotes - $progress['imported_count'];
        $this->info("Imported {$imported} quotes. Total: {$progress['imported_count']}/{$totalQuotes}. Remaining: {$remaining}");
        
        Log::info('Bot cron import executed', [
            'imported_this_run' => $imported,
            'total_imported' => $progress['imported_count'],
            'remaining' => $remaining,
        ]);

        return 0;
    }

    /**
     * Read CSV file
     */
    protected function readCSV(string $path): array
    {
        $quotes = [];
        $file = fopen($path, 'r');
        $header = fgetcsv($file); // Skip header
        
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

        // Shuffle once for randomness but maintain order across runs
        if (!$this->progressExists()) {
            shuffle($quotes);
        }

        return $quotes;
    }

    /**
     * Load progress from storage
     */
    protected function loadProgress(): array
    {
        $path = storage_path('app/' . $this->progressFile);
        
        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true);
        }

        return [
            'imported_count' => 0,
            'last_run' => null,
            'completed' => false,
        ];
    }

    /**
     * Save progress to storage
     */
    protected function saveProgress(array $progress): void
    {
        $path = storage_path('app/' . $this->progressFile);
        file_put_contents($path, json_encode($progress, JSON_PRETTY_PRINT));
    }

    /**
     * Check if progress file exists
     */
    protected function progressExists(): bool
    {
        return file_exists(storage_path('app/' . $this->progressFile));
    }
}
