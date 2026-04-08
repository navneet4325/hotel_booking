<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Services\HotelAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function __invoke(Request $request, HotelAnalyticsService $analytics): Response
    {
        $user = $request->user();
        $overview = $analytics->user($user);
        $bookings = $user->bookings()->with(['room', 'payment'])->latest('check_in')->take(4)->get();

        if ($overview['upcoming_booking']) {
            $overview['upcoming_booking'] = (new BookingResource($overview['upcoming_booking']))->resolve();
        }

        return Inertia::render('account/dashboard', [
            'overview' => $overview,
            'recentBookings' => BookingResource::collection($bookings)->resolve(),
        ]);
    }
}
