<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Check if email is already verified
        if ($request->user()->hasVerifiedEmail()) {
            Log::info('User attempted to resend verification email with already verified email', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
            ]);
            
            return redirect()->intended(route('dashboard', absolute: false))
                ->with('info', 'Your email is already verified.');
        }

        // Custom rate limiting with more granular control
        $key = 'verification-email:' . $request->user()->id;
        
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);
            
            Log::warning('Rate limit exceeded for email verification', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'ip' => $request->ip(),
                'available_in' => $seconds,
            ]);
            
            throw ValidationException::withMessages([
                'email' => "Too many verification emails sent. Please try again in {$minutes} minute(s).",
            ]);
        }

        try {
            // Send the verification notification
            $request->user()->sendEmailVerificationNotification();
            
            // Increment rate limiter (3 attempts per hour)
            RateLimiter::hit($key, 3600);
            
            Log::info('Email verification notification sent', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
            ]);
            
            return back()->with('status', 'verification-link-sent');
            
        } catch (\Exception $e) {
            Log::error('Failed to send email verification notification', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'error' => $e->getMessage(),
            ]);
            
            return back()->with('error', 'Failed to send verification email. Please try again later.');
        }
    }
}
