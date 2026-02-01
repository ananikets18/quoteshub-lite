<?php

use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\UserPreferenceController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ModerationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/quotes', [QuoteController::class, 'index']);
Route::get('/quotes/{id}', [QuoteController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/users/{username}', [UserController::class, 'show']);
Route::get('/users/{username}/quotes', [UserController::class, 'quotes']);
Route::get('/users/{username}/followers', [UserController::class, 'followers']);
Route::get('/users/{username}/following', [UserController::class, 'following']);
Route::get('/users/{username}/similar', [UserController::class, 'similar']);
Route::get('/users/discover/suggested', [UserController::class, 'suggested']);

// Recommendation routes (public but enhanced with auth)
Route::get('/quotes/{quote}/similar', [RecommendationController::class, 'similar']);
Route::get('/categories/{category}/quotes', [RecommendationController::class, 'byCategory']);
Route::post('/quotes/{quote}/view', [RecommendationController::class, 'trackView']);

// Search routes
Route::get('/search/quotes', [SearchController::class, 'quotes']);
Route::get('/search/users', [SearchController::class, 'users']);
Route::get('/search/tags', [SearchController::class, 'tags']);
Route::get('/search', [SearchController::class, 'global']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/me', [UserController::class, 'me']);
    Route::put('/me', [UserController::class, 'update']);
    Route::put('/me/password', [UserController::class, 'updatePassword']);
    Route::get('/me/liked', [UserController::class, 'likedQuotes']);
    Route::get('/me/saved', [UserController::class, 'savedQuotes']);
    Route::get('/me/collections', [UserController::class, 'collections']);
    
    // Streak update with rate limiting (once per day per user)
    Route::post('/me/streak', [UserController::class, 'updateStreak'])
        ->middleware('throttle:5,1440'); // 5 attempts per 24 hours
    
    // Avatar & Cover Image Upload
    Route::post('/me/avatar', [App\Http\Controllers\Api\AvatarController::class, 'upload']);
    Route::delete('/me/avatar', [App\Http\Controllers\Api\AvatarController::class, 'deleteAvatar']);
    Route::post('/me/cover', [App\Http\Controllers\Api\AvatarController::class, 'uploadCover']);
    Route::delete('/me/cover', [App\Http\Controllers\Api\AvatarController::class, 'deleteCover']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/read/all', [NotificationController::class, 'deleteAllRead']);

    // Personalized recommendations (requires auth)
    Route::get('/recommendations/for-you', [RecommendationController::class, 'forYou']);
    Route::get('/recommendations/authors', [RecommendationController::class, 'authors']);
    Route::get('/recommendations/collaborative', [RecommendationController::class, 'collaborative']);

    // User preferences and "not interested" features
    Route::post('/preferences/not-interested', [UserPreferenceController::class, 'markNotInterested']);
    Route::post('/preferences/undo-not-interested', [UserPreferenceController::class, 'undoNotInterested']);
    Route::get('/preferences', [UserPreferenceController::class, 'getPreferences']);
    Route::post('/preferences/recalculate', [UserPreferenceController::class, 'recalculatePreferences']);

    // Moderation and trust score
    Route::get('/moderation/info', [ModerationController::class, 'getUserModerationInfo']);
    Route::post('/moderation/validate', [ModerationController::class, 'validateContent']);

    // Quote management
    Route::post('/quotes', [QuoteController::class, 'store']);
    Route::put('/quotes/{id}', [QuoteController::class, 'update']);
    Route::delete('/quotes/{id}', [QuoteController::class, 'destroy']);
    
    // Quote interactions
    Route::post('/quotes/{id}/like', [QuoteController::class, 'like']);
    Route::post('/quotes/{id}/save', [QuoteController::class, 'save']);
    Route::post('/quotes/{id}/share', [QuoteController::class, 'share']);

    // Follow system
    Route::post('/users/{username}/follow', [UserController::class, 'follow']);

    // Admin routes (require admin role)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/quotes/pending', [AdminController::class, 'pendingQuotes']);
        Route::post('/quotes/{id}/approve', [AdminController::class, 'approveQuote']);
        Route::post('/quotes/{id}/reject', [AdminController::class, 'rejectQuote']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::post('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/stats', [AdminController::class, 'stats']);
    });
});
