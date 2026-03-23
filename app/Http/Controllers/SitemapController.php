<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Category;
use App\Models\Quote;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        // Static routes
        $urls = [
            ['loc' => url('/'), 'lastmod' => now()->toAtomString(), 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/feed'), 'lastmod' => now()->toAtomString(), 'changefreq' => 'hourly', 'priority' => '0.9'],
            ['loc' => url('/topics'), 'lastmod' => now()->toAtomString(), 'changefreq' => 'daily', 'priority' => '0.8'],
        ];

        // dynamic categories
        $categories = Category::active()->get();
        foreach ($categories as $cat) {
            $urls[] = [
                'loc' => route('category.show', $cat->slug),
                'lastmod' => $cat->updated_at->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.8'
            ];
        }

        // dynamic authors
        $authors = Quote::approved()->select('author')->distinct()->pluck('author');
        foreach ($authors as $author) {
            $urls[] = [
                'loc' => route('author.show', urlencode($author)),
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        // dynamic quotes (latest 1000 for SEO performance)
        $quotes = Quote::approved()->latest()->take(1000)->get();
        foreach ($quotes as $quote) {
            $urls[] = [
                'loc' => route('quotes.show', $quote->id),
                'lastmod' => $quote->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.6'
            ];
        }

        return response()->view('sitemap', compact('urls'))
                         ->header('Content-Type', 'text/xml');
    }
}
