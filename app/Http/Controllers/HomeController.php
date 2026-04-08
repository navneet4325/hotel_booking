<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Services\HotelAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    /**
     * Display the premium landing page.
     */
    public function __invoke(Request $request, HotelAnalyticsService $analytics): Response
    {
        $featuredRooms = Room::query()
            ->orderByDesc('featured')
            ->orderBy('price')
            ->limit(4)
            ->get();

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'featuredRooms' => RoomResource::collection($featuredRooms)->resolve(),
            'stats' => $analytics->home(),
            'experienceHighlights' => [
                [
                    'title' => 'Realtime stay choreography',
                    'description' => 'Live availability, responsive pricing, and a floating booking panel keep the reservation flow instant and immersive.',
                ],
                [
                    'title' => 'Curated room narratives',
                    'description' => 'Each suite is presented like a destination with layered visuals, smart amenity groupings, and responsive details.',
                ],
                [
                    'title' => 'Operations-grade control',
                    'description' => 'Admins can track reservations, revenue, customers, and occupancy trends without leaving the dashboard.',
                ],
            ],
            'testimonials' => [
                [
                    'quote' => 'The booking flow feels closer to a luxury travel concierge than a standard hotel form.',
                    'author' => 'Noah Bennett',
                    'role' => 'Frequent traveler',
                ],
                [
                    'quote' => 'The admin panel makes revenue, occupancy, and customer activity readable at a glance.',
                    'author' => 'Ava Hart',
                    'role' => 'Hotel operations manager',
                ],
            ],
        ]);
    }
}
