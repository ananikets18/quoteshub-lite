<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip if user is not authenticated
        if (!$request->user()) {
            return $next($request);
        }

        // Skip if already on onboarding routes
        if ($request->routeIs('onboarding.*')) {
            return $next($request);
        }

        // Skip for email verification routes
        if ($request->routeIs('verification.*')) {
            return $next($request);
        }

        // Skip for API routes
        if ($request->is('api/*')) {
            return $next($request);
        }

        // Skip for logout route
        if ($request->routeIs('logout')) {
            return $next($request);
        }

        // Redirect to onboarding if not completed
        if (!$request->user()->onboarding_completed) {
            return redirect()->route('onboarding.show');
        }

        return $next($request);
    }
}
