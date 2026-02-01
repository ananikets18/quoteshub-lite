<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Production-ready refactoring based on best practices:
     * 1. Change last_active_date to last_active_at (timestamp for precision)
     * 2. Remove is_verified (use Laravel's email_verified_at instead)
     * 3. Move daily_streak to separate table (defer for now, keep but document)
     * 4. Add comments documenting counter columns as cached values
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 1. Replace last_active_date with last_active_at (timestamp)
            $table->dropColumn('last_active_date');
            $table->timestamp('last_active_at')->nullable()->after('daily_streak');
            $table->index('last_active_at'); // For recency queries
            
            // 2. Remove is_verified (use email_verified_at instead)
            $table->dropIndex(['is_verified']); // Drop index first
            $table->dropColumn('is_verified');
            
            // Note: email_verified_at already exists in users table from Laravel
            // We'll use that as the source of truth for email verification
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restore original columns
            $table->date('last_active_date')->nullable()->after('daily_streak');
            $table->dropColumn('last_active_at');
            
            $table->boolean('is_verified')->default(false)->after('last_active_date');
            $table->index('is_verified');
        });
    }
};
