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
        Schema::create('user_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Notification type preferences (true = enabled, false = disabled)
            $table->boolean('new_follower')->default(true);
            $table->boolean('quote_liked')->default(true);
            $table->boolean('quote_saved')->default(true);
            $table->boolean('comment_added')->default(true);
            $table->boolean('achievement_unlocked')->default(true);
            $table->boolean('admin_warning')->default(true);
            $table->boolean('quote_removed')->default(true);
            $table->boolean('quote_featured')->default(true);
            
            // Delivery preferences
            $table->boolean('in_app_notifications')->default(true);
            $table->boolean('email_notifications')->default(false);
            $table->boolean('push_notifications')->default(false);
            
            // Sound preferences
            $table->boolean('notification_sounds')->default(true);
            
            // Grouping preferences
            $table->boolean('group_similar_notifications')->default(true);
            
            $table->timestamps();
            
            // Ensure one preference row per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notification_preferences');
    }
};
