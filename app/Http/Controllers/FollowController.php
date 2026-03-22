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
            \App\Jobs\SendQuoteNotification::dispatch('follower', $currentUser->id, $userToFollow->id);
            \App\Jobs\CheckUserAchievements::dispatch($userToFollow->id, 'follower_gained', $userToFollow->followers_count);
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
        $followingCount = count($followingIds);
        
        if (empty($followingIds)) {
            $quotes = collect();
            return view('follow.feed', compact('quotes', 'followingCount'));
        }

        $query = \App\Models\Quote::whereIn('user_id', $followingIds)
            ->approved()
            ->with(['user', 'categories', 'tags']);

        // Exclude dismissed quotes
        $dismissed = \App\Http\Controllers\Api\FeedPreferenceController::getDismissedIds($request);
        if (!empty($dismissed)) {
            $query->whereNotIn('id', $dismissed);
        }

        $quotes = $query->latest()->paginate(15);

        // Add user interaction flags
        $quotes->getCollection()->transform(function ($quote) {
            $quote->is_liked = $quote->isLikedBy(auth()->user());
            $quote->is_saved = $quote->isSavedBy(auth()->user());
            $quote->collection_ids = $quote->collections()
                ->where('user_id', auth()->id())
                ->pluck('collections.id')
                ->toArray();
            return $quote;
        });

        // AJAX infinite scroll: return rendered HTML partial for page > 1
        if ($request->ajax() && $quotes->currentPage() > 1) {
            $html = '';
            foreach ($quotes->getCollection() as $quote) {
                $html .= view('components.quote-card', ['quote' => $quote])->render();
            }
            return response()->json([
                'html'     => $html,
                'hasMore'  => $quotes->hasMorePages(),
                'nextPage' => $quotes->currentPage() + 1,
            ]);
        }

        return view('follow.feed', compact('quotes', 'followingCount'));
    }

    /**
     * Clear dashboard cache for a user from default store.
     */
    private function clearDashboardCache(int $userId): void
    {
        $cacheKey = 'dashboard_stats_' . $userId;
        
        // Clear from default cache
        \Illuminate\Support\Facades\Cache::forget($cacheKey);
    }
}
