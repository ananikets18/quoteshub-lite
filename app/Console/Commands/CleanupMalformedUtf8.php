<?php

namespace App\Console\Commands;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupMalformedUtf8 extends Command
{
    protected $signature = 'cleanup:utf8';
    protected $description = 'Clean up malformed UTF-8 characters in quotes and user data';

    public function handle()
    {
        $this->info('Starting UTF-8 cleanup...');
        
        $fixedQuotes = 0;
        $fixedUsers = 0;

        // Clean up quotes
        $this->info('Cleaning quotes...');
        Quote::chunk(100, function ($quotes) use (&$fixedQuotes) {
            foreach ($quotes as $quote) {
                $originalContent = $quote->content;
                $originalAuthor = $quote->author;
                $originalSource = $quote->source;
                
                // Sanitize content
                $cleanContent = $this->sanitizeUtf8($originalContent);
                $cleanAuthor = $this->sanitizeUtf8($originalAuthor);
                $cleanSource = $this->sanitizeUtf8($originalSource);
                
                if ($cleanContent !== $originalContent || 
                    $cleanAuthor !== $originalAuthor || 
                    $cleanSource !== $originalSource) {
                    
                    $quote->content = $cleanContent;
                    $quote->author = $cleanAuthor;
                    $quote->source = $cleanSource;
                    $quote->save();
                    
                    $fixedQuotes++;
                    $this->line("Fixed quote ID {$quote->id}");
                }
            }
        });

        // Clean up users
        $this->info('Cleaning user data...');
        User::chunk(100, function ($users) use (&$fixedUsers) {
            foreach ($users as $user) {
                $originalName = $user->name;
                $originalUsername = $user->username;
                $originalBio = $user->bio;
                
                $cleanName = $this->sanitizeUtf8($originalName);
                $cleanUsername = $this->sanitizeUtf8($originalUsername);
                $cleanBio = $this->sanitizeUtf8($originalBio);
                
                if ($cleanName !== $originalName || 
                    $cleanUsername !== $originalUsername || 
                    $cleanBio !== $originalBio) {
                    
                    $user->name = $cleanName;
                    $user->username = $cleanUsername;
                    $user->bio = $cleanBio;
                    $user->save();
                    
                    $fixedUsers++;
                    $this->line("Fixed user ID {$user->id}");
                }
            }
        });

        $this->info("\n✅ Cleanup complete!");
        $this->info("Fixed quotes: {$fixedQuotes}");
        $this->info("Fixed users: {$fixedUsers}");

        return 0;
    }

    protected function sanitizeUtf8(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // Remove any invalid UTF-8 characters
        $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
        
        // Additional cleanup: remove null bytes and control characters except newlines/tabs
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
        
        return $value;
    }
}
