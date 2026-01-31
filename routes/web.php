<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OgImageController;
use App\Http\Controllers\ActivityController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TopicController;

// Open Graph image generation (public route)
Route::get('/api/og-image/{quote}', [OgImageController::class, 'generate'])->name('og-image.generate');

// Activity feed API routes (public for trending, auth for personalized)
Route::get('/api/activity/feed', [ActivityController::class, 'feed'])->name('activity.feed');
Route::get('/api/activity/trending', [ActivityController::class, 'trending'])->name('activity.trending');
Route::get('/api/activity/suggested-users', [ActivityController::class, 'suggestedUsers'])->name('activity.suggested');

// Notification API routes (session-based auth for Inertia)
Route::middleware('auth')->group(function () {
    Route::get('/api/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index'])->name('api.notifications.index');
    Route::get('/api/notifications/unread-count', [App\Http\Controllers\Api\NotificationController::class, 'unreadCount'])->name('api.notifications.unread-count');
    Route::post('/api/notifications/mark-all-read', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    Route::post('/api/notifications/{notification}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead'])->name('api.notifications.mark-as-read');
    Route::delete('/api/notifications/{notification}', [App\Http\Controllers\Api\NotificationController::class, 'destroy'])->name('api.notifications.destroy');
});

Route::get('/', [FeedController::class, 'index'])->name('home');
Route::get('/feed', [FeedController::class, 'index'])->name('feed');

// Topics / Explore
Route::get('/topics', [TopicController::class, 'index'])->name('topics.index');

// Search routes
Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/category/{slug}', [SearchController::class, 'category'])->name('category.show');
Route::get('/tag/{name}', [SearchController::class, 'tag'])->name('tag.show');

// Static Pages
Route::inertia('/about', 'Static/About')->name('about');
Route::inertia('/privacy', 'Static/Privacy')->name('privacy');
Route::inertia('/terms', 'Static/Terms')->name('terms');
Route::inertia('/guidelines', 'Static/Guidelines')->name('guidelines');
Route::inertia('/contact', 'Static/Contact')->name('contact');
Route::inertia('/cookies', 'Static/Cookies')->name('cookies');

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    // Get user stats
    $stats = [
        'quotes_count' => $user->quotes_count ?? 0,
        'followers_count' => $user->followers_count ?? 0,
        'following_count' => $user->following_count ?? 0,
        'daily_streak' => $user->daily_streak ?? 0,
        'total_likes' => $user->quotes()->withCount('likes')->get()->sum('likes_count'),
        'total_saves' => $user->quotes()->withCount('saves')->get()->sum('saves_count'),
        'total_views' => $user->quotes()->sum('views_count'),
        
        // Recent activity
        'recent_quotes' => $user->quotes()
            ->latest()
            ->take(3)
            ->withCount(['likes', 'saves'])
            ->get()
            ->map(function ($quote) {
                return [
                    'id' => $quote->id,
                    'content' => $quote->content,
                    'likes_count' => $quote->likes_count ?? 0,
                    'saves_count' => $quote->saves_count ?? 0,
                    'views_count' => $quote->views_count ?? 0,
                    'time_ago' => $quote->created_at->diffForHumans(),
                ];
            }),
        
        // Top performing quote
        'top_quote' => $user->quotes()
            ->withCount(['likes', 'saves'])
            ->orderByDesc('likes_count')
            ->first()
            ?->only(['id', 'content', 'likes_count', 'saves_count']),
        
        // Collections
        'collections_count' => $user->collections()->count(),
        'public_collections' => $user->collections()
            ->where('is_public', true)
            ->withCount('quotes')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($collection) {
                return [
                    'id' => $collection->id,
                    'name' => $collection->name,
                    'description' => $collection->description,
                    'quotes_count' => $collection->quotes_count ?? 0,
                ];
            }),
        
        // Recent activity from following
        'following_activity' => $user->following()
            ->with(['quotes' => function ($query) {
                $query->latest()->take(1)->withCount('likes');
            }])
            ->take(5)
            ->get()
            ->filter(fn($followed) => $followed->quotes->isNotEmpty())
            ->map(function ($followed) {
                $quote = $followed->quotes->first();
                return [
                    'user' => [
                        'id' => $followed->id,
                        'name' => $followed->name,
                        'username' => $followed->username,
                        'avatar' => $followed->avatar,
                    ],
                    'quote' => [
                        'id' => $quote->id,
                        'content' => $quote->content,
                        'likes_count' => $quote->likes_count ?? 0,
                        'time_ago' => $quote->created_at->diffForHumans(),
                    ],
                ];
            })->values(),
        
        // This week stats (compare to last week)
        'this_week' => [
            'quotes' => $user->quotes()->where('created_at', '>=', now()->startOfWeek())->count(),
            'likes' => $user->quotes()
                ->whereHas('likes', fn($q) => $q->where('created_at', '>=', now()->startOfWeek()))
                ->count(),
            'followers' => $user->followers()->wherePivot('created_at', '>=', now()->startOfWeek())->count(),
        ],
    ];
    
    return Inertia::render('Dashboard', [
        'stats' => $stats,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Notifications
    Route::get('/notifications', function () {
        return Inertia::render('Notifications');
    })->name('notifications');
    
    // Achievements
    Route::get('/achievements', [App\Http\Controllers\AchievementController::class, 'index'])->name('achievements');

    
    Route::get('/quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::get('/quotes/{quote}/edit', [QuoteController::class, 'edit'])->name('quotes.edit');
    Route::put('/quotes/{quote}', [QuoteController::class, 'update'])->name('quotes.update');
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy'])->name('quotes.destroy');
    
    // Quote interactions (web routes instead of API)
    Route::post('/quotes/{quote}/like', [QuoteController::class, 'like'])->name('quotes.like')->middleware('throttle:60,1');
    Route::post('/quotes/{quote}/save', [QuoteController::class, 'save'])->name('quotes.save')->middleware('throttle:30,1');
    Route::post('/quotes/{quote}/share', [QuoteController::class, 'share'])->name('quotes.share')->middleware('throttle:20,1');
    Route::post('/quotes/{quote}/report', [QuoteController::class, 'report'])->name('quotes.report')->middleware('throttle:5,1');
    
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update')->middleware('throttle:10,1');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy')->middleware('throttle:3,1');
    
    // Settings
    Route::get('/settings', function () {
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
        
        return Inertia::render('Settings', [
            'preferences' => $preferences,
            'privacy' => [
                'profile_is_private' => $user->profile_is_private ?? false,
                'show_email' => $user->show_email ?? false,
                'show_activity_status' => $user->show_activity_status ?? true,
            ],
        ]);
    })->name('settings');
    
    // Saved quotes (private - requires auth)
    Route::get('/saved', [ProfileController::class, 'saved'])->name('saved');
    
    // Notification preferences
    Route::get('/profile/notification-preferences', [App\Http\Controllers\NotificationPreferenceController::class, 'edit'])->name('profile.notification-preferences.edit');
    Route::post('/profile/notification-preferences', [App\Http\Controllers\NotificationPreferenceController::class, 'update'])->name('profile.notification-preferences.update')->middleware('throttle:10,1');

    // Privacy settings
    Route::post('/settings/privacy', [App\Http\Controllers\SettingsController::class, 'updatePrivacy'])->name('settings.privacy.update')->middleware('throttle:10,1');
    
    // Blocked users
    Route::get('/settings/blocked-users', [App\Http\Controllers\SettingsController::class, 'blockedUsers'])->name('settings.blocked-users');
    Route::post('/users/{username}/block', [App\Http\Controllers\SettingsController::class, 'blockUser'])->name('users.block')->middleware('throttle:10,1');
    Route::delete('/users/{username}/block', [App\Http\Controllers\SettingsController::class, 'unblockUser'])->name('users.unblock')->middleware('throttle:10,1');
    
    // Account deletion
    Route::delete('/settings/account', [App\Http\Controllers\SettingsController::class, 'deleteAccount'])->name('settings.account.delete')->middleware('throttle:3,1');

    
    // Collections (private to user)
    Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
    Route::post('/collections', [CollectionController::class, 'store'])->name('collections.store')->middleware('throttle:20,1');
    Route::patch('/collections/{slug}', [CollectionController::class, 'update'])->name('collections.update')->middleware('throttle:20,1');
    Route::delete('/collections/{slug}', [CollectionController::class, 'destroy'])->name('collections.destroy')->middleware('throttle:10,1');
    Route::post('/collections/{slug}/quotes/{quote}', [CollectionController::class, 'addQuote'])->name('collections.addQuote');
    Route::delete('/collections/{slug}/quotes/{quote}', [CollectionController::class, 'removeQuote'])->name('collections.removeQuote');
    Route::post('/quotes/{quote}/move', [CollectionController::class, 'moveQuote'])->name('collections.moveQuote');
    
    // Follow system
    Route::post('/users/{username}/follow', [FollowController::class, 'follow'])->name('users.follow');
    Route::delete('/users/{username}/follow', [FollowController::class, 'unfollow'])->name('users.unfollow');
    Route::get('/following-feed', [FollowController::class, 'feed'])->name('following.feed');
    
    // Admin routes
    Route::prefix('admin')->middleware('auth')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::get('/reports', [AdminController::class, 'reports'])->name('admin.reports');
        Route::post('/reports/{report}/review', [AdminController::class, 'reviewReport'])->name('admin.reports.review');
        Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
        Route::patch('/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');
    });
});

// Public collection route
Route::get('/collections/{slug}', [CollectionController::class, 'show'])->name('collections.show');

// Wildcard routes must come AFTER specific routes
Route::get('/quotes/{quote}', [QuoteController::class, 'show'])->name('quotes.show');

// Onboarding routes (authenticated users only)
Route::middleware(['auth'])->prefix('onboarding')->group(function () {
    Route::get('/', [App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding.show');
    Route::post('/step', [App\Http\Controllers\OnboardingController::class, 'updateStep'])->name('onboarding.step');
    Route::post('/complete', [App\Http\Controllers\OnboardingController::class, 'complete'])->name('onboarding.complete');
    Route::post('/skip', [App\Http\Controllers\OnboardingController::class, 'skip'])->name('onboarding.skip');
});

require __DIR__.'/auth.php';

// Public profile routes - MUST BE LAST (wildcard catches everything)
Route::get('/{username}/followers', [FollowController::class, 'followers'])->name('profile.followers');
Route::get('/{username}/following', [FollowController::class, 'following'])->name('profile.following');
Route::get('/{username}/liked', [ProfileController::class, 'liked'])->name('profile.liked');
Route::get('/{username}', [ProfileController::class, 'show'])->name('profile.show');
