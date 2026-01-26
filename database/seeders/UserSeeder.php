<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates test users with different roles for development/testing
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@quoteshub.com',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
            'bio' => 'System Administrator',
        ]);

        // Create Moderator User
        User::create([
            'name' => 'Moderator User',
            'username' => 'moderator',
            'email' => 'moderator@quoteshub.com',
            'password' => Hash::make('Moderator123!'),
            'role' => 'moderator',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
            'bio' => 'Content Moderator',
        ]);

        // Create Regular User (Active)
        User::create([
            'name' => 'Regular User',
            'username' => 'user',
            'email' => 'user@quoteshub.com',
            'password' => Hash::make('User123!'),
            'role' => 'user',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
            'bio' => 'Regular user account',
        ]);

        // Create Inactive/Banned User (for testing)
        User::create([
            'name' => 'Banned User',
            'username' => 'banned',
            'email' => 'banned@quoteshub.com',
            'password' => Hash::make('Banned123!'),
            'role' => 'user',
            'is_active' => false, // Banned
            'is_verified' => true,
            'email_verified_at' => now(),
            'bio' => 'This account has been suspended',
        ]);

        // Create Unverified User (for testing email verification)
        User::create([
            'name' => 'Unverified User',
            'username' => 'unverified',
            'email' => 'unverified@quoteshub.com',
            'password' => Hash::make('Unverified123!'),
            'role' => 'user',
            'is_active' => true,
            'is_verified' => false, // Not verified
            'email_verified_at' => null,
            'bio' => 'Email not verified yet',
        ]);

        $this->command->info('✅ Created 5 test users:');
        $this->command->info('   Admin: admin@quoteshub.com / Admin123!');
        $this->command->info('   Moderator: moderator@quoteshub.com / Moderator123!');
        $this->command->info('   User: user@quoteshub.com / User123!');
        $this->command->info('   Banned: banned@quoteshub.com / Banned123! (is_active=false)');
        $this->command->info('   Unverified: unverified@quoteshub.com / Unverified123! (not verified)');
    }
}
