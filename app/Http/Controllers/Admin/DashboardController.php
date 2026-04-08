<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\RoomResource;
use App\Models\Booking;
use App\Models\Room;
use App\Services\HotelAnalyticsService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin overview dashboard.
     */
    public function __invoke(HotelAnalyticsService $analytics): Response
    {
        $recentBookings = Booking::query()
            ->with(['room', 'user', 'payment'])
            ->latest('created_at')
            ->limit(6)
            ->get();

        $featuredRooms = Room::query()
            ->orderByDesc('featured')
            ->orderByDesc('rating')
            ->limit(4)
            ->get();

        return Inertia::render('admin/dashboard', [
            'analytics' => $analytics->admin(),
            'recentBookings' => BookingResource::collection($recentBookings)->resolve(),
            'featuredRooms' => RoomResource::collection($featuredRooms)->resolve(),
        ]);
    }
}
