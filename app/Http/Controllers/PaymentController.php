<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\PaymentGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Retry checkout from the booking history page.
     */
    public function checkout(Request $request, Booking $booking, PaymentGatewayService $payments)
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        try {
            $checkout = $payments->beginCheckout(
                $booking->load(['room', 'user', 'payment']),
                (string) $request->string(
                    'payment_method',
                    $booking->payment?->payment_method ?: 'stripe',
                ),
            );

            return Inertia::location($checkout['redirect_url']);
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'Checkout could not be started right now.');
        }
    }

    /**
     * Render the Razorpay handoff screen.
     */
    public function showRazorpay(Request $request, Booking $booking, PaymentGatewayService $payments): Response|RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        try {
            $booking->load(['room', 'user', 'payment']);

            return Inertia::render('payments/razorpay', [
                'booking' => (new BookingResource($booking))->resolve(),
                'checkout' => $payments->razorpayCheckoutPayload($booking),
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return to_route('account.bookings')->with('error', 'Razorpay checkout could not be prepared right now.');
        }
    }

    /**
     * Handle a completed Razorpay payment.
     */
    public function verifyRazorpay(Request $request, Booking $booking, PaymentGatewayService $payments): RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        $payload = $request->validate([
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        try {
            $payments->confirmRazorpayPayment(
                $booking->load(['room', 'user', 'payment']),
                $payload['razorpay_payment_id'],
                $payload['razorpay_order_id'],
                $payload['razorpay_signature'],
            );

            return to_route('bookings.confirmation', $booking)->with('success', 'Razorpay payment confirmed and booking locked in.');
        } catch (\Throwable $exception) {
            report($exception);

            return to_route('account.bookings')->with('error', 'We could not confirm the Razorpay payment yet. Please retry shortly.');
        }
    }

    /**
     * Handle a completed payment.
     */
    public function success(Request $request, Booking $booking, PaymentGatewayService $payments): RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        try {
            if ($request->boolean('demo')) {
                $payments->completeDemoPayment($booking->load(['payment']));
            } else {
                $sessionId = (string) $request->string('session_id');
                $payments->confirmStripePayment($booking, $sessionId);
            }

            return to_route('bookings.confirmation', $booking)->with('success', 'Payment confirmed and booking locked in.');
        } catch (\Throwable $exception) {
            report($exception);

            return to_route('account.bookings')->with('error', 'We could not confirm the payment yet. Please retry shortly.');
        }
    }

    /**
     * Handle a cancelled checkout.
     */
    public function cancel(Request $request, Booking $booking, PaymentGatewayService $payments): RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        $payments->markFailed($booking->load(['payment']));

        return to_route('account.bookings')->with('error', 'Payment was cancelled before completion.');
    }
}
