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
        Schema::create('user_author_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('view_count')->default(0);
            $table->integer('like_count')->default(0);
            $table->integer('save_count')->default(0);
            $table->integer('follow_exists')->default(0); // 1 if user follows author
            $table->decimal('engagement_score', 8, 2)->default(0);
            $table->timestamp('last_interacted_at')->nullable();
            $table->timestamps();

            // Unique constraint
            $table->unique(['user_id', 'author_id']);
            
            // Index for recommendations
            $table->index(['user_id', 'engagement_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_author_preferences');
    }
};
