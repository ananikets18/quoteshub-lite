<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectionApiController extends Controller
{
    /**
     * List the authenticated user's collections (for the picker dropdown).
     */
    public function index(Request $request): JsonResponse
    {
        $collections = auth()->user()
            ->collections()
            ->select('id', 'name', 'slug', 'quotes_count')
            ->orderBy('name')
            ->get();

        return response()->json(['collections' => $collections]);
    }

    /**
     * Add a quote to a collection (AJAX).
     */
    public function addQuote(Request $request, Collection $collection, Quote $quote): JsonResponse
    {
        if ($collection->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        \DB::transaction(function () use ($collection, $quote) {
            if (!$collection->quotes()->where('quote_id', $quote->id)->exists()) {
                $collection->quotes()->attach($quote->id);
                $collection->increment('quotes_count');
            }
        });

        return response()->json(['message' => "Added to '{$collection->name}'!"]);
    }

    /**
     * Remove a quote from a collection (AJAX).
     */
    public function removeQuote(Request $request, Collection $collection, Quote $quote): JsonResponse
    {
        if ($collection->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        \DB::transaction(function () use ($collection, $quote) {
            if ($collection->quotes()->where('quote_id', $quote->id)->exists()) {
                $collection->quotes()->detach($quote->id);
                $collection->decrement('quotes_count');
            }
        });

        return response()->json(['message' => "Removed from '{$collection->name}'."]);
    }
}
