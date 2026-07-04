<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Quote;
use App\Jobs\SendQuoteNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * List approved top-level comments for a quote (with replies).
     */
    public function index(Quote $quote): JsonResponse
    {
        $comments = Comment::where('quote_id', $quote->id)
            ->topLevel()
            ->with(['user:id,name,username,avatar', 'replies.user:id,name,username,avatar'])
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }

    /**
     * Store a new comment or reply.
     */
    public function store(Request $request, Quote $quote): JsonResponse
    {
        $validated = $request->validate([
            'body'      => 'required|string|min:1|max:1000',
            'parent_id' => 'nullable|integer|exists:comments,id',
        ]);

        // If reply, ensure parent belongs to same quote
        if (!empty($validated['parent_id'])) {
            $parent = Comment::findOrFail($validated['parent_id']);
            if ($parent->quote_id !== $quote->id) {
                return response()->json(['message' => 'Parent comment does not belong to this quote.'], 422);
            }
        }

        $comment = Comment::create([
            'quote_id'  => $quote->id,
            'user_id'   => auth()->id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'body'      => $validated['body'],
        ]);

        $comment->load('user:id,name,username,avatar');

        // Dispatch notification (only for top-level comments and not self-notifications)
        if (empty($validated['parent_id']) && auth()->id() !== $quote->user_id) {
            SendQuoteNotification::dispatch(
                'comment',
                auth()->id(),
                $quote->user_id,
                $quote->id,
                $validated['body']
            )->afterCommit();
        }

        return response()->json([
            'comment' => $comment,
            'message' => 'Comment posted!',
        ], 201);
    }

    /**
     * Delete a comment (owner or admin only).
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $user = auth()->user();

        if ($user->id !== $comment->user_id && !$user->is_admin) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}
