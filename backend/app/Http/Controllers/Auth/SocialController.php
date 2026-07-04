<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Exception;

class SocialController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();

            if ($user) {
                // If user exists but doesn't have google_id, update it
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'email_verified_at' => $user->email_verified_at ?? now(), // Verify email if not already verified
                    ]);
                } elseif (!$user->email_verified_at) {
                    // If user logs in via Google, mark their email as verified
                    $user->update([
                        'email_verified_at' => now(),
                    ]);
                }
                
                Auth::login($user);
            } else {
                // Create new user
                $newUser = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'username' => Str::slug($googleUser->name) . rand(100, 999),
                    'password' => null, // Password is not required for social login
                    'email_verified_at' => now(),
                ]);

                Auth::login($newUser);
            }

            return redirect()->intended(route('feed', absolute: false));

        } catch (Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            return redirect(route('login'))->with('error', 'Something went wrong with Google Login. Please try again.');
        }
    }
}
