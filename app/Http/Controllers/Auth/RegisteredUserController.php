<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|alpha_dash|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'email.unique' => 'This email address is already registered. Please login or use a different email.',
            'username.unique' => 'This username is already taken. Please choose a different one.',
            'username.alpha_dash' => 'Username can only contain letters, numbers, dashes and underscores.',
            'password.min' => 'Password must be at least 8 characters long.',
        ]);

        // Normalize email and username (trim + lowercase email)
        $validated['email'] = strtolower(trim($validated['email']));
        $validated['username'] = trim($validated['username']);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        // Send welcome email (queued)
        Mail::to($user)->queue(new WelcomeMail($user));

        Auth::login($user);

        return redirect(route('feed', absolute: false));
    }
}
