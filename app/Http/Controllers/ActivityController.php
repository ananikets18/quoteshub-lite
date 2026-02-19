<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Quote;
use App\Models\Like;
use App\Models\Save;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    /**
     * Get activity feed for the authenticated user
     */
    public function feed(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['activities' => []]);
        }

        // Get users that the current user follows
        $followingIds = $user->following()->pluck('following_id');

        // Collect activities from followed users
        $activities = collect();

        // Recent likes from followed users (last 24 hours)
        $recentLikes = Like::whereIn('user_id', $followingIds)
            ->where('created_at', '>=', now()->subDay())
            ->with(['user', 'quote'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($like) {
                return [
                    'type' => 'like',
                    'user' => [
                        'id' => $like->user->id,
                        'name' => $like->user->name,
                        'username' => $like->user->username,
                        'avatar' => $like->user->avatar,
                    ],
                    'quote' => [
                        'id' => $like->quote->id,
                        'content' => $like->quote->content,
                        'author' => $like->quote->author,
                    ],
                    'created_at' => $like->created_at,
                    'timestamp' => $like->created_at->diffForHumans(),
                ];
            });

        // Recent saves from followed users
        $recentSaves = Save::whereIn('user_id', $followingIds)
            ->where('created_at', '>=', now()->subDay())
            ->with(['user', 'quote'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($save) {
                return [
                    'type' => 'save',
                    'user' => [
                        'id' => $save->user->id,
                        'name' => $save->user->name,
                        'username' => $save->user->username,
                        'avatar' => $save->user->avatar,
                    ],
                    'quote' => [
                        'id' => $save->quote->id,
                        'content' => $save->quote->content,
                        'author' => $save->quote->author,
                    ],
                    'created_at' => $save->created_at,
                    'timestamp' => $save->created_at->diffForHumans(),
                ];
            });

        // Recent follows (people following you)
        $recentFollows = Follow::where('following_id', $user->id)
            ->where('created_at', '>=', now()->subDay())
            ->with('follower')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($follow) {
                return [
                    'type' => 'follow',
                    'user' => [
                        'id' => $follow->follower->id,
                        'name' => $follow->follower->name,
                        'username' => $follow->follower->username,
                        'avatar' => $follow->follower->avatar,
                    ],
                    'created_at' => $follow->created_at,
                    'timestamp' => $follow->created_at->diffForHumans(),
                ];
            });

        // Recent quotes from followed users
        $recentQuotes = Quote::whereIn('user_id', $followingIds)
            ->where('created_at', '>=', now()->subDay())
            ->where('status', 'approved')
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($quote) {
                return [
                    'type' => 'quote',
                    'user' => [
                        'id' => $quote->user->id,
                        'name' => $quote->user->name,
                        'username' => $quote->user->username,
                        'avatar' => $quote->user->avatar,
                    ],
                    'quote' => [
                        'id' => $quote->id,
                        'content' => $quote->content,
                        'author' => $quote->author,
                    ],
                    'created_at' => $quote->created_at,
                    'timestamp' => $quote->created_at->diffForHumans(),
                ];
            });

        // Merge and sort all activities
        $activities = $recentLikes
            ->concat($recentSaves)
            ->concat($recentFollows)
            ->concat($recentQuotes)
            ->sortByDesc('created_at')
            ->take(15)
            ->values();

        return response()->json(['activities' => $activities]);
    }

    /**
     * Get trending quotes
     */
    public function trending()
    {
        // Get quotes with most engagement in the last 24 hours
        $trending = Quote::select('quotes.*')
            ->selectRaw('(
                SELECT COUNT(*) 
                FROM likes 
                WHERE likes.quote_id = quotes.id 
                AND likes.created_at >= ?
            ) as recent_likes_count', [now()->subDay()])
            ->where('quotes.status', 'approved')
            ->where('quotes.created_at', '>=', now()->subWeek())
            ->orderByRaw('recent_likes_count DESC')
            ->orderBy('quotes.views_count', 'DESC')
            ->with(['user:id,username,name,avatar', 'categories:id,name,slug'])
            ->limit(5)
            ->get()
            ->map(function ($quote) {
                return [
                    'id' => $quote->id,
                    'content' => $quote->content,
                    'author' => $quote->author,
                    'user' => $quote->user,
                    'categories' => $quote->categories,
                    'likes_today' => $quote->recent_likes_count,
                    'total_likes' => $quote->likes_count,
                    'views' => $quote->views_count,
                    'trending_score' => ($quote->recent_likes_count * 3) + ($quote->views_count * 0.1),
                ];
            });

        return response()->json(['trending' => $trending]);
    }

    /**
     * Get suggested users to follow
     */
    public function suggestedUsers(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            // For non-authenticated users, show popular users
            $suggested = User::select('users.*')
                ->selectRaw('(SELECT COUNT(*) FROM quotes WHERE quotes.user_id = users.id AND quotes.deleted_at IS NULL AND quotes.status = ?) as total_quotes', ['approved'])
                ->selectRaw('(SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) as total_followers')
                ->where('users.is_active', true)
                ->orderByRaw('total_followers DESC')
                ->orderByRaw('total_quotes DESC')
                ->limit(5)
                ->get();
        } else {
            // Get users the current user is already following
            $followingIds = $user->following()->pluck('following_id')->toArray();
            $followingIds[] = $user->id; // Exclude self

            // Get users followed by people you follow (collaborative filtering)
            $suggestedFromNetwork = Follow::whereIn('follower_id', $user->following()->pluck('following_id'))
                ->whereNotIn('following_id', $followingIds)
                ->select('following_id', DB::raw('COUNT(*) as mutual_count'))
                ->groupBy('following_id')
                ->orderByDesc('mutual_count')
                ->limit(3)
                ->pluck('following_id');

            // Get popular users in categories you like
            $likedCategories = $user->likes()
                ->with('quote.categories')
                ->get()
                ->pluck('quote.categories')
                ->flatten()
                ->pluck('id')
                ->unique();

            $suggestedFromCategories = Quote::whereHas('categories', function ($query) use ($likedCategories) {
                    $query->whereIn('categories.id', $likedCategories);
                })
                ->whereNotIn('user_id', $followingIds)
                ->where('status', 'approved')
                ->select('user_id', DB::raw('COUNT(*) as quote_count'))
                ->groupBy('user_id')
                ->orderByDesc('quote_count')
                ->limit(2)
                ->pluck('user_id');

            // Combine suggestions
            $suggestedIds = $suggestedFromNetwork->concat($suggestedFromCategories)->unique()->take(5);

            // If no suggestions from network/categories, fallback to popular users
            if ($suggestedIds->isEmpty()) {
                $suggested = User::select('users.*')
                    ->selectRaw('(SELECT COUNT(*) FROM quotes WHERE quotes.user_id = users.id AND quotes.deleted_at IS NULL AND quotes.status = ?) as total_quotes', ['approved'])
                    ->selectRaw('(SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) as total_followers')
                    ->whereNotIn('users.id', $followingIds)
                    ->where('users.is_active', true)
                    ->orderByRaw('total_followers DESC')
                    ->orderByRaw('total_quotes DESC')
                    ->limit(5)
                    ->get();
            } else {
                $suggested = User::select('users.*')
                    ->selectRaw('(SELECT COUNT(*) FROM quotes WHERE quotes.user_id = users.id AND quotes.deleted_at IS NULL AND quotes.status = ?) as total_quotes', ['approved'])
                    ->selectRaw('(SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) as total_followers')
                    ->whereIn('users.id', $suggestedIds)
                    ->where('users.is_active', true)
                    ->get();
            }
        }

        $suggested = $suggested->map(function ($suggestedUser) {
            return [
                'id' => $suggestedUser->id,
                'name' => $suggestedUser->name,
                'username' => $suggestedUser->username,
                'avatar' => $suggestedUser->avatar,
                'bio' => $suggestedUser->bio,
                'followers_count' => $suggestedUser->total_followers ?? 0,
                'quotes_count' => $suggestedUser->total_quotes ?? 0,
            ];
        });

        return response()->json(['suggested' => $suggested]);
    }
}
