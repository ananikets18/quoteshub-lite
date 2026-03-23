<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <title>@yield('title', 'QuotesHub — Discover Inspiring Words')</title>
    <meta name="description" content="@yield('description', 'Join QuotesHub to discover, share, and curate inspiring quotes.')">

    <!-- Preconnect / Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS / JS -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Landing page specifics */
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; overflow-x: hidden; }
        .hero-pattern {
            position: absolute; top: 0; left: 0; right: 0; height: 100vh; z-index: -1;
            background-image: radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.15), transparent 25%),
                              radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.15), transparent 25%);
        }
        .glass-nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 50;
            background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;
        }
        .landing-btn {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white; padding: 10px 24px; border-radius: 9999px; font-weight: 600;
            text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
        }
        .landing-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6); }
        .landing-btn-secondary {
            background: rgba(255,255,255,0.05); color: #f8fafc; border: 1px solid rgba(255,255,255,0.1);
            padding: 10px 24px; border-radius: 9999px; font-weight: 600; text-decoration: none;
            transition: background 0.2s;
        }
        .landing-btn-secondary:hover { background: rgba(255,255,255,0.1); }
    </style>
</head>
<body class="antialiased">

    <nav class="glass-nav">
        <a href="/" class="text-xl font-bold tracking-tight" style="color: #f8fafc; text-decoration: none; display: flex; align-items: center; gap: 8px;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            QuotesHub
        </a>
        <div style="display:flex; gap: 12px; align-items: center;">
            <a href="{{ route('login') }}" class="landing-btn-secondary text-sm hidden sm:inline-block">Sign In</a>
            <a href="{{ route('register') }}" class="landing-btn text-sm">Get Started</a>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <footer style="border-top: 1px solid rgba(255,255,255,0.05); padding: 48px 24px; text-align: center; color: #94a3b8; font-size: 14px;">
        <p>© {{ date('Y') }} QuotesHub. All rights reserved.</p>
        <div style="margin-top: 16px; display: flex; justify-content: center; gap: 24px;">
            <a href="/feed" style="color: #cbd5e1; text-decoration: none;">Browse Quotes</a>
            <a href="{{ route('login') }}" style="color: #cbd5e1; text-decoration: none;">Login</a>
        </div>
    </footer>

</body>
</html>
