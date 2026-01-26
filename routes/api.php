<?php

use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\AdminController;
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
    Route::post('/me/streak', [UserController::class, 'updateStreak']);
    
    // Avatar & Cover Image Upload
    Route::post('/me/avatar', [App\Http\Controllers\Api\AvatarController::class, 'upload']);
    Route::delete('/me/avatar', [App\Http\Controllers\Api\AvatarController::class, 'deleteAvatar']);
    Route::post('/me/cover', [App\Http\Controllers\Api\AvatarController::class, 'uploadCover']);
    Route::delete('/me/cover', [App\Http\Controllers\Api\AvatarController::class, 'deleteCover']);

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
        Route::post('/quotes/{id}/toggle-featured', [AdminController::class, 'toggleFeatured']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::post('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/stats', [AdminController::class, 'stats']);
    });
});
