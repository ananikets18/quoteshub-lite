<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display a user's public profile.
     */
    public function show(Request $request, string $username): Response
    {
        $user = User::where('username', $username)->firstOrFail();
        
        // Load user stats
        $stats = [
            'quotes_count' => $user->quotes()->count(),
            'likes_received' => $user->quotes()->withCount('likes')->get()->sum('likes_count'),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
            'saved_count' => $user->saves()->count(),
        ];
        
        // Check if current user is following this profile
        $isFollowing = $request->user() 
            ? $request->user()->following()->where('following_id', $user->id)->exists()
            : false;
        
        // Load user's quotes (paginated)
        $quotes = $user->quotes()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves'])
            ->latest()
            ->paginate(12);
        
        // Add user interaction flags if authenticated
        if ($request->user()) {
            $quotes->getCollection()->transform(function ($quote) use ($request) {
                $quote->is_liked = $quote->isLikedBy($request->user());
                $quote->is_saved = $quote->isSavedBy($request->user());
                // Add collection IDs this quote is in
                $quote->collection_ids = $quote->collections()
                    ->where('user_id', $request->user()->id)
                    ->pluck('collections.id')
                    ->toArray();
                return $quote;
            });
        }
        
        // Get user's collections if authenticated
        $collections = $request->user() 
            ? $request->user()->collections()->select('id', 'name', 'slug')->orderBy('name')->get()
            : [];
        
        return Inertia::render('Profile/Show', [
            'profile' => $user,
            'stats' => $stats,
            'isFollowing' => $isFollowing,
            'isOwnProfile' => $request->user()?->id === $user->id,
            'quotes' => $quotes,
            'collections' => $collections,
        ]);
    }
    

    
    /**
     * Display the user's profile edit form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Profile/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Get user's saved quotes.
     */
    /**
     * Display the user's saved quotes (private to the user).
     */
    public function saved(Request $request): Response
    {
        // Ensure user is authenticated
        if (!$request->user()) {
            abort(403, 'Unauthorized access to saved quotes.');
        }

        $user = $request->user();
        
        $quotes = $user->savedQuotes()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['likes', 'saves'])
            ->latest('saves.created_at')
            ->paginate(15);
        
        // Add user interaction flags and collection info
        $quotes->getCollection()->transform(function ($quote) use ($user) {
            $quote->is_liked = $quote->isLikedBy($user);
            $quote->is_saved = $quote->isSavedBy($user);
            // Add collection IDs this quote is in
            $quote->collection_ids = $quote->collections()
                ->where('user_id', $user->id)
                ->pluck('collections.id')
                ->toArray();
            return $quote;
        });
        
        // Get user's collections for the add-to-collection dropdown
        $collections = $user->collections()
            ->select('id', 'name', 'slug', 'created_at')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Profile/Saved', [
            'quotes' => $quotes,
            'collections' => $collections,
        ]);
    }



    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }
        
        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover if exists
            if ($user->cover_image) {
                Storage::disk('public')->delete($user->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }
        
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('settings')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
