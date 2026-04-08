<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="AetherStay is a premium hotel booking experience with real-time room availability, immersive room discovery, and secure checkout.">
        <meta name="robots" content="index,follow">
        <meta property="og:site_name" content="{{ config('app.name', 'AetherStay') }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ config('app.name', 'AetherStay') }}">
        <meta property="og:description" content="Book premium hotel rooms with modern UX, rich media, and secure payment flows.">
        <meta property="og:image" content="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="theme-color" content="#1e3a8a">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        <style>
            html {
                background-color: oklch(0.975 0.013 75.2);
            }

            html.dark {
                background-color: oklch(0.19 0.03 259.6);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://images.unsplash.com" crossorigin>
        <link rel="preconnect" href="https://player.vimeo.com" crossorigin>
        <link rel="preconnect" href="https://www.youtube.com" crossorigin>
        <link href="https://fonts.bunny.net/css?family=manrope:400,500,600,700|sora:400,500,600,700|space-grotesk:500,600,700" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
