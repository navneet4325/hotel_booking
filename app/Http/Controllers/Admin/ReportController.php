<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Services\HotelAnalyticsService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display reports and statistics.
     */
    public function index(HotelAnalyticsService $analytics): Response
    {
        $topRooms = Room::query()
            ->leftJoin('bookings', 'bookings.room_id', '=', 'rooms.id')
            ->select(
                'rooms.id',
                'rooms.type',
                'rooms.room_number',
                DB::raw('count(bookings.id) as bookings_count'),
                DB::raw('coalesce(sum(bookings.total_price), 0) as revenue')
            )
            ->groupBy('rooms.id', 'rooms.type', 'rooms.room_number')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($room) => [
                'id' => $room->id,
                'label' => $room->type.' '.$room->room_number,
                'bookings_count' => (int) $room->bookings_count,
                'revenue' => (float) $room->revenue,
            ]);

        return Inertia::render('admin/reports/index', [
            'analytics' => $analytics->admin(),
            'topRooms' => $topRooms,
            'statusSummary' => $analytics->groupedCounts(Booking::query(), 'status'),
        ]);
    }
}
