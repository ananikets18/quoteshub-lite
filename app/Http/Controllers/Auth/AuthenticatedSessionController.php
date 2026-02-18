<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        $canResetPassword = Route::has('password.request');
        $status = session('status');
        
        return view('auth.login', compact('canResetPassword', 'status'));
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // Prevent session fixation
        $request->session()->regenerate();

        // ✅ PROD-SAFE redirect (no absolute:false)
        return redirect()->intended('/feed');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        // Invalidate session
        $request->session()->invalidate();

        // Regenerate CSRF token
        $request->session()->regenerateToken();

        // ✅ Explicit login redirect (prevents redirect loops)
        return redirect('/login')->with('success', 'You have been logged out.');
    }
}
