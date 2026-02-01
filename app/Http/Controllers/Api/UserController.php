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
     * 
     * Security features:
     * - Verifies current password
     * - Validates new password strength
     * - Regenerates session to prevent fixation
     * - Logs out other devices (optional)
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ], [
            'current_password.current_password' => 'The current password is incorrect.',
            'password.confirmed' => 'The password confirmation does not match.',
        ]);

        $user = Auth::user();

        // Update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Regenerate session for security
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Password updated successfully. Please login again on other devices.',
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

    /**
     * Get suggested users to follow (similar authors)
     */
    public function suggested(Request $request)
    {
        if (!Auth::check()) {
            // For guests, return trending authors
            $users = User::has('quotes')
                ->where('is_active', true)
                ->orderByDesc('quotes_count')
                ->orderByDesc('followers_count')
                ->limit(10)
                ->get();

            return response()->json($users);
        }

        $user = Auth::user();
        
        // Get users the current user is already following
        $followingIds = $user->following()->pluck('following_id')->toArray();
        $followingIds[] = $user->id; // Exclude self

        // Find active authors not already followed
        $suggestedUsers = User::has('quotes')
            ->where('is_active', true)
            ->whereNotIn('id', $followingIds)
            ->withCount(['quotes' => function ($q) {
                $q->approved();
            }])
            ->orderByDesc('quotes_count')
            ->orderByDesc('followers_count')
            ->limit($request->get('limit', 10))
            ->get();

        return response()->json($suggestedUsers);
    }

    /**
     * Get similar authors based on a specific user
     */
    public function similar($username, Request $request)
    {
        $targetUser = User::where('username', $username)
            ->orWhere('id', $username)
            ->firstOrFail();

        // Get categories this author writes about
        $authorCategories = $targetUser->quotes()
            ->approved()
            ->with('categories')
            ->get()
            ->pluck('categories')
            ->flatten()
            ->pluck('id')
            ->unique()
            ->toArray();

        if (empty($authorCategories)) {
            return response()->json([]);
        }

        // Find other authors who write in similar categories
        $excludeIds = [$targetUser->id];
        if (Auth::check()) {
            $excludeIds[] = Auth::id();
        }

        $similarAuthors = User::whereHas('quotes', function ($q) use ($authorCategories) {
                $q->approved()
                  ->whereHas('categories', function ($catQuery) use ($authorCategories) {
                      $catQuery->whereIn('categories.id', $authorCategories);
                  });
            })
            ->whereNotIn('id', $excludeIds)
            ->withCount(['quotes' => function ($q) {
                $q->approved();
            }])
            ->orderByDesc('quotes_count')
            ->limit($request->get('limit', 10))
            ->get();

        return response()->json($similarAuthors);
    }
}
