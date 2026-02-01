<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Bot System Configuration
    |--------------------------------------------------------------------------
    |
    | Configure bot behavior for simulating user activity on the platform.
    | These bots help create an active appearance before real user growth.
    |
    */

    'enabled' => env('BOT_SYSTEM_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Bot User Count
    |--------------------------------------------------------------------------
    |
    | Number of bot users to create in the system
    |
    */
    'bot_count' => env('BOT_USER_COUNT', 50),

    /*
    |--------------------------------------------------------------------------
    | Activity Frequencies (per hour)
    |--------------------------------------------------------------------------
    |
    | Control how many actions bots should perform per hour
    |
    */
    'activity' => [
        'quotes_per_hour' => env('BOT_QUOTES_PER_HOUR', 2),
        'likes_per_hour' => env('BOT_LIKES_PER_HOUR', 15),
        'saves_per_hour' => env('BOT_SAVES_PER_HOUR', 8),
        'follows_per_hour' => env('BOT_FOLLOWS_PER_HOUR', 5),
        'views_per_hour' => env('BOT_VIEWS_PER_HOUR', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Activity Probability (0-100)
    |--------------------------------------------------------------------------
    |
    | Percentage chance that each bot will perform an action when triggered
    |
    */
    'probability' => [
        'create_quote' => 15,
        'like_quote' => 50,
        'save_quote' => 25,
        'follow_user' => 15,
        'view_quote' => 60,
    ],

    /*
    |--------------------------------------------------------------------------
    | Bot Behavior Patterns
    |--------------------------------------------------------------------------
    |
    | Configure realistic behavior patterns
    |
    */
    'behavior' => [
        // Time range for bot activity (hours in 24h format)
        'active_hours' => [
            'start' => 6,
            'end' => 23,
        ],

        // Days of week bots are more active (1 = Monday, 7 = Sunday)
        'peak_days' => [1, 2, 3, 4, 5],

        // Minimum delay between bot actions (seconds)
        'min_action_delay' => 10,

        // Maximum delay between bot actions (seconds)
        'max_action_delay' => 300,

        // Maximum quotes a bot can create per day
        'max_quotes_per_day' => 2,

        // Maximum likes a bot can give per day
        'max_likes_per_day' => 30,

        // Maximum saves per day
        'max_saves_per_day' => 15,

        // Maximum follows per day
        'max_follows_per_day' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Generation
    |--------------------------------------------------------------------------
    |
    | Settings for bot-generated content
    |
    */
    'content' => [
        // Categories bots prefer (leave empty for random)
        'preferred_categories' => [],

        // Sample quote authors bots can use
        'sample_authors' => [
            'Albert Einstein',
            'Maya Angelou',
            'Oscar Wilde',
            'Mark Twain',
            'Friedrich Nietzsche',
            'Confucius',
            'Ralph Waldo Emerson',
            'Henry David Thoreau',
            'Aristotle',
            'Plato',
            'Socrates',
            'Buddha',
            'Lao Tzu',
            'Marcus Aurelius',
            'Seneca',
            'Rumi',
            'Khalil Gibran',
            'Helen Keller',
            'Eleanor Roosevelt',
            'Mahatma Gandhi',
        ],

        // Sample quote templates (use {author} placeholder)
        'sample_quotes' => [
            'The only way to do great work is to love what you do.',
            'Life is what happens when you\'re busy making other plans.',
            'The future belongs to those who believe in the beauty of their dreams.',
            'In the end, we will remember not the words of our enemies, but the silence of our friends.',
            'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            'The only impossible journey is the one you never begin.',
            'Everything you\'ve ever wanted is on the other side of fear.',
            'Believe you can and you\'re halfway there.',
            'It does not matter how slowly you go as long as you do not stop.',
            'The best time to plant a tree was 20 years ago. The second best time is now.',
            'Your time is limited, don\'t waste it living someone else\'s life.',
            'The only thing we have to fear is fear itself.',
            'Life is either a daring adventure or nothing at all.',
            'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            'Do what you can, with what you have, where you are.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Bot Profile Settings
    |--------------------------------------------------------------------------
    |
    | Settings for bot user profiles
    |
    */
    'profiles' => [
        'name_prefix' => env('BOT_NAME_PREFIX', ''),
        'bio_templates' => [
            'Quote enthusiast and wisdom seeker',
            'Sharing inspiring words daily',
            'Collecting life\'s greatest quotes',
            'Philosophy and motivation lover',
            'Finding meaning in words',
            'Spreading positivity one quote at a time',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Safety Limits
    |--------------------------------------------------------------------------
    |
    | Prevent bot system from overwhelming the database
    |
    */
    'limits' => [
        // Maximum total bot actions per day
        'max_total_actions_per_day' => 5000,

        // Stop bots if real user percentage drops below this
        'min_real_user_percentage' => 10,

        // Maximum percentage of total activity that can be from bots
        'max_bot_activity_percentage' => 60,
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    | Bot activity logging settings
    |
    */
    'logging' => [
        'enabled' => env('BOT_LOGGING_ENABLED', true),
        'channel' => env('BOT_LOG_CHANNEL', 'stack'),
        'log_all_actions' => false, // Set to true for detailed debugging
    ],

];
