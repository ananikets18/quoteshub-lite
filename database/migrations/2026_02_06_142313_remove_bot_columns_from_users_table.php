<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, delete all bot users and their related data
        DB::table('users')->where('is_bot', true)->delete();
        
        // Remove bot columns from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_bot', 'last_bot_activity', 'daily_action_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add bot columns back
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_bot')->default(false);
            $table->timestamp('last_bot_activity')->nullable();
            $table->integer('daily_action_count')->default(0);
        });
    }
};
