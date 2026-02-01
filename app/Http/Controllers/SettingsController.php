<?php

namespace App\Http\Controllers;

use App\Models\BlockedUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Update privacy settings
     */
    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'profile_is_private' => 'boolean',
            'show_email' => 'boolean',
            'show_activity_status' => 'boolean',
        ]);

        $user = auth()->user();
        $user->update($validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Privacy settings updated successfully'
            ]);
        }

        return back()->with('success', 'Privacy settings updated successfully');
    }

    /**
     * Get blocked users list
     */
    public function blockedUsers(Request $request)
    {
        $user = auth()->user();
        
        $blockedUsers = $user->blockedUsers()
            ->select('users.id', 'users.name', 'users.username', 'users.avatar', 'blocked_users.created_at as blocked_at')
            ->get()
            ->map(function ($blockedUser) {
                return [
                    'id' => $blockedUser->id,
                    'name' => $blockedUser->name,
                    'username' => $blockedUser->username,
                    'avatar' => $blockedUser->avatar,
                    'blocked_at' => $blockedUser->blocked_at,
                ];
            });

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'blocked_users' => $blockedUsers
            ]);
        }

        return Inertia::render('Settings/BlockedUsers', [
            'blockedUsers' => $blockedUsers,
        ]);
    }

    /**
     * Block a user
     */
    public function blockUser(Request $request, $username)
    {
        $user = auth()->user();
        $userToBlock = User::where('username', $username)->firstOrFail();

        // Can't block yourself
        if ($user->id === $userToBlock->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot block yourself'
            ], 400);
        }

        // Check if already blocked
        if ($user->isBlocking($userToBlock)) {
            return response()->json([
                'success' => false,
                'message' => 'User is already blocked'
            ], 400);
        }

        BlockedUser::create([
            'user_id' => $user->id,
            'blocked_user_id' => $userToBlock->id,
            'reason' => $request->input('reason'),
        ]);

        // Also unfollow if following
        $user->following()->detach($userToBlock->id);
        $userToBlock->following()->detach($user->id);

        return response()->json([
            'success' => true,
            'message' => 'User blocked successfully'
        ]);
    }

    /**
     * Unblock a user
     */
    public function unblockUser($username)
    {
        $user = auth()->user();
        $userToUnblock = User::where('username', $username)->firstOrFail();

        BlockedUser::where('user_id', $user->id)
            ->where('blocked_user_id', $userToUnblock->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'User unblocked successfully'
        ]);
    }

    /**
     * Delete account
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
            'confirmation' => ['required', 'string', 'in:DELETE'],
        ]);

        $user = auth()->user();

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        // Logout the user
        Auth::logout();

        // Delete the user (cascade will handle related data)
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Your account has been deleted successfully');
    }
}
