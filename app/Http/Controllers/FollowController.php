<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

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
            $currentUser->following()->attach($userToFollow->id);
            $currentUser->increment('following_count');
            $userToFollow->increment('followers_count');
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
            $currentUser->following()->detach($userToUnfollow->id);
            $currentUser->decrement('following_count');
            $userToUnfollow->decrement('followers_count');
        }

        return back();
    }

    /**
     * Show followers list for a user.
     */
    public function followers(Request $request, string $username): Response
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

        return Inertia::render('Follow/Followers', [
            'user' => $user,
            'followers' => $followers,
        ]);
    }

    /**
     * Show following list for a user.
     */
    public function following(Request $request, string $username): Response
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

        return Inertia::render('Follow/Following', [
            'user' => $user,
            'following' => $following,
        ]);
    }

    /**
     * Show feed of quotes from followed users.
     */
    public function feed(Request $request): Response
    {
        $user = $request->user();
        
        $followingIds = $user->following()->pluck('following_id')->toArray();
        
        if (empty($followingIds)) {
            return Inertia::render('Follow/Feed', [
                'quotes' => [
                    'data' => [],
                    'links' => [],
                    'total' => 0,
                ],
                'followingCount' => 0,
            ]);
        }

        $quotes = \App\Models\Quote::whereIn('user_id', $followingIds)
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

        return Inertia::render('Follow/Feed', [
            'quotes' => $quotes,
            'followingCount' => count($followingIds),
            'collections' => $collections,
        ]);
    }
}
