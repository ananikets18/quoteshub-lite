<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Set password validation rules
        \Illuminate\Validation\Rules\Password::defaults(function () {
            return \Illuminate\Validation\Rules\Password::min(8)
                ->letters()      // Must contain at least one letter
                ->numbers()      // Must contain at least one number
                ->mixedCase()    // Must contain both uppercase and lowercase
                ->max(255);
        });

        // Register observers for achievement tracking
        \App\Models\Quote::observe(\App\Observers\QuoteObserver::class);
        \App\Models\Like::observe(\App\Observers\LikeObserver::class);
        \App\Models\Follow::observe(\App\Observers\FollowObserver::class);
        \App\Models\Save::observe(\App\Observers\SaveObserver::class);
    }
}
