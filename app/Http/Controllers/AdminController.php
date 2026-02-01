<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Quote;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    // Admin role check is handled in routes

    /**
     * Show admin dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'pending_reports' => Report::where('status', 'pending')->count(),
            'total_users' => User::count(),
            'total_quotes' => Quote::count(),
            'recent_reports' => Report::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Show all reports.
     */
    public function reports(Request $request): Response
    {
        $status = $request->input('status', 'pending');
        
        $reports = Report::with(['user', 'quote.user', 'reviewer'])
            ->when($status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Review a report and take action.
     */
    public function reviewReport(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:dismiss,warn,remove',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $report->update([
            'status' => $validated['action'] === 'dismiss' ? 'dismissed' : 'action_taken',
            'reviewed_by' => $request->user()->id,
            'admin_notes' => $validated['admin_notes'],
            'reviewed_at' => now(),
        ]);

        $notificationService = app(NotificationService::class);
        $quoteOwner = $report->quote->user;

        // Take action on the quote if needed
        if ($validated['action'] === 'remove') {
            $reason = $validated['admin_notes'] ?? 'Violated community guidelines';
            $notificationService->notifyQuoteRemoved($quoteOwner, $report->quote, $reason, $request->user());
            $report->quote->delete();
        } elseif ($validated['action'] === 'warn') {
            $reason = $validated['admin_notes'] ?? 'Your quote was reported and reviewed';
            $notificationService->notifyAdminWarning($quoteOwner, $reason, $request->user());
        }

        return back()->with('success', 'Report reviewed successfully!');
    }

    /**
     * Show user management page.
     */
    public function users(Request $request): Response
    {
        $search = $request->input('search');
        $role = $request->input('role');
        
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('username', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->withCount('quotes')
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
        ]);
    }

    /**
     * Update user status or role.
     */
    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'nullable|in:user,admin',
            'is_active' => 'nullable|boolean',
        ]);

        $user->update(array_filter($validated));

        return back()->with('success', 'User updated successfully!');
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user): RedirectResponse
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot delete admin users.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully!');
    }
}
