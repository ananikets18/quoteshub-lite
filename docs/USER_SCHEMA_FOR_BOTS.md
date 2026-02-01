# Users Table Schema

## Complete User Structure

### Required Fields for Bot Users

```php
[
    // REQUIRED - Basic Info
    'name' => 'John Doe',                    // Full name
    'username' => 'john_doe',                // Unique username (lowercase, underscores)
    'email' => 'john@bot.local',             // Unique email
    'password' => Hash::make('password'),     // Hashed password
    
    // REQUIRED - Bot Flags
    'is_bot' => true,                        // Mark as bot
    'is_active' => true,                     // Active status
    'email_verified_at' => now(),            // Email verification timestamp
    
    // REQUIRED - Onboarding
    'onboarding_completed' => true,
    'onboarding_completed_at' => now(),
    'onboarding_steps' => [
        'welcome' => true,
        'interests' => true,
        'profile' => true,
        'follow' => true,
    ],
    
    // OPTIONAL - Profile Info
    'bio' => 'Quote enthusiast',             // User bio (text)
    'avatar' => null,                        // Avatar URL/path
    'cover_image' => null,                   // Cover image URL/path
    'website' => null,                       // Website URL
    'location' => null,                      // Location string
    
    // OPTIONAL - Role & Status
    'role' => 'user',                        // 'user', 'moderator', 'admin'
    'google_id' => null,                     // Google OAuth ID (null for bots)
    
    // AUTO-MANAGED - Activity Tracking
    'last_bot_activity' => null,             // Auto-updated by BotService
    'daily_action_count' => 0,               // Auto-updated by BotService
    'last_active_at' => null,                // Last activity timestamp
    'daily_streak' => 0,                     // Daily streak counter
    
    // AUTO-MANAGED - Counters (DO NOT SET MANUALLY)
    'quotes_count' => 0,                     // Updated by observers
    'followers_count' => 0,                  // Updated by observers
    'following_count' => 0,                  // Updated by observers
    
    // OPTIONAL - Privacy Settings
    'profile_is_private' => false,
    'show_email' => false,
    'show_activity_status' => true,
    
    // AUTO-MANAGED - System Fields
    'created_at' => now(),                   // Auto-set by Laravel
    'updated_at' => now(),                   // Auto-set by Laravel
    'remember_token' => null,                // Auto-set by Laravel
]
```

---

## Minimal Bot User Template

```php
// Minimum required fields to create a bot user
[
    'name' => 'Alex Smith',
    'username' => 'alex_smith',
    'email' => 'alex_smith@bot.quoteshub.local',
    'password' => Hash::make(Str::random(32)),
    'email_verified_at' => now(),
    'is_bot' => true,
    'is_active' => true,
    'role' => 'user',
    'onboarding_completed' => true,
    'onboarding_completed_at' => now(),
    'onboarding_steps' => [
        'welcome' => true,
        'interests' => true,
        'profile' => true,
        'follow' => true,
    ],
]
```

---

## Field Definitions

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| **id** | bigint | Auto | - | Primary key (auto-increment) |
| **google_id** | string | No | null | Google OAuth ID |
| **name** | string | Yes | - | Full name |
| **username** | string | Yes | - | Unique username (indexed) |
| **email** | string | Yes | - | Unique email (indexed) |
| **email_verified_at** | timestamp | No | null | Email verification date |
| **password** | string | Yes* | - | Hashed password (*nullable) |
| **onboarding_completed** | boolean | No | false | Onboarding status |
| **onboarding_steps** | json | No | null | Onboarding progress |
| **onboarding_completed_at** | timestamp | No | null | When onboarding finished |
| **bio** | text | No | null | User biography |
| **avatar** | string | No | null | Avatar image path/URL |
| **cover_image** | string | No | null | Cover image path/URL |
| **website** | string | No | null | Personal website URL |
| **location** | string | No | null | User location |
| **role** | enum | No | 'user' | user/moderator/admin |
| **is_bot** | boolean | No | false | Bot account flag |
| **last_bot_activity** | timestamp | No | null | Last bot action time |
| **daily_action_count** | integer | No | 0 | Daily bot actions counter |
| **quotes_count** | integer | No | 0 | Total quotes (cached) |
| **followers_count** | integer | No | 0 | Followers count (cached) |
| **following_count** | integer | No | 0 | Following count (cached) |
| **daily_streak** | integer | No | 0 | Daily login streak |
| **last_active_at** | timestamp | No | null | Last activity timestamp |
| **is_verified** | boolean | No | false | Verified badge status |
| **is_active** | boolean | No | true | Account active status |
| **profile_is_private** | boolean | No | false | Private profile flag |
| **show_email** | boolean | No | false | Show email publicly |
| **show_activity_status** | boolean | No | true | Show online status |
| **remember_token** | string | No | null | Remember me token |
| **created_at** | timestamp | Auto | now() | Record creation time |
| **updated_at** | timestamp | Auto | now() | Last update time |

---

## Sample Bot Users JSON

```json
[
  {
    "name": "Sarah Johnson",
    "username": "sarah_johnson",
    "email": "sarah_johnson@bot.quoteshub.local",
    "bio": "Sharing inspiring words daily",
    "location": "New York, NY",
    "website": null
  },
  {
    "name": "Michael Chen",
    "username": "michael_chen",
    "email": "michael_chen@bot.quoteshub.local",
    "bio": "Quote enthusiast and wisdom seeker",
    "location": "San Francisco, CA",
    "website": null
  },
  {
    "name": "Emma Williams",
    "username": "emma_williams",
    "email": "emma_williams@bot.quoteshub.local",
    "bio": "Collecting life's greatest quotes",
    "location": "London, UK",
    "website": null
  },
  {
    "name": "James Martinez",
    "username": "james_martinez",
    "email": "james_martinez@bot.quoteshub.local",
    "bio": "Philosophy and motivation lover",
    "location": "Austin, TX",
    "website": null
  },
  {
    "name": "Olivia Brown",
    "username": "olivia_brown",
    "email": "olivia_brown@bot.quoteshub.local",
    "bio": "Finding meaning in words",
    "location": "Toronto, Canada",
    "website": null
  }
]
```

---

## Creating Bot Users from Your List

### Method 1: Using Seeder (Recommended)

Edit `database/seeders/BotUserSeeder.php`:

```php
public function run(): void
{
    $botUsers = [
        [
            'name' => 'Sarah Johnson',
            'username' => 'sarah_johnson',
            'email' => 'sarah_johnson@bot.quoteshub.local',
            'bio' => 'Sharing inspiring words daily',
            'location' => 'New York, NY',
        ],
        // ... add your users here
    ];

    foreach ($botUsers as $userData) {
        User::create([
            'name' => $userData['name'],
            'username' => $userData['username'],
            'email' => $userData['email'],
            'password' => Hash::make(Str::random(32)),
            'email_verified_at' => now(),
            'bio' => $userData['bio'] ?? 'Quote enthusiast',
            'location' => $userData['location'] ?? null,
            'website' => $userData['website'] ?? null,
            'role' => 'user',
            'is_bot' => true,
            'is_active' => true,
            'onboarding_completed' => true,
            'onboarding_completed_at' => now(),
            'onboarding_steps' => [
                'welcome' => true,
                'interests' => true,
                'profile' => true,
                'follow' => true,
            ],
        ]);
    }
}
```

### Method 2: Using Tinker

```bash
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$botUsers = [
    ['name' => 'Sarah Johnson', 'username' => 'sarah_johnson', 'email' => 'sarah@bot.local'],
    ['name' => 'Michael Chen', 'username' => 'michael_chen', 'email' => 'michael@bot.local'],
    // ... add more
];

foreach ($botUsers as $bot) {
    User::create([
        'name' => $bot['name'],
        'username' => $bot['username'],
        'email' => $bot['email'],
        'password' => Hash::make(Str::random(32)),
        'email_verified_at' => now(),
        'is_bot' => true,
        'is_active' => true,
        'role' => 'user',
        'onboarding_completed' => true,
        'onboarding_completed_at' => now(),
        'onboarding_steps' => ['welcome' => true, 'interests' => true, 'profile' => true, 'follow' => true],
    ]);
}
```

### Method 3: CSV Import Script

Create `database/seeders/BotUsersFromCSV.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BotUsersFromCSV extends Seeder
{
    public function run(): void
    {
        // CSV format: name,username,email,bio,location
        $csvFile = database_path('seeders/bot_users.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error('CSV file not found: ' . $csvFile);
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file); // Skip header row

        while (($row = fgetcsv($file)) !== false) {
            User::create([
                'name' => $row[0],
                'username' => $row[1],
                'email' => $row[2],
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'bio' => $row[3] ?? 'Quote enthusiast',
                'location' => $row[4] ?? null,
                'role' => 'user',
                'is_bot' => true,
                'is_active' => true,
                'onboarding_completed' => true,
                'onboarding_completed_at' => now(),
                'onboarding_steps' => [
                    'welcome' => true,
                    'interests' => true,
                    'profile' => true,
                    'follow' => true,
                ],
            ]);
        }

        fclose($file);
        $this->command->info('Bot users imported successfully!');
    }
}
```

CSV format (`database/seeders/bot_users.csv`):
```csv
name,username,email,bio,location
Sarah Johnson,sarah_johnson,sarah@bot.local,Sharing inspiring words,New York
Michael Chen,michael_chen,michael@bot.local,Quote enthusiast,San Francisco
```

---

## Important Notes

1. **Username Format**: Lowercase, use underscores for spaces
2. **Email Format**: Use `username@bot.quoteshub.local` pattern for bots
3. **Password**: Always hash with `Hash::make()`, use random strings for bots
4. **Onboarding**: Must be completed for bots to function properly
5. **Counters**: Don't manually set `quotes_count`, `followers_count`, `following_count` - they update automatically
6. **Bot Flags**: Always set `is_bot = true` and `is_active = true`
7. **Email Verified**: Set `email_verified_at = now()` for immediate access

---

## Provide Your Bot List

Please provide your bot users in one of these formats:

**Format 1: Simple List**
```
Name | Username | Email | Bio | Location
```

**Format 2: JSON**
```json
[{"name": "...", "username": "...", "email": "...", "bio": "...", "location": "..."}]
```

**Format 3: CSV**
```csv
name,username,email,bio,location
```

I'll help you create the appropriate seeder!
