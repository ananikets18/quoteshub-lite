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
        Schema::create('user_not_interested', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('item_type'); // 'quote', 'category', 'author'
            $table->unsignedBigInteger('item_id');
            $table->string('reason')->nullable(); // 'not_relevant', 'seen_too_often', 'dont_like', etc.
            $table->timestamps();

            // Unique constraint - can't mark same item twice
            $table->unique(['user_id', 'item_type', 'item_id']);
            
            // Index for fast lookups
            $table->index(['user_id', 'item_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_not_interested');
    }
};
