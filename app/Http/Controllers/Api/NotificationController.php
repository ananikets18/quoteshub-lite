<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications for authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $query = Notification::where('user_id', $user->id)
            ->with('actor:id,name,username,avatar')
            ->orderByDesc('created_at');

        // Filter by read/unread
        if ($request->has('unread_only') && $request->boolean('unread_only')) {
            $query->unread();
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $notifications = $query->paginate($perPage);

        // Transform notifications to include formatted data
        $notifications->getCollection()->transform(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->getMessage(),
                'icon' => $notification->getIcon(),
                'url' => $notification->getUrl(),
                'actor' => $notification->actor ? [
                    'id' => $notification->actor->id,
                    'name' => $notification->actor->name,
                    'username' => $notification->actor->username,
                    'avatar' => $notification->actor->avatar,
                ] : null,
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'is_read' => $notification->isRead(),
                'created_at' => $notification->created_at,
                'time_ago' => $notification->created_at->diffForHumans(),
            ];
        });

        return response()->json($notifications);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(): JsonResponse
    {
        $user = Auth::user();
        $count = $this->notificationService->getUnreadCount($user);

        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $user = Auth::user();

        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => [
                'id' => $notification->id,
                'read_at' => $notification->read_at,
            ],
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = Auth::user();
        $this->notificationService->markAllAsRead($user);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $user = Auth::user();

        // Ensure user owns this notification
        if ($notification->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ]);
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead(): JsonResponse
    {
        $user = Auth::user();
        
        $deletedCount = Notification::where('user_id', $user->id)
            ->whereNotNull('read_at')
            ->delete();

        return response()->json([
            'message' => 'All read notifications deleted',
            'deleted_count' => $deletedCount,
        ]);
    }
}
