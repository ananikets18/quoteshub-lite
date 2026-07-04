<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove is_featured column from quotes table
        if (Schema::hasColumn('quotes', 'is_featured')) {
            Schema::table('quotes', function (Blueprint $table) {
                $table->dropIndex(['is_featured']); // Drop index first
                $table->dropColumn('is_featured');
            });
        }

        // Remove quote_featured column from user_notification_preferences table
        if (Schema::hasColumn('user_notification_preferences', 'quote_featured')) {
            Schema::table('user_notification_preferences', function (Blueprint $table) {
                $table->dropColumn('quote_featured');
            });
        }

        // Delete all quote_featured notifications
        DB::table('notifications')->where('type', 'quote_featured')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back is_featured column to quotes table
        Schema::table('quotes', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('status');
            $table->index('is_featured');
        });

        // Add back quote_featured column to user_notification_preferences table
        Schema::table('user_notification_preferences', function (Blueprint $table) {
            $table->boolean('quote_featured')->default(true)->after('quote_removed');
        });
    }
};
