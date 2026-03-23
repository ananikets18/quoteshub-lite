<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LandingController extends Controller
{
    /**
     * Display the guest landing page.
     */
    public function index(Request $request)
    {
        if (auth()->check()) {
            return redirect()->route('feed');
        }

        // Cache landing page stats for 1 hour to ensure fast loads
        $data = Cache::remember('landing_page_data', now()->addHour(), function () {
            return [
                'featuredQuotes' => Quote::approved()
                    ->with(['user', 'categories'])
                    ->withCount('likes')
                    ->orderBy('likes_count', 'desc')
                    ->take(3)
                    ->get(),

                'topCategories' => Category::active()
                    ->withCount('quotes')
                    ->orderBy('quotes_count', 'desc')
                    ->take(6)
                    ->get(),

                'stats' => [
                    'quotes' => Quote::approved()->count(),
                    'users' => User::count(),
                    'saves' => \App\Models\Save::count(),
                ]
            ];
        });

        return view('welcome', $data);
    }
}
