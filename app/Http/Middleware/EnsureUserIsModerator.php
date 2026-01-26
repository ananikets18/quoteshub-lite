<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsModerator
{
    /**
     * Handle an incoming request.
     *
     * Ensures only moderators and admins can access moderation routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        if (!$request->user()->isModerator()) {
            abort(403, 'Unauthorized. Moderator access required.');
        }

        return $next($request);
    }
}
