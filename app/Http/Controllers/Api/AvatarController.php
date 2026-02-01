<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

class AvatarController extends Controller
{
    /**
     * Upload user avatar
     * 
     * Security & validation:
     * - Only authenticated users
     * - File type validation (images only)
     * - File size limit (2MB)
     * - Automatic old avatar deletion
     * - Secure filename generation
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'avatar' => [
                'required',
                File::image()
                    ->max(2 * 1024) // 2MB max
                    ->dimensions(Rule::dimensions()->maxWidth(2000)->maxHeight(2000)),
            ],
        ], [
            'avatar.required' => 'Please select an image to upload.',
            'avatar.image' => 'The file must be an image (jpg, png, gif, etc.).',
            'avatar.max' => 'The image must not be larger than 2MB.',
        ]);

        $user = Auth::user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar with secure filename
        $path = $request->file('avatar')->store('avatars', 'public');

        // Update user avatar path
        $user->update([
            'avatar' => $path,
        ]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => Storage::url($path),
            'avatar_path' => $path,
        ]);
    }

    /**
     * Upload cover image
     */
    public function uploadCover(Request $request)
    {
        $validated = $request->validate([
            'cover_image' => [
                'required',
                File::image()
                    ->max(5 * 1024) // 5MB max for cover
                    ->dimensions(Rule::dimensions()->maxWidth(3000)->maxHeight(1500)),
            ],
        ], [
            'cover_image.required' => 'Please select an image to upload.',
            'cover_image.image' => 'The file must be an image.',
            'cover_image.max' => 'The image must not be larger than 5MB.',
        ]);

        $user = Auth::user();

        // Delete old cover image if exists
        if ($user->cover_image && Storage::disk('public')->exists($user->cover_image)) {
            Storage::disk('public')->delete($user->cover_image);
        }

        // Store new cover image
        $path = $request->file('cover_image')->store('covers', 'public');

        // Update user cover image path
        $user->update([
            'cover_image' => $path,
        ]);

        return response()->json([
            'message' => 'Cover image uploaded successfully',
            'cover_url' => Storage::url($path),
            'cover_path' => $path,
        ]);
    }

    /**
     * Delete avatar
     */
    public function deleteAvatar()
    {
        $user = Auth::user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->update([
            'avatar' => null,
        ]);

        return response()->json([
            'message' => 'Avatar deleted successfully',
        ]);
    }

    /**
     * Delete cover image
     */
    public function deleteCover()
    {
        $user = Auth::user();

        if ($user->cover_image && Storage::disk('public')->exists($user->cover_image)) {
            Storage::disk('public')->delete($user->cover_image);
        }

        $user->update([
            'cover_image' => null,
        ]);

        return response()->json([
            'message' => 'Cover image deleted successfully',
        ]);
    }
}
