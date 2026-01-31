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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->string('author')->nullable();
            $table->string('source')->nullable(); // Book, speech, etc.
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_featured')->default(false);
            $table->integer('likes_count')->default(0);
            $table->integer('saves_count')->default(0);
            $table->integer('shares_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index('is_featured');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
