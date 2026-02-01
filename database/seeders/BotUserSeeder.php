<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BotUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $botUsers = [
            [
                "name" => "Aarav Deshmukh",
                "username" => "aarav_deshmukh",
                "email" => "aarav_deshmukh@bot.quoteshub.local",
                "bio" => "Coding dreams into reality.",
                "location" => "Pune, India",
                "website" => null,
            ],
            [
                "name" => "Priya Mehta",
                "username" => "priya_mehta",
                "email" => "priya_mehta@bot.quoteshub.local",
                "bio" => "Blending logic with art.",
                "location" => "Ahmedabad, India",
                "website" => null,
            ],
            [
                "name" => "Harpreet Singh",
                "username" => "harpreet_singh",
                "email" => "harpreet_singh@bot.quoteshub.local",
                "bio" => "Fuelled by code and coffee.",
                "location" => "Chandigarh, India",
                "website" => null,
            ],
            [
                "name" => "Kavya Iyer",
                "username" => "kavya_iyer",
                "email" => "kavya_iyer@bot.quoteshub.local",
                "bio" => "Writing stories that move hearts.",
                "location" => "Chennai, India",
                "website" => null,
            ],
            [
                "name" => "Nishant Patel",
                "username" => "nishant_patel",
                "email" => "nishant_patel@bot.quoteshub.local",
                "bio" => "Tech enthusiast exploring creative minds.",
                "location" => "Surat, India",
                "website" => null,
            ],
            [
                "name" => "Emily Johnson",
                "username" => "emily_johnson",
                "email" => "emily_johnson@bot.quoteshub.local",
                "bio" => "Chasing ideas that inspire change.",
                "location" => "New York, USA",
                "website" => null,
            ],
            [
                "name" => "Ramesh Pawar",
                "username" => "ramesh_pawar",
                "email" => "ramesh_pawar@bot.quoteshub.local",
                "bio" => "Lover of logic, life, and laughter.",
                "location" => "Mumbai, India",
                "website" => null,
            ],
            [
                "name" => "Fatima Khan",
                "username" => "fatima_khan",
                "email" => "fatima_khan@bot.quoteshub.local",
                "bio" => "Building stories one line at a time.",
                "location" => "Delhi, India",
                "website" => null,
            ],
            [
                "name" => "Hiroshi Tanaka",
                "username" => "hiroshi_tanaka",
                "email" => "hiroshi_tanaka@bot.quoteshub.local",
                "bio" => "Creating simplicity from complexity.",
                "location" => "Tokyo, Japan",
                "website" => null,
            ],
            [
                "name" => "Luca Rossi",
                "username" => "luca_rossi",
                "email" => "luca_rossi@bot.quoteshub.local",
                "bio" => "Exploring design through words and rhythm.",
                "location" => "Milan, Italy",
                "website" => null,
            ],
            [
                "name" => "Sanjana Kulkarni",
                "username" => "sanjana_kulkarni",
                "email" => "sanjana_kulkarni@bot.quoteshub.local",
                "bio" => "Finding poetry in everyday chaos.",
                "location" => "Nagpur, India",
                "website" => null,
            ],
            [
                "name" => "Vikram Sharma",
                "username" => "vikram_sharma",
                "email" => "vikram_sharma@bot.quoteshub.local",
                "bio" => "Turning ideas into digital realities.",
                "location" => "Bengaluru, India",
                "website" => null,
            ],
            [
                "name" => "Meera Joshi",
                "username" => "meera_joshi",
                "email" => "meera_joshi@bot.quoteshub.local",
                "bio" => "Collecting moments, not things.",
                "location" => "Thane, India",
                "website" => null,
            ],
            [
                "name" => "Dhruv Trivedi",
                "username" => "dhruv_trivedi",
                "email" => "dhruv_trivedi@bot.quoteshub.local",
                "bio" => "Quotes, coffee, and clean code.",
                "location" => "Vadodara, India",
                "website" => null,
            ],
            [
                "name" => "Ananya Rao",
                "username" => "ananya_rao",
                "email" => "ananya_rao@bot.quoteshub.local",
                "bio" => "Documenting the beauty of small wins.",
                "location" => "Hyderabad, India",
                "website" => null,
            ],
            [
                "name" => "Gurpreet Kaur",
                "username" => "gurpreet_kaur",
                "email" => "gurpreet_kaur@bot.quoteshub.local",
                "bio" => "Spreading warmth through words.",
                "location" => "Ludhiana, India",
                "website" => null,
            ],
            [
                "name" => "Arjun Nair",
                "username" => "arjun_nair",
                "email" => "arjun_nair@bot.quoteshub.local",
                "bio" => "Minimal words, maximum impact.",
                "location" => "Kochi, India",
                "website" => null,
            ],
            [
                "name" => "Sneha Banerjee",
                "username" => "sneha_banerjee",
                "email" => "sneha_banerjee@bot.quoteshub.local",
                "bio" => "Ink, ideas, and infinite curiosity.",
                "location" => "Kolkata, India",
                "website" => null,
            ],
            [
                "name" => "Rahul Verma",
                "username" => "rahul_verma",
                "email" => "rahul_verma@bot.quoteshub.local",
                "bio" => "Quotes for thinkers and tinkerers.",
                "location" => "Jaipur, India",
                "website" => null,
            ],
            [
                "name" => "Ishita Desai",
                "username" => "ishita_desai",
                "email" => "ishita_desai@bot.quoteshub.local",
                "bio" => "Designing meaning through minimal lines.",
                "location" => "Rajkot, India",
                "website" => null,
            ],
            [
                "name" => "Noah Miller",
                "username" => "noah_miller",
                "email" => "noah_miller@bot.quoteshub.local",
                "bio" => "Translating feelings into sentences.",
                "location" => "Toronto, Canada",
                "website" => null,
            ],
            [
                "name" => "Sofia Garcia",
                "username" => "sofia_garcia",
                "email" => "sofia_garcia@bot.quoteshub.local",
                "bio" => "Words that travel beyond borders.",
                "location" => "Madrid, Spain",
                "website" => null,
            ],
            [
                "name" => "Liam OConnor",
                "username" => "liam_oconnor",
                "email" => "liam_oconnor@bot.quoteshub.local",
                "bio" => "Collecting thoughts from quiet corners.",
                "location" => "Dublin, Ireland",
                "website" => null,
            ],
            [
                "name" => "Hana Kim",
                "username" => "hana_kim",
                "email" => "hana_kim@bot.quoteshub.local",
                "bio" => "Short lines, long reflections.",
                "location" => "Seoul, South Korea",
                "website" => null,
            ],
            [
                "name" => "Amir Haddad",
                "username" => "amir_haddad",
                "email" => "amir_haddad@bot.quoteshub.local",
                "bio" => "Chasing timeless thoughts in modern times.",
                "location" => "Dubai, UAE",
                "website" => null,
            ],
            [
                "name" => "Elena Petrova",
                "username" => "elena_petrova",
                "email" => "elena_petrova@bot.quoteshub.local",
                "bio" => "Writing calm into a noisy world.",
                "location" => "Moscow, Russia",
                "website" => null,
            ],
            [
                "name" => "Carlos Silva",
                "username" => "carlos_silva",
                "email" => "carlos_silva@bot.quoteshub.local",
                "bio" => "Rhythm, reason, and reflection.",
                "location" => "Sao Paulo, Brazil",
                "website" => null,
            ],
            [
                "name" => "Yuki Sato",
                "username" => "yuki_sato",
                "email" => "yuki_sato@bot.quoteshub.local",
                "bio" => "Finding harmony in few words.",
                "location" => "Osaka, Japan",
                "website" => null,
            ],
            [
                "name" => "Nora Ahmed",
                "username" => "nora_ahmed",
                "email" => "nora_ahmed@bot.quoteshub.local",
                "bio" => "Echoes of wisdom in tiny lines.",
                "location" => "Cairo, Egypt",
                "website" => null,
            ],
            [
                "name" => "Jonas Weber",
                "username" => "jonas_weber",
                "email" => "jonas_weber@bot.quoteshub.local",
                "bio" => "Curating thoughts for curious minds.",
                "location" => "Berlin, Germany",
                "website" => null,
            ],
        ];

        $this->command->info("Creating " . count($botUsers) . " bot users...");

        $created = 0;
        foreach ($botUsers as $botData) {
            // Check if user already exists
            if (User::where('email', $botData['email'])->exists()) {
                $this->command->warn("Skipping {$botData['username']} - already exists");
                continue;
            }

            User::create([
                'name' => $botData['name'],
                'username' => $botData['username'],
                'email' => $botData['email'],
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'bio' => $botData['bio'],
                'location' => $botData['location'],
                'website' => $botData['website'],
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

            $created++;
            if ($created % 10 == 0) {
                $this->command->info("Created {$created}/" . count($botUsers) . " bot users...");
            }
        }

        $this->command->info("Successfully created {$created} bot users!");
    }
}
