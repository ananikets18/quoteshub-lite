<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Foundation\Auth\EmailVerificationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // Check if already verified
        if ($request->user()->hasVerifiedEmail()) {
            Log::info('User attempted to verify already verified email', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
            ]);
            
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1')
                ->with('info', 'Your email was already verified.');
        }

        // Mark email as verified
        if ($request->user()->markEmailAsVerified()) {
            Log::info('User email verified successfully', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'verified_at' => now(),
            ]);
            
            event(new Verified($request->user()));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1')
            ->with('success', 'Your email has been verified successfully!');
    }
}
