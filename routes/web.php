<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FeedController::class, 'index'])->name('home');
Route::get('/feed', [FeedController::class, 'index'])->name('feed');

// Search routes
Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/category/{slug}', [SearchController::class, 'category'])->name('category.show');
Route::get('/tag/{name}', [SearchController::class, 'tag'])->name('tag.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Notifications
    Route::get('/notifications', function () {
        return Inertia::render('Notifications');
    })->name('notifications');
    
    Route::get('/quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::get('/quotes/{quote}/edit', [QuoteController::class, 'edit'])->name('quotes.edit');
    Route::put('/quotes/{quote}', [QuoteController::class, 'update'])->name('quotes.update');
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy'])->name('quotes.destroy');
    
    // Quote interactions (web routes instead of API)
    Route::post('/quotes/{quote}/like', [QuoteController::class, 'like'])->name('quotes.like');
    Route::post('/quotes/{quote}/save', [QuoteController::class, 'save'])->name('quotes.save');
    Route::post('/quotes/{quote}/share', [QuoteController::class, 'share'])->name('quotes.share');
    Route::post('/quotes/{quote}/report', [QuoteController::class, 'report'])->name('quotes.report');
    
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Saved quotes (requires auth)
    Route::get('/profile/saved', [ProfileController::class, 'saved'])->name('profile.saved');
    
    // Collections
    Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
    Route::post('/collections', [CollectionController::class, 'store'])->name('collections.store');
    Route::patch('/collections/{slug}', [CollectionController::class, 'update'])->name('collections.update');
    Route::delete('/collections/{slug}', [CollectionController::class, 'destroy'])->name('collections.destroy');
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

// Public profile routes
Route::get('/u/{username}', [ProfileController::class, 'show'])->name('profile.show');
Route::get('/u/{username}/liked', [ProfileController::class, 'liked'])->name('profile.liked');
Route::get('/u/{username}/followers', [FollowController::class, 'followers'])->name('profile.followers');
Route::get('/u/{username}/following', [FollowController::class, 'following'])->name('profile.following');

// Public collection route
Route::get('/collections/{slug}', [CollectionController::class, 'show'])->name('collections.show');

// Wildcard routes must come AFTER specific routes
Route::get('/quotes/{quote}', [QuoteController::class, 'show'])->name('quotes.show');

require __DIR__.'/auth.php';
