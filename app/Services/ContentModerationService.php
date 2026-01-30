<?php

namespace App\Services;

use App\Models\User;
use App\Models\Quote;

class ContentModerationService
{
    /**
     * Profanity word list (expanded)
     * Includes common variants, plural forms, and evasions
     */
    protected array $profanityList = [
        // Core profanity
        'fuck', 'fucker', 'fucking', 'fucked', 'fucks',
        'shit', 'shitty', 'bullshit', 'shits',
        'bitch', 'bitches', 'bitching',
        'asshole', 'assholes', 'ass',
        'bastard', 'bastards',
        'damn', 'damned',
        'crap', 'crappy',
        'piss', 'pissed', 'pissing',

        // Sexual terms
        'dick', 'dicks',
        'cock', 'cocks',
        'pussy', 'pussies',
        'slut', 'sluts', 'slutty',
        'whore', 'whores',
        'cum', 'cumming',
        'blowjob', 'handjob',
        'porn', 'porno', 'pornography',
        'sex', 'sexy', 'sexual',
        'nude', 'nudes', 'naked',

        // Slurs & hate speech
        'fag', 'faggot', 'faggots',
        'retard', 'retarded', 'retards',
        'nigger', 'nigga',
        'chink', 'gook',
        'kike', 'spic',

        // Mild insults (optional - may cause false positives)
        // 'idiot', 'moron', 'stupid', 'dumb',

        // Common evasive spellings (normalized by normalizeText)
        // 'f*ck', 'f**k', 'sh!t', 'b!tch', 'a$$hole'
    ];

    /**
     * Spam / low-quality content indicators
     */
    protected array $spamKeywords = [
        // CTA spam
        'click here', 'buy now', 'act now', 'limited offer',
        'don\'t miss out', 'hurry up', 'order now',
        'limited time', 'expires soon', 'last chance',
        'shop now', 'get it now', 'claim now',

        // Scam / fraud
        'free money', 'guaranteed income', 'make money fast',
        'double your income', 'risk free', 'no risk',
        'congratulations you won', 'you are a winner', 'you won',
        'claim your prize', 'urgent response needed',
        'verify your account', 'confirm your identity',
        'wire transfer', 'send money',

        // Marketing & self-promo
        'subscribe to', 'follow me', 'check out my',
        'visit my website', 'link in bio', 'click link',
        'dm me', 'message me for details', 'contact me',
        'join my', 'sign up for', 'register now',

        // Crypto / investment spam
        'crypto investment', 'bitcoin giveaway', 'crypto giveaway',
        'nft drop', 'forex trading', 'binary options',
        '100% profit', 'passive income', 'guaranteed returns',
        'investment opportunity', 'get rich quick',

        // Adult / shady ads
        'viagra', 'cialis', 'pills',
        'adult dating', 'hookup now', 'meet singles',
        'live cam', 'onlyfans', 'premium snapchat',
        'escort', 'massage',

        // Gambling
        'casino', 'online casino', 'play casino',
        'lottery', 'jackpot', 'bet now',
        'sports betting', 'poker online',

        // Work from home scams
        'work from home', 'earn from home',
        'no experience needed', 'easy money',
    ];

    /**
     * Normalize text before scanning (catches leetspeak and evasions)
     */
    protected function normalizeText(string $text): string
    {
        $text = strtolower($text);

        // Replace common leetspeak and symbol substitutions
        $replacements = [
            '0' => 'o',
            '1' => 'i',
            '3' => 'e',
            '4' => 'a',
            '5' => 's',
            '7' => 't',
            '@' => 'a',
            '$' => 's',
            '!' => 'i',
            '|' => 'i',
            '8' => 'b',
        ];

        $text = strtr($text, $replacements);

        // Remove common separators used to evade filters
        $text = str_replace(['*', '-', '_', '.', ' '], '', $text);

        return $text;
    }

    /**
     * Check if content contains profanity
     */
    public function containsProfanity(string $content): bool
    {
        $content = strtolower($content);
        
        foreach ($this->profanityList as $word) {
            // Use word boundaries to avoid false positives
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $content)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get profanity words found in content
     */
    public function getProfanityWords(string $content): array
    {
        $content = strtolower($content);
        $found = [];
        
        foreach ($this->profanityList as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $content)) {
                $found[] = $word;
            }
        }
        
        return $found;
    }

    /**
     * Check if content contains URLs or links
     */
    public function containsUrls(string $content): bool
    {
        // Check for common URL patterns
        $urlPattern = '/(https?:\/\/|www\.|\.com|\.net|\.org|\.io|\.co|bit\.ly|tinyurl)/i';
        return preg_match($urlPattern, $content) === 1;
    }

    /**
     * Extract URLs from content
     */
    public function extractUrls(string $content): array
    {
        $pattern = '/(https?:\/\/[^\s]+|www\.[^\s]+)/i';
        preg_match_all($pattern, $content, $matches);
        return $matches[0] ?? [];
    }

    /**
     * Check if content appears to be spam
     */
    public function isSpam(string $content): bool
    {
        $content = strtolower($content);
        $spamScore = 0;

        // Check for spam keywords
        foreach ($this->spamKeywords as $keyword) {
            if (stripos($content, $keyword) !== false) {
                $spamScore += 2;
            }
        }

        // Check for excessive capitalization (>50% caps)
        $upperCount = preg_match_all('/[A-Z]/', $content);
        $totalLetters = preg_match_all('/[a-zA-Z]/', $content);
        if ($totalLetters > 0 && ($upperCount / $totalLetters) > 0.5) {
            $spamScore += 1;
        }

        // Check for excessive punctuation (!!!, ???, etc.)
        if (preg_match('/[!?]{3,}/', $content)) {
            $spamScore += 1;
        }

        // Check for excessive emojis or special characters
        $specialCharCount = preg_match_all('/[^a-zA-Z0-9\s.,!?\'"()-]/', $content);
        if ($specialCharCount > 10) {
            $spamScore += 1;
        }

        // Spam threshold
        return $spamScore >= 3;
    }

    /**
     * Calculate user trust score (0-100)
     * Higher score = more trusted
     */
    public function getUserTrustScore(User $user): int
    {
        $score = 50; // Start at neutral

        // Account age bonus (max +20)
        $accountAgeDays = $user->created_at->diffInDays(now());
        $score += min(20, floor($accountAgeDays / 7)); // +1 per week, max 20

        // Quote count bonus (max +15)
        $quoteCount = $user->quotes()->count();
        $score += min(15, floor($quoteCount / 2)); // +1 per 2 quotes, max 15

        // Engagement bonus (max +10)
        $totalLikes = $user->quotes()->sum('likes_count');
        $score += min(10, floor($totalLikes / 10)); // +1 per 10 likes, max 10

        // Follower bonus (max +10)
        $followerCount = $user->followers()->count();
        $score += min(10, floor($followerCount / 5)); // +1 per 5 followers, max 10

        // Email verification bonus
        if ($user->hasVerifiedEmail()) {
            $score += 5;
        }

        // Penalties
        // Check if user has been warned
        $warnings = \App\Models\Notification::where('user_id', $user->id)
            ->where('type', 'admin_warning')
            ->count();
        $score -= ($warnings * 10); // -10 per warning

        // Check if user has had quotes removed
        $removedQuotes = Quote::onlyTrashed()
            ->where('user_id', $user->id)
            ->count();
        $score -= ($removedQuotes * 15); // -15 per removed quote

        // Ensure score is between 0-100
        return max(0, min(100, $score));
    }

    /**
     * Check if user is low-trust (should be flagged for review)
     */
    public function isLowTrustUser(User $user): bool
    {
        return $this->getUserTrustScore($user) < 30;
    }

    /**
     * Comprehensive content validation
     * Returns array with validation results
     */
    public function validateContent(string $content, User $user): array
    {
        $issues = [];
        $flags = [];
        $trustScore = $this->getUserTrustScore($user);

        // Check profanity
        if ($this->containsProfanity($content)) {
            $issues[] = 'Content contains inappropriate language';
            $flags[] = 'profanity';
        }

        // Check URLs
        if ($this->containsUrls($content)) {
            $urls = $this->extractUrls($content);
            $issues[] = 'Content contains URLs or links';
            $flags[] = 'contains_url';
        }

        // Check spam
        if ($this->isSpam($content)) {
            $issues[] = 'Content appears to be spam';
            $flags[] = 'spam';
        }

        // Check content length
        if (strlen($content) < 10) {
            $issues[] = 'Content is too short';
            $flags[] = 'too_short';
        }

        if (strlen($content) > 500) {
            $issues[] = 'Content exceeds maximum length';
            $flags[] = 'too_long';
        }

        // Low trust user flag
        if ($this->isLowTrustUser($user)) {
            $flags[] = 'low_trust_user';
        }

        return [
            'valid' => empty($issues),
            'issues' => $issues,
            'flags' => $flags,
            'trust_score' => $trustScore,
            'should_auto_approve' => empty($issues) && $trustScore >= 30,
        ];
    }

    /**
     * Check if user is rate limited for quote creation
     * Returns true if user should be blocked
     */
    public function isRateLimited(User $user): bool
    {
        $trustScore = $this->getUserTrustScore($user);

        // Different limits based on trust score
        if ($trustScore >= 70) {
            // High trust: 20 quotes per hour
            $limit = 20;
            $timeWindow = 60;
        } elseif ($trustScore >= 40) {
            // Medium trust: 10 quotes per hour
            $limit = 10;
            $timeWindow = 60;
        } else {
            // Low trust: 5 quotes per hour
            $limit = 5;
            $timeWindow = 60;
        }

        $recentQuotes = Quote::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMinutes($timeWindow))
            ->count();

        return $recentQuotes >= $limit;
    }

    /**
     * Get remaining quotes user can post
     */
    public function getRemainingQuotes(User $user): array
    {
        $trustScore = $this->getUserTrustScore($user);

        if ($trustScore >= 70) {
            $limit = 20;
            $timeWindow = 60;
        } elseif ($trustScore >= 40) {
            $limit = 10;
            $timeWindow = 60;
        } else {
            $limit = 5;
            $timeWindow = 60;
        }

        $recentQuotes = Quote::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMinutes($timeWindow))
            ->count();

        return [
            'limit' => $limit,
            'used' => $recentQuotes,
            'remaining' => max(0, $limit - $recentQuotes),
            'time_window_minutes' => $timeWindow,
            'trust_score' => $trustScore,
        ];
    }
}
