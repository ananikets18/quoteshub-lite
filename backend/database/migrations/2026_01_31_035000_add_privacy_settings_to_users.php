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
            // Privacy settings
            $table->boolean('profile_is_private')->default(false)->after('is_active');
            $table->boolean('show_email')->default(false)->after('profile_is_private');
            $table->boolean('show_activity_status')->default(true)->after('show_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_is_private',
                'show_email',
                'show_activity_status',
            ]);
        });
    }
};
