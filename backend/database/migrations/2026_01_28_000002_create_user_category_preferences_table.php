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
        Schema::create('user_category_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->integer('view_count')->default(0);
            $table->integer('like_count')->default(0);
            $table->integer('save_count')->default(0);
            $table->integer('share_count')->default(0);
            $table->decimal('engagement_score', 8, 2)->default(0); // Calculated score
            $table->timestamp('last_interacted_at')->nullable();
            $table->timestamps();

            // Unique constraint
            $table->unique(['user_id', 'category_id']);
            
            // Index for fast lookups
            $table->index(['user_id', 'engagement_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_category_preferences');
    }
};
