<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::active()
            ->ordered()
            ->get();

        return response()->json($categories);
    }

    /**
     * Display quotes for a specific category
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['quotes' => function ($query) {
                $query->approved()
                    ->with(['user', 'categories', 'tags'])
                    ->latest()
                    ->paginate(20);
            }])
            ->firstOrFail();

        return response()->json($category);
    }
}
