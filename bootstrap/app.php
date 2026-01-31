<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\PreventBackHistory::class,
            \App\Http\Middleware\EnsureUserIsActive::class,
            \App\Http\Middleware\EnsureOnboardingCompleted::class,
        ]);

        // Enable session-based authentication for API routes
        // This allows API calls from the Inertia frontend to authenticate using sessions
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'moderator' => \App\Http\Middleware\EnsureUserIsModerator::class,
            'active' => \App\Http\Middleware\EnsureUserIsActive::class,
            'prevent.back' => \App\Http\Middleware\PreventBackHistory::class,
            'onboarding' => \App\Http\Middleware\EnsureOnboardingCompleted::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
