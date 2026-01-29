<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Who receives the notification
            $table->foreignId('actor_id')->nullable()->constrained('users')->cascadeOnDelete(); // Who triggered it
            $table->string('type'); // new_follower, quote_liked, quote_saved, achievement_unlocked, admin_action
            $table->json('data')->nullable(); // Additional data (quote_id, achievement_type, etc.)
            $table->timestamp('read_at')->nullable(); // When user read the notification
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'read_at']); // Query unread notifications
            $table->index(['user_id', 'created_at']); // Query recent notifications
            $table->index('type'); // Filter by notification type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
