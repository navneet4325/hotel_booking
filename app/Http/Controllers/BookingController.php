<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\RoomResource;
use App\Models\Booking;
use App\Models\Room;
use App\Services\BookingAvailabilityService;
use App\Services\PaymentGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display the focused booking page for a room.
     */
    public function create(Request $request, Room $room, BookingAvailabilityService $availability): Response
    {
        $initial = null;

        if ($request->filled(['check_in', 'check_out'])) {
            $initial = $availability->summary(
                $room,
                (string) $request->input('check_in'),
                (string) $request->input('check_out'),
            );
        }

        return Inertia::render('bookings/create', [
            'room' => (new RoomResource($room))->resolve(),
            'defaults' => [
                'check_in' => (string) $request->input('check_in', ''),
                'check_out' => (string) $request->input('check_out', ''),
                'guests' => (int) $request->integer('guests', min(2, $room->capacity)),
            ],
            'initialSummary' => $initial,
        ]);
    }

    /**
     * Display the user's booking history.
     */
    public function index(Request $request): Response
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['room', 'payment'])
            ->latest('created_at')
            ->get();

        return Inertia::render('account/bookings/index', [
            'bookings' => BookingResource::collection($bookings)->resolve(),
        ]);
    }

    /**
     * Display a booking confirmation page after payment.
     */
    public function confirmation(Request $request, Booking $booking): Response
    {
        abort_unless($booking->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        $booking->load(['room', 'payment']);

        return Inertia::render('bookings/confirmation', [
            'booking' => (new BookingResource($booking))->resolve(),
        ]);
    }

    /**
     * Store a new booking and launch checkout.
     */
    public function store(
        StoreBookingRequest $request,
        BookingAvailabilityService $availability,
        PaymentGatewayService $payments,
    ) {
        $room = Room::query()->findOrFail($request->integer('room_id'));
        $checkIn = $availability->normalizeDate((string) $request->string('check_in'));
        $checkOut = $availability->normalizeDate((string) $request->string('check_out'));

        if ((int) $request->integer('guests') > $room->capacity) {
            return back()->withErrors([
                'guests' => 'The selected room cannot accommodate that many guests.',
            ]);
        }

        if (! $availability->isAvailable($room, $checkIn, $checkOut)) {
            return back()->withErrors([
                'check_in' => 'The selected stay dates are no longer available for this room.',
            ]);
        }

        $booking = Booking::create([
            'booking_reference' => 'AST-'.Str::upper(Str::random(8)),
            'user_id' => $request->user()->id,
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => $request->integer('guests'),
            'nights' => $availability->calculateNights($checkIn, $checkOut),
            'total_price' => $availability->calculateTotal($room, $checkIn, $checkOut),
            'status' => Booking::STATUS_PENDING,
            'payment_status' => Booking::PAYMENT_PENDING,
            'special_requests' => $request->string('special_requests')->trim()->value() ?: null,
        ]);

        $booking->load(['room', 'user', 'payment']);

        try {
            $checkout = $payments->beginCheckout(
                $booking,
                (string) $request->string('payment_method', 'razorpay'),
            );

            return Inertia::location($checkout['redirect_url']);
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'Booking created, but checkout could not be started. Please try again from your booking history.');
        }
    }

    /**
     * Cancel a booking from the user dashboard.
     */
    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        abort_unless($booking->user_id === $request->user()->id, 403);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return back()->with('error', 'This booking has already been cancelled.');
        }

        $nextPaymentStatus = $booking->payment_status === Booking::PAYMENT_PAID
            ? Booking::PAYMENT_REFUNDED
            : Booking::PAYMENT_FAILED;

        $booking->update([
            'status' => Booking::STATUS_CANCELLED,
            'payment_status' => $nextPaymentStatus,
            'cancelled_at' => now(),
            'cancellation_reason' => 'Cancelled by guest',
        ]);

        $booking->payment()?->update([
            'payment_status' => $nextPaymentStatus,
        ]);

        return back()->with('success', 'Your booking has been cancelled.');
    }
}
