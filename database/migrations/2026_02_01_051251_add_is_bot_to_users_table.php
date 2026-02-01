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
            $table->boolean('is_bot')->default(false)->after('role');
            $table->timestamp('last_bot_activity')->nullable()->after('is_bot');
            $table->integer('daily_action_count')->default(0)->after('last_bot_activity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_bot', 'last_bot_activity', 'daily_action_count']);
        });
    }
};
