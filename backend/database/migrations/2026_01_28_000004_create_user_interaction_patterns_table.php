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
        Schema::create('user_interaction_patterns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('preferred_hour')->nullable(); // 0-23, most active hour
            $table->integer('avg_quote_length_min')->default(0); // Preferred quote length range
            $table->integer('avg_quote_length_max')->default(0);
            $table->integer('avg_session_duration')->default(0); // seconds
            $table->json('preferred_quote_styles')->nullable(); // Store array of preferences
            $table->decimal('diversity_score', 3, 2)->default(0.50); // 0-1, how diverse their interests are
            $table->timestamps();

            // Single record per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_interaction_patterns');
    }
};
