<?php

namespace App\Services;

use App\Models\Room;
use Illuminate\Support\Carbon;

class BookingAvailabilityService
{
    public function normalizeDate(string $value): string
    {
        return Carbon::parse($value)->toDateString();
    }

    public function calculateNights(string $checkIn, string $checkOut): int
    {
        return max(
            1,
            Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut)),
        );
    }

    public function calculateTotal(Room $room, string $checkIn, string $checkOut): float
    {
        return $this->calculateNights($checkIn, $checkOut) * (float) $room->price;
    }

    public function isAvailable(Room $room, string $checkIn, string $checkOut, ?int $ignoreBookingId = null): bool
    {
        return $room->isAvailableFor(
            $this->normalizeDate($checkIn),
            $this->normalizeDate($checkOut),
            $ignoreBookingId,
        );
    }

    /**
     * @return array<string, int|float|bool>
     */
    public function summary(Room $room, string $checkIn, string $checkOut): array
    {
        $normalizedCheckIn = $this->normalizeDate($checkIn);
        $normalizedCheckOut = $this->normalizeDate($checkOut);
        $nights = $this->calculateNights($normalizedCheckIn, $normalizedCheckOut);

        return [
            'available' => $this->isAvailable($room, $normalizedCheckIn, $normalizedCheckOut),
            'nights' => $nights,
            'total_price' => $nights * (float) $room->price,
            'nightly_rate' => (float) $room->price,
        ];
    }
}
