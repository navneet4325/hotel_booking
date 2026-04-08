<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Carbon;

class HotelAnalyticsService
{
    /**
     * @return array<string, mixed>
     */
    public function home(): array
    {
        return [
            'total_rooms' => Room::count(),
            'featured_rooms' => Room::where('featured', true)->count(),
            'average_rating' => round((float) Room::avg('rating'), 1),
            'occupancy_rate' => $this->occupancyRate(),
            'monthly_revenue' => round(
                (float) Payment::query()
                    ->where('payment_status', Booking::PAYMENT_PAID)
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year)
                    ->sum('amount'),
                2,
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function user(User $user): array
    {
        $bookings = $user->bookings()->with('room', 'payment')->latest('check_in')->get();
        $upcoming = $bookings->first(fn (Booking $booking) => $booking->status !== Booking::STATUS_CANCELLED && $booking->check_out?->isFuture());

        return [
            'total_bookings' => $bookings->count(),
            'upcoming_bookings' => $bookings->where('status', Booking::STATUS_CONFIRMED)->where('check_in', '>=', now())->count(),
            'total_spend' => round((float) $bookings->where('payment_status', Booking::PAYMENT_PAID)->sum('total_price'), 2),
            'stay_nights' => $bookings->sum('nights'),
            'upcoming_booking' => $upcoming,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function admin(): array
    {
        return [
            'overview' => [
                'revenue' => round((float) Payment::where('payment_status', Booking::PAYMENT_PAID)->sum('amount'), 2),
                'bookings' => Booking::count(),
                'customers' => User::where('role', 'customer')->count(),
                'occupancy_rate' => $this->occupancyRate(),
            ],
            'monthly_revenue' => $this->monthlyRevenue(),
            'booking_statuses' => $this->groupedCounts(Booking::query(), 'status'),
            'payment_statuses' => $this->groupedCounts(Payment::query(), 'payment_status'),
            'room_types' => $this->groupedCounts(Room::query(), 'type'),
        ];
    }

    /**
     * @return list<array{label: string, total: int}>
     */
    public function groupedCounts($query, string $column): array
    {
        return $query
            ->selectRaw("{$column} as label, count(*) as total")
            ->groupBy($column)
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'label' => (string) $row->label,
                'total' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{label: string, revenue: float, bookings: int}>
     */
    public function monthlyRevenue(int $months = 6): array
    {
        return collect(range($months - 1, 0))
            ->map(function (int $offset) {
                $date = Carbon::now()->startOfMonth()->subMonths($offset);

                $payments = Payment::query()
                    ->where('payment_status', Booking::PAYMENT_PAID)
                    ->whereYear('paid_at', $date->year)
                    ->whereMonth('paid_at', $date->month);

                return [
                    'label' => $date->format('M'),
                    'revenue' => round((float) $payments->sum('amount'), 2),
                    'bookings' => Booking::query()
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count(),
                ];
            })
            ->values()
            ->all();
    }

    public function occupancyRate(int $windowDays = 30): float
    {
        $rooms = max(1, Room::count());
        $windowStart = now()->startOfDay();
        $windowEnd = now()->copy()->addDays($windowDays)->startOfDay();

        $reservedNights = Booking::query()
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->whereDate('check_in', '<', $windowEnd->toDateString())
            ->whereDate('check_out', '>', $windowStart->toDateString())
            ->get()
            ->sum(function (Booking $booking) use ($windowStart, $windowEnd) {
                $start = $booking->check_in->greaterThan($windowStart) ? $booking->check_in : $windowStart;
                $end = $booking->check_out->lessThan($windowEnd) ? $booking->check_out : $windowEnd;

                return max(0, $start->diffInDays($end));
            });

        return round(($reservedNights / ($rooms * $windowDays)) * 100, 1);
    }
}
