<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display the authenticated user's profile
     */
    public function me()
    {
        $user = Auth::user()->load(['achievements']);
        
        return response()->json($user);
    }

    /**
     * Display a user's profile
     */
    public function show($username)
    {
        $user = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        // Add follow status if authenticated
        if (Auth::check()) {
            $user->is_following = Auth::user()->isFollowing($user);
            $user->is_followed_by = Auth::user()->isFollowedBy($user);
        }

        return response()->json($user);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:50|unique:users,username,' . $user->id,
            'bio' => 'nullable|string|max:500',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:100',
            'avatar' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Get user's quotes
     */
    public function quotes($username, Request $request)
    {
        $user = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        $quotes = $user->quotes()
            ->with(['categories', 'tags'])
            ->approved()
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($quotes);
    }

    /**
     * Get user's liked quotes
     */
    public function likedQuotes(Request $request)
    {
        $quotes = Auth::user()->likedQuotes()
            ->with(['user', 'categories', 'tags'])
            ->latest('likes.created_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($quotes);
    }

    /**
     * Get user's saved quotes
     */
    public function savedQuotes(Request $request)
    {
        $collection = $request->get('collection', 'default');

        $quotes = Auth::user()->savedQuotes()
            ->with(['user', 'categories', 'tags'])
            ->wherePivot('collection', $collection)
            ->latest('saves.created_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($quotes);
    }

    /**
     * Get user's collections
     */
    public function collections()
    {
        $collections = Auth::user()->saves()
            ->select('collection')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('collection')
            ->get();

        return response()->json($collections);
    }

    /**
     * Toggle follow
     */
    public function follow($username)
    {
        $userToFollow = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        $currentUser = Auth::user();

        if ($currentUser->id === $userToFollow->id) {
            return response()->json([
                'message' => 'You cannot follow yourself',
            ], 422);
        }

        $follow = Follow::where('follower_id', $currentUser->id)
            ->where('following_id', $userToFollow->id)
            ->first();

        if ($follow) {
            // Unfollow
            $follow->delete();
            $message = 'Unfollowed successfully';
            $is_following = false;
        } else {
            // Follow
            Follow::create([
                'follower_id' => $currentUser->id,
                'following_id' => $userToFollow->id,
            ]);
            $message = 'Followed successfully';
            $is_following = true;
        }

        return response()->json([
            'message' => $message,
            'is_following' => $is_following,
            'followers_count' => $userToFollow->fresh()->followers_count,
        ]);
    }

    /**
     * Get user's followers
     */
    public function followers($username, Request $request)
    {
        $user = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        $followers = $user->followers()
            ->paginate($request->get('per_page', 20));

        return response()->json($followers);
    }

    /**
     * Get user's following
     */
    public function following($username, Request $request)
    {
        $user = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        $following = $user->following()
            ->paginate($request->get('per_page', 20));

        return response()->json($following);
    }

    /**
     * Update daily streak
     */
    public function updateStreak()
    {
        $user = Auth::user();
        $user->updateDailyStreak();

        return response()->json([
            'message' => 'Streak updated',
            'daily_streak' => $user->daily_streak,
        ]);
    }
}
