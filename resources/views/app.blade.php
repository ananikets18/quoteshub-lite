<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'QuotesHub') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="Discover and share inspiring quotes from great minds. QuotesHub - Your daily dose of wisdom and motivation.">
        <meta name="keywords" content="quotes, inspiration, motivation, wisdom, famous quotes, daily quotes">
        <meta name="author" content="QuotesHub">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'QuotesHub') }}">
        <meta property="og:description" content="Discover and share inspiring quotes from great minds. Your daily dose of wisdom and motivation.">
        <meta property="og:image" content="{{ asset('images/og-image.png') }}">
        <meta property="og:site_name" content="QuotesHub">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="{{ config('app.name', 'QuotesHub') }}">
        <meta name="twitter:description" content="Discover and share inspiring quotes from great minds. Your daily dose of wisdom and motivation.">
        <meta name="twitter:image" content="{{ asset('images/og-image.png') }}">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#8B5CF6">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        <script>
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        </script>
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
