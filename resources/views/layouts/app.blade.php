<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title', config('app.name', 'QuotesHub'))</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="@yield('description', 'Discover and share inspiring quotes from great minds. QuotesHub — Your daily dose of wisdom and motivation.')">
        <meta name="keywords" content="@yield('keywords', 'quotes, inspiration, motivation, wisdom, famous quotes, daily quotes')">
        <meta name="author" content="QuotesHub">

        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="@yield('og_title', config('app.name', 'QuotesHub'))">
        <meta property="og:description" content="@yield('og_description', 'Discover and share inspiring quotes from great minds.')">
        <meta property="og:image" content="@yield('og_image', asset('images/og-image.png'))">
        <meta property="og:site_name" content="QuotesHub">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="@yield('twitter_title', config('app.name', 'QuotesHub'))">
        <meta name="twitter:description" content="@yield('twitter_description', 'Discover and share inspiring quotes from great minds.')">
        <meta name="twitter:image" content="@yield('twitter_image', asset('images/og-image.png'))">

        <!-- App Meta -->
        <meta name="theme-color" content="#0a0a0f" media="(prefers-color-scheme: dark)">
        <meta name="theme-color" content="#f1f0f8" media="(prefers-color-scheme: light)">
        <meta name="authenticated" content="{{ auth()->check() ? 'true' : 'false' }}">
        @auth
        <meta name="user-id" content="{{ auth()->id() }}">
        @endauth
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <!-- Fonts preconnect -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

        <!-- Inline theme init (prevent FOUC) -->
        <script>
            (function(){
                var t = localStorage.getItem('qh-theme');
                var root = document.documentElement;
                if (t === 'light') {
                    root.classList.remove('dark');
                    root.classList.add('light');
                } else {
                    root.classList.add('dark');
                    root.classList.remove('light');
                }
            })();
        </script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])

        @stack('styles')
    </head>
    <body>
        {{-- Navigation renders sidebar + mobile topbar + bottom nav --}}
        @include('layouts.navigation')

        {{-- Main content yielded by child views
             Note: views that use the full app-shell layout open the div themselves,
             but for views that just yield #content, we wrap here. --}}
        <main id="app-content">
            @yield('content')
        </main>

        <!-- Toast Notifications -->
        <x-toast />

        @stack('scripts')
    </body>
</html>
