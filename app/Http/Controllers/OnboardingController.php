<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    /**
     * Show the onboarding page
     */
    public function show()
    {
        $user = Auth::user();

        // Redirect if already completed
        if ($user->onboarding_completed) {
            return redirect()->route('feed');
        }

        // Get creators for follow step
        $creators = $this->getCreators();

        return Inertia::render('Onboarding/Index', [
            'user' => $user,
            'currentStep' => $this->getCurrentStep($user),
            'creators' => $creators,
        ]);
    }

    /**
     * Update onboarding step with rate limiting
     */
    public function updateStep(Request $request)
    {
        $user = Auth::user();
        $key = 'onboarding-update:' . $user->id;

        // Rate limiting: 10 requests per minute
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            
            throw ValidationException::withMessages([
                'error' => "Too many requests. Please try again in {$seconds} seconds.",
            ]);
        }

        RateLimiter::hit($key, 60);

        $validated = $request->validate([
            'step' => 'required|string|in:welcome,interests,profile,follow,complete',
            'data' => 'nullable|array',
        ]);

        $steps = $user->onboarding_steps ?? [];
        $steps[$validated['step']] = [
            'completed' => true,
            'data' => $validated['data'] ?? [],
            'completed_at' => now()->toIso8601String(),
        ];

        $user->onboarding_steps = $steps;
        $user->save();

        return response()->json([
            'success' => true,
            'currentStep' => $this->getCurrentStep($user),
            'message' => 'Step completed successfully',
        ]);
    }

    /**
     * Complete onboarding
     */
    public function complete(Request $request)
    {
        $user = Auth::user();
        $key = 'onboarding-complete:' . $user->id;

        // Rate limiting: 3 requests per minute
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            
            throw ValidationException::withMessages([
                'error' => "Too many requests. Please try again in {$seconds} seconds.",
            ]);
        }

        RateLimiter::hit($key, 60);

        $user->onboarding_completed = true;
        $user->onboarding_completed_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Onboarding completed! Welcome to QuotesHub!',
            'redirect' => route('feed'),
        ]);
    }

    /**
     * Skip onboarding
     */
    public function skip()
    {
        $user = Auth::user();
        $key = 'onboarding-skip:' . $user->id;

        // Rate limiting: 2 requests per minute
        if (RateLimiter::tooManyAttempts($key, 2)) {
            $seconds = RateLimiter::availableIn($key);
            
            throw ValidationException::withMessages([
                'error' => "Too many requests. Please try again in {$seconds} seconds.",
            ]);
        }

        RateLimiter::hit($key, 60);

        $user->onboarding_completed = true;
        $user->onboarding_completed_at = now();
        $user->save();

        return redirect()->route('feed');
    }

    /**
     * Get current onboarding step
     */
    private function getCurrentStep($user)
    {
        $steps = $user->onboarding_steps ?? [];
        
        $stepOrder = ['welcome', 'interests', 'profile', 'follow', 'complete'];
        
        foreach ($stepOrder as $step) {
            if (!isset($steps[$step]) || !$steps[$step]['completed']) {
                return $step;
            }
        }
        
        return 'complete';
    }

    /**
     * Get creators for onboarding follow step
     */
    private function getCreators()
    {
        return \App\Models\User::whereIn('username', ['ananiket', 'quoteshub'])
            ->select(['id', 'name', 'username', 'bio', 'avatar', 'followers_count'])
            ->get()
            ->map(function ($creator) {
                $creator->is_following = auth()->user()?->isFollowing($creator);
                return $creator;
            });
    }
}
