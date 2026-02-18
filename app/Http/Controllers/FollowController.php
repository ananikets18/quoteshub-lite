<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class FollowController extends Controller
{
    /**
     * Follow a user.
     */
    public function follow(Request $request, string $username): RedirectResponse
    {
        $userToFollow = User::where('username', $username)->firstOrFail();
        $currentUser = $request->user();

        if ($currentUser->id === $userToFollow->id) {
            return back()->with('error', 'You cannot follow yourself.');
        }

        if (!$currentUser->following()->where('following_id', $userToFollow->id)->exists()) {
            // Use Follow model to ensure observers are triggered
            Follow::create([
                'follower_id' => $currentUser->id,
                'following_id' => $userToFollow->id,
            ]);
            
            // Refresh user models to get updated counts
            $currentUser->refresh();
            $userToFollow->refresh();
            
            // Clear dashboard cache for both users to reflect updated counts
            $this->clearDashboardCache($currentUser->id);
            $this->clearDashboardCache($userToFollow->id);
            
            // Trigger notification
            app(NotificationService::class)->notifyNewFollower($currentUser, $userToFollow);
        }

        // If on dashboard, force a visit to refresh stats
        if ($request->header('referer') && str_contains($request->header('referer'), '/dashboard')) {
            return redirect()->route('dashboard');
        }

        return back();
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(Request $request, string $username): RedirectResponse
    {
        $userToUnfollow = User::where('username', $username)->firstOrFail();
        $currentUser = $request->user();

        if ($currentUser->following()->where('following_id', $userToUnfollow->id)->exists()) {
            // Use Follow model to ensure observers are triggered
            Follow::where('follower_id', $currentUser->id)
                ->where('following_id', $userToUnfollow->id)
                ->delete();
            
            // Refresh user models to get updated counts
            $currentUser->refresh();
            $userToUnfollow->refresh();
            
            // Clear dashboard cache for both users to reflect updated counts
            $this->clearDashboardCache($currentUser->id);
            $this->clearDashboardCache($userToUnfollow->id);
            
            // Remove the follower notification
            app(NotificationService::class)->removeFollowerNotification($currentUser, $userToUnfollow);
        }

        // If on dashboard, force a visit to refresh stats
        if ($request->header('referer') && str_contains($request->header('referer'), '/dashboard')) {
            return redirect()->route('dashboard');
        }

        return back();
    }

    /**
     * Show followers list for a user.
     */
    public function followers(Request $request, string $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        
        $followers = $user->followers()
            ->select(['users.id', 'users.name', 'users.username', 'users.avatar', 'users.bio'])
            ->paginate(20);

        // Check which users the current user is following
        $followingIds = $request->user() 
            ? $request->user()->following()->pluck('following_id')->toArray()
            : [];

        $followers->getCollection()->transform(function ($follower) use ($followingIds, $request) {
            $follower->is_following = in_array($follower->id, $followingIds);
            $follower->is_self = $request->user()?->id === $follower->id;
            return $follower;
        });

        return view('follow.followers', compact('user', 'followers'));
    }

    /**
     * Show following list for a user.
     */
    public function following(Request $request, string $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        
        $following = $user->following()
            ->select(['users.id', 'users.name', 'users.username', 'users.avatar', 'users.bio'])
            ->paginate(20);

        // Check which users the current user is following
        $followingIds = $request->user() 
            ? $request->user()->following()->pluck('following_id')->toArray()
            : [];

        $following->getCollection()->transform(function ($followedUser) use ($followingIds, $request) {
            $followedUser->is_following = in_array($followedUser->id, $followingIds);
            $followedUser->is_self = $request->user()?->id === $followedUser->id;
            return $followedUser;
        });

        return view('follow.following', compact('user', 'following'));
    }

    /**
     * Show feed of quotes from followed users.
     */
    public function feed(Request $request)
    {
        $user = $request->user();
        
        $followingIds = $user->following()->pluck('following_id')->toArray();
        
        if (empty($followingIds)) {
            $quotes = [
                    'data' => [],
                    'links' => [],
                    'total' => 0,
            ];
            $followingCount = 0;
            return view('follow.feed', compact('quotes', 'followingCount'));
        }

        $quotes = \App\Models\Quote::whereIn('user_id', $followingIds)
            ->approved()  // Only show approved quotes
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves'])
            ->latest()
            ->paginate(12);

        // Add user interaction flags
        $quotes->getCollection()->transform(function ($quote) {
            $quote->is_liked = $quote->isLikedBy(auth()->user());
            $quote->is_saved = $quote->isSavedBy(auth()->user());
            // Add collection IDs this quote is in
            $quote->collection_ids = $quote->collections()
                ->where('user_id', auth()->id())
                ->pluck('collections.id')
                ->toArray();
            return $quote;
        });
        
        // Get user's collections
        $collections = auth()->user()->collections()
            ->select('id', 'name', 'slug')
            ->orderBy('name')
            ->get();

        $followingCount = count($followingIds);
        return view('follow.feed', compact('quotes', 'followingCount', 'collections'));
    }

    /**
     * Clear dashboard cache for a user from both default and Redis stores.
     */
    private function clearDashboardCache(int $userId): void
    {
        $cacheKey = 'dashboard_stats_' . $userId;
        
        // Clear from default cache
        \Illuminate\Support\Facades\Cache::forget($cacheKey);
        
        // Try to clear from Redis cache if available
        try {
            \Illuminate\Support\Facades\Cache::store('redis')->forget($cacheKey);
        } catch (\Throwable $e) {
            // Redis not available, skip
        }
    }
}
