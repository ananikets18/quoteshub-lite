<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Middleware to check admin/moderator access
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!Auth::user()->isModerator()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin or Moderator access required.',
                ], 403);
            }
            return $next($request);
        });
    }

    /**
     * Get pending quotes for moderation
     */
    public function pendingQuotes(Request $request)
    {
        $quotes = Quote::with(['user', 'categories', 'tags'])
            ->where('status', 'pending')
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($quotes);
    }

    /**
     * Approve a quote
     */
    public function approveQuote($id)
    {
        $quote = Quote::findOrFail($id);
        $quote->update(['status' => 'approved']);

        return response()->json([
            'message' => 'Quote approved successfully',
            'quote' => $quote,
        ]);
    }

    /**
     * Reject a quote
     */
    public function rejectQuote($id)
    {
        $quote = Quote::findOrFail($id);
        $quote->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Quote rejected successfully',
            'quote' => $quote,
        ]);
    }

    /**
     * Get all users (admin only)
     */
    public function users(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Admin access required'], 403);
        }

        $users = User::withCount(['quotes', 'followers', 'following'])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    /**
     * Update user role (admin only)
     */
    public function updateUserRole(Request $request, $id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Admin access required'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:user,moderator,admin',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Toggle user active status (admin only)
     */
    public function toggleUserStatus($id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Admin access required'], 403);
        }

        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => 'User status updated',
            'user' => $user,
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $stats = [
            'total_quotes' => Quote::count(),
            'pending_quotes' => Quote::where('status', 'pending')->count(),
            'approved_quotes' => Quote::where('status', 'approved')->count(),
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'total_likes' => \App\Models\Like::count(),
            'total_saves' => \App\Models\Save::count(),
            'total_follows' => \App\Models\Follow::count(),
        ];

        return response()->json($stats);
    }
}
