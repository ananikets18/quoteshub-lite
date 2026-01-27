<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\QuoteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FeedController::class, 'index'])->name('home');
Route::get('/feed', [FeedController::class, 'index'])->name('feed');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
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
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Wildcard routes must come AFTER specific routes
Route::get('/quotes/{quote}', [QuoteController::class, 'show'])->name('quotes.show');

require __DIR__.'/auth.php';
