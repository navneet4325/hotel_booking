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

        if (in_array($booking->status, [Booking::STATUS_CANCELLED, Booking::STATUS_COMPLETED], true)) {
            return back()->with('error', 'Checkout is unavailable for this booking status.');
        }

        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return to_route('bookings.confirmation', $booking);
        }

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

        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return to_route('bookings.confirmation', $booking);
        }

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
    public function success(Request $request, Booking $booking): Response|RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        $booking->load(['room', 'user', 'payment']);

        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return to_route('bookings.confirmation', $booking)->with('success', 'Payment already confirmed for this booking.');
        }

        return Inertia::render('payments/success', [
            'booking' => (new BookingResource($booking))->resolve(),
            'sessionId' => (string) $request->string('session_id'),
            'isDemo' => $request->boolean('demo'),
            'confirmUrl' => route('payments.success.confirm', ['booking' => $booking]),
            'cancelUrl' => route('payments.cancel', ['booking' => $booking]),
        ]);
    }

    /**
     * Confirm a completed payment from the success handoff page.
     */
    public function confirmSuccess(Request $request, Booking $booking, PaymentGatewayService $payments): RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return to_route('bookings.confirmation', $booking)->with('success', 'Payment already confirmed and booking locked in.');
        }

        $payload = $request->validate([
            'session_id' => ['nullable', 'string'],
            'demo' => ['nullable', 'boolean'],
        ]);

        try {
            if ((bool) ($payload['demo'] ?? false)) {
                $payments->completeDemoPayment($booking->load(['payment']));
            } else {
                $sessionId = (string) ($payload['session_id'] ?? '');
                $payments->confirmStripePayment($booking->load(['payment']), $sessionId);
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
    public function cancel(Request $request, Booking $booking): Response|RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        $booking->load(['room', 'payment']);

        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return to_route('bookings.confirmation', $booking)->with('success', 'Payment already confirmed for this booking.');
        }

        return Inertia::render('payments/cancel', [
            'booking' => (new BookingResource($booking))->resolve(),
            'confirmUrl' => route('payments.cancel.confirm', ['booking' => $booking]),
        ]);
    }

    /**
     * Confirm cancellation from the checkout cancel page.
     */
    public function confirmCancel(Request $request, Booking $booking, PaymentGatewayService $payments): RedirectResponse
    {
        abort_unless($request->user()->id === $booking->user_id || $request->user()->isAdmin(), 403);

        if ($booking->payment_status !== Booking::PAYMENT_PAID) {
            $payments->markFailed($booking->load(['payment']));
        }

        return to_route('account.bookings')->with('error', 'Payment was cancelled before completion.');
    }
}
