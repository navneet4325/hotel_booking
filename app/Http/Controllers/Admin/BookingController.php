<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display the booking operations screen.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'string'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $bookings = Booking::query()
            ->with(['room', 'user', 'payment'])
            ->when(filled($filters['status'] ?? null), fn ($query) => $query->where('status', $filters['status']))
            ->when(filled($filters['search'] ?? null), function ($query) use ($filters) {
                $search = trim((string) $filters['search']);

                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('booking_reference', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($relation) => $relation->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                        ->orWhereHas('room', fn ($relation) => $relation->where('type', 'like', "%{$search}%")->orWhere('room_number', 'like', "%{$search}%"));
                });
            })
            ->latest('created_at')
            ->get();

        return Inertia::render('admin/bookings/index', [
            'bookings' => BookingResource::collection($bookings)->resolve(),
            'filters' => [
                'status' => $filters['status'] ?? '',
                'search' => $filters['search'] ?? '',
            ],
        ]);
    }

    /**
     * Update an existing booking status.
     */
    public function update(UpdateBookingStatusRequest $request, Booking $booking): RedirectResponse
    {
        $payload = $request->validated();
        $status = $payload['status'];
        $paymentStatus = $payload['payment_status'] ?? $booking->payment_status;

        $booking->update([
            'status' => $status,
            'payment_status' => $paymentStatus,
            'cancelled_at' => $status === Booking::STATUS_CANCELLED ? now() : null,
            'cancellation_reason' => $payload['cancellation_reason'] ?? null,
            'paid_at' => $paymentStatus === Booking::PAYMENT_PAID ? now() : $booking->paid_at,
        ]);

        $booking->payment()?->update([
            'payment_status' => $paymentStatus,
            'paid_at' => $paymentStatus === Booking::PAYMENT_PAID ? now() : $booking->payment?->paid_at,
        ]);

        return back()->with('success', 'Booking updated successfully.');
    }
}
