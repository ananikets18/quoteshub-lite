<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    /**
     * Display a listing of topics (categories and tags).
     */
    public function index()
    {
        // Get all categories with quote counts
        // Using the cached quotes_count column from the categories table
        $categories = Category::query()
            ->orderByDesc('categories.quotes_count')
            ->get()
            ->map(function ($category) {
                // Ensure we have a valid color or generate one based on ID/Name if null
                $colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'pink', 'red', 'indigo'];
                if (!$category->color) {
                    $category->color = $colors[$category->id % count($colors)];
                }
                return $category;
            });

        // Get trending tags
        $tags = Tag::withCount('quotes')
            ->orderByDesc('quotes_count')
            ->take(15)
            ->get();

        return view('topics.index', compact('categories', 'tags'));
    }
}
