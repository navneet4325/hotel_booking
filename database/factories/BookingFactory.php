<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = Carbon::now()->addDays(fake()->numberBetween(2, 30));
        $nights = fake()->numberBetween(1, 5);

        return [
            'booking_reference' => 'AST-'.Str::upper(Str::random(8)),
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'check_in' => $checkIn->toDateString(),
            'check_out' => $checkIn->copy()->addDays($nights)->toDateString(),
            'guests' => fake()->numberBetween(1, 4),
            'nights' => $nights,
            'total_price' => fake()->numberBetween(220, 2200),
            'status' => fake()->randomElement([
                Booking::STATUS_PENDING,
                Booking::STATUS_CONFIRMED,
                Booking::STATUS_COMPLETED,
            ]),
            'payment_status' => fake()->randomElement([
                Booking::PAYMENT_PENDING,
                Booking::PAYMENT_PAID,
            ]),
            'special_requests' => fake()->boolean(35) ? fake()->sentence() : null,
            'cancellation_reason' => null,
            'cancelled_at' => null,
            'paid_at' => now(),
        ];
    }
}
