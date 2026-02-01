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
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->string('slug')->unique();
            $table->integer('quotes_count')->default(0);
            $table->timestamps();
            
            $table->index(['user_id', 'slug']);
        });
        
        // Pivot table for collections and quotes
        Schema::create('collection_quote', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained()->cascadeOnDelete();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['collection_id', 'quote_id']);
            $table->index('collection_id');
            $table->index('quote_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_quote');
        Schema::dropIfExists('collections');
    }
};
