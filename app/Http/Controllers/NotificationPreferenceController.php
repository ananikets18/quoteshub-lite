<?php

namespace App\Http\Controllers;

use App\Models\UserNotificationPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPreferenceController extends Controller
{
    /**
     * Show the notification preferences page
     */
    public function edit(): Response
    {
        $user = auth()->user();
        
        // Get or create preferences
        $preferences = $user->notificationPreferences()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'new_follower' => true,
                'quote_liked' => true,
                'quote_saved' => true,
                'comment_added' => true,
                'achievement_unlocked' => true,
                'admin_warning' => true,
                'quote_removed' => true,
                'quote_featured' => true,
                'in_app_notifications' => true,
                'email_notifications' => false,
                'push_notifications' => false,
                'notification_sounds' => true,
                'group_similar_notifications' => true,
            ]
        );

        return Inertia::render('Profile/NotificationPreferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update notification preferences
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'new_follower' => 'boolean',
            'quote_liked' => 'boolean',
            'quote_saved' => 'boolean',
            'comment_added' => 'boolean',
            'achievement_unlocked' => 'boolean',
            'admin_warning' => 'boolean',
            'quote_removed' => 'boolean',
            'quote_featured' => 'boolean',
            'in_app_notifications' => 'boolean',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'notification_sounds' => 'boolean',
            'group_similar_notifications' => 'boolean',
        ]);

        $user = auth()->user();
        
        $user->notificationPreferences()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        // Return JSON response for AJAX requests
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Notification preferences updated successfully'
            ]);
        }

        return redirect()->back()->with('success', 'Notification preferences updated successfully');
    }
}
