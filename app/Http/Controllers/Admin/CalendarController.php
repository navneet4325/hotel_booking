<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Display the reservation calendar.
     */
    public function index(Request $request): Response
    {
        $anchor = $request->filled('month')
            ? Carbon::parse((string) $request->string('month'))->startOfMonth()
            : now()->startOfMonth();

        $monthStart = $anchor->copy()->startOfMonth();
        $monthEnd = $anchor->copy()->endOfMonth();

        $bookings = Booking::query()
            ->with(['room', 'user'])
            ->whereDate('check_in', '<=', $monthEnd->toDateString())
            ->whereDate('check_out', '>=', $monthStart->toDateString())
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED, Booking::STATUS_COMPLETED])
            ->get();

        $gridStart = $monthStart->copy()->startOfWeek();
        $gridEnd = $monthEnd->copy()->endOfWeek();

        $days = [];

        while ($gridStart->lte($gridEnd)) {
            $date = $gridStart->toDateString();

            $days[] = [
                'date' => $date,
                'label' => $gridStart->format('d'),
                'isCurrentMonth' => $gridStart->month === $monthStart->month,
                'bookings' => $bookings
                    ->filter(fn (Booking $booking) => $booking->check_in->toDateString() <= $date && $booking->check_out->toDateString() > $date)
                    ->map(fn (Booking $booking) => [
                        'reference' => $booking->booking_reference,
                        'guest' => $booking->user?->name,
                        'room' => $booking->room?->type,
                        'status' => $booking->status,
                    ])
                    ->values(),
            ];

            $gridStart->addDay();
        }

        return Inertia::render('admin/calendar/index', [
            'month' => $monthStart->toDateString(),
            'days' => $days,
        ]);
    }
}
