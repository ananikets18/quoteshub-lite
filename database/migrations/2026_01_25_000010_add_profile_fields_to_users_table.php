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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->text('bio')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('bio');
            $table->string('cover_image')->nullable()->after('avatar');
            $table->string('website')->nullable()->after('cover_image');
            $table->string('location')->nullable()->after('website');
            $table->enum('role', ['user', 'moderator', 'admin'])->default('user')->after('location');
            $table->integer('quotes_count')->default(0)->after('role');
            $table->integer('followers_count')->default(0)->after('quotes_count');
            $table->integer('following_count')->default(0)->after('followers_count');
            $table->integer('daily_streak')->default(0)->after('following_count');
            $table->date('last_active_date')->nullable()->after('daily_streak');
            $table->boolean('is_verified')->default(false)->after('last_active_date');
            $table->boolean('is_active')->default(true)->after('is_verified');
            
            $table->index('username');
            $table->index('role');
            $table->index('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'bio',
                'avatar',
                'cover_image',
                'website',
                'location',
                'role',
                'quotes_count',
                'followers_count',
                'following_count',
                'daily_streak',
                'last_active_date',
                'is_verified',
                'is_active',
            ]);
        });
    }
};
