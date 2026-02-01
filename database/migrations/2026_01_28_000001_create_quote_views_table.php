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
        Schema::create('quote_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('quote_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable(); // For tracking non-authenticated users
            $table->integer('duration_seconds')->default(0); // Time spent viewing
            $table->string('source')->nullable(); // feed, profile, search, category, etc.
            $table->timestamps();

            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index(['quote_id', 'created_at']);
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_views');
    }
};
