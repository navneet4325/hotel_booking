<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class PaymentGatewayService
{
    public function createOrUpdatePayment(Booking $booking, string $method = 'stripe'): Payment
    {
        $provider = $method === 'razorpay' ? 'razorpay' : 'stripe';
        $currency = $provider === 'razorpay'
            ? strtoupper((string) config('services.razorpay.currency', 'INR'))
            : strtoupper((string) config('services.stripe.currency', 'USD'));

        return Payment::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'payment_method' => $provider,
                'payment_status' => $booking->payment_status,
                'provider' => $provider,
                'amount' => $booking->total_price,
                'currency' => $currency,
            ],
        );
    }

    /**
     * @return array{mode: string, redirect_url: string}
     */
    public function beginCheckout(Booking $booking, string $method = 'stripe'): array
    {
        return $method === 'razorpay'
            ? $this->beginRazorpayCheckout($booking->loadMissing(['room', 'user', 'payment']))
            : $this->beginStripeCheckout($booking->loadMissing(['room', 'user', 'payment']));
    }

    /**
     * @return array<string, mixed>
     */
    public function razorpayCheckoutPayload(Booking $booking): array
    {
        $payment = $booking->payment ?: $this->createOrUpdatePayment($booking, 'razorpay');
        $orderId = (string) ($payment->gateway_reference ?: data_get($payment->provider_payload, 'id', ''));

        if ($orderId === '') {
            throw new RuntimeException('Razorpay order could not be found for this booking.');
        }

        return [
            'key' => (string) config('services.razorpay.key'),
            'order_id' => $orderId,
            'amount' => (int) round((float) $booking->total_price * 100),
            'currency' => strtoupper((string) config('services.razorpay.currency', 'INR')),
            'name' => (string) config('app.name', 'AetherStay'),
            'description' => $booking->room->type.' booking',
            'prefill' => [
                'name' => $booking->user->name,
                'email' => $booking->user->email,
                'contact' => $booking->user->phone,
            ],
            'notes' => [
                'booking_reference' => $booking->booking_reference,
                'room' => $booking->room->type,
            ],
            'verify_url' => route('payments.razorpay.verify', ['booking' => $booking]),
            'cancel_url' => route('payments.cancel', ['booking' => $booking]),
            'theme' => [
                'color' => '#0f172a',
            ],
        ];
    }

    public function completeDemoPayment(Booking $booking): void
    {
        if (! $this->canUseDemoMode()) {
            throw new RuntimeException('Demo payment mode is disabled in this environment.');
        }

        $method = $booking->payment?->payment_method ?: 'stripe';
        $payment = $this->createOrUpdatePayment($booking, $method);

        $payment->update([
            'payment_status' => Booking::PAYMENT_PAID,
            'paid_at' => now(),
            'transaction_id' => $payment->transaction_id ?: 'DEMO-'.Str::upper(Str::random(10)),
            'provider_payload' => ['mode' => 'demo', 'provider' => $payment->provider],
        ]);

        $booking->update([
            'status' => Booking::STATUS_CONFIRMED,
            'payment_status' => Booking::PAYMENT_PAID,
            'paid_at' => now(),
        ]);
    }

    public function confirmStripePayment(Booking $booking, string $sessionId): void
    {
        if (! $this->hasStripeCredentials()) {
            if (! $this->canUseDemoMode()) {
                throw new RuntimeException('Stripe credentials are required in this environment.');
            }

            $this->completeDemoPayment($booking);

            return;
        }

        if ($sessionId === '') {
            throw new RuntimeException('Stripe session id is required.');
        }

        $payment = $booking->payment ?: $this->createOrUpdatePayment($booking, 'stripe');
        $expectedSessionId = (string) ($payment->gateway_reference ?? '');

        if ($expectedSessionId === '' || ! hash_equals($expectedSessionId, $sessionId)) {
            throw new RuntimeException('Stripe session does not match this booking.');
        }

        $response = Http::withToken((string) config('services.stripe.secret'))
            ->get("https://api.stripe.com/v1/checkout/sessions/{$sessionId}");

        if (! $response->successful()) {
            throw new RuntimeException('Stripe session verification failed.');
        }

        $session = $response->json();

        if (($session['payment_status'] ?? null) !== 'paid') {
            throw new RuntimeException('Payment has not been completed yet.');
        }

        if ((string) data_get($session, 'metadata.booking_id') !== (string) $booking->id) {
            throw new RuntimeException('Stripe session booking metadata does not match.');
        }

        $expectedAmount = (int) round((float) $booking->total_price * 100);
        $sessionAmount = (int) ($session['amount_total'] ?? -1);

        if ($sessionAmount !== $expectedAmount) {
            throw new RuntimeException('Stripe session amount mismatch.');
        }

        $expectedCurrency = strtolower((string) config('services.stripe.currency', 'usd'));
        $sessionCurrency = strtolower((string) ($session['currency'] ?? ''));

        if ($sessionCurrency !== $expectedCurrency) {
            throw new RuntimeException('Stripe session currency mismatch.');
        }

        $payment->update([
            'payment_status' => Booking::PAYMENT_PAID,
            'transaction_id' => (string) ($session['payment_intent'] ?? $session['id'] ?? ''),
            'gateway_reference' => (string) ($session['id'] ?? ''),
            'provider_payload' => $session,
            'paid_at' => now(),
        ]);

        $booking->update([
            'status' => Booking::STATUS_CONFIRMED,
            'payment_status' => Booking::PAYMENT_PAID,
            'paid_at' => now(),
        ]);
    }

    public function confirmRazorpayPayment(
        Booking $booking,
        string $paymentId,
        string $orderId,
        string $signature,
    ): void {
        if (! $this->hasRazorpayCredentials()) {
            throw new RuntimeException('Razorpay credentials are required to verify payment signatures.');
        }

        $payment = $this->createOrUpdatePayment($booking, 'razorpay');
        $serverOrderId = (string) ($payment->gateway_reference ?: data_get($payment->provider_payload, 'id', ''));

        if ($serverOrderId === '' || ! hash_equals($serverOrderId, $orderId)) {
            throw new RuntimeException('Razorpay order verification failed.');
        }

        $expectedSignature = hash_hmac(
            'sha256',
            $serverOrderId.'|'.$paymentId,
            (string) config('services.razorpay.secret'),
        );

        if (! hash_equals($expectedSignature, $signature)) {
            throw new RuntimeException('Razorpay signature verification failed.');
        }

        $payment->update([
            'payment_status' => Booking::PAYMENT_PAID,
            'transaction_id' => $paymentId,
            'gateway_reference' => $serverOrderId,
            'provider_payload' => [
                'order_id' => $serverOrderId,
                'payment_id' => $paymentId,
                'signature' => $signature,
            ],
            'paid_at' => now(),
        ]);

        $booking->update([
            'status' => Booking::STATUS_CONFIRMED,
            'payment_status' => Booking::PAYMENT_PAID,
            'paid_at' => now(),
        ]);
    }

    public function markFailed(Booking $booking): void
    {
        if ($booking->payment_status === Booking::PAYMENT_PAID) {
            return;
        }

        $booking->update([
            'payment_status' => Booking::PAYMENT_FAILED,
        ]);

        $method = $booking->payment?->payment_method ?: 'stripe';

        $this->createOrUpdatePayment($booking, $method)->update([
            'payment_status' => Booking::PAYMENT_FAILED,
        ]);
    }

    /**
     * @return array{mode: string, redirect_url: string}
     */
    private function beginStripeCheckout(Booking $booking): array
    {
        $payment = $this->createOrUpdatePayment($booking, 'stripe');

        if (! $this->hasStripeCredentials()) {
            if (! $this->canUseDemoMode()) {
                throw new RuntimeException('Stripe credentials are missing and demo mode is disabled.');
            }

            $payment->update([
                'transaction_id' => 'DEMO-'.Str::upper(Str::random(10)),
            ]);

            return [
                'mode' => 'demo',
                'redirect_url' => route('payments.success', [
                    'booking' => $booking,
                    'demo' => 1,
                ]),
            ];
        }

        $response = Http::asForm()
            ->withToken((string) config('services.stripe.secret'))
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'mode' => 'payment',
                'success_url' => route('payments.success', ['booking' => $booking]).'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payments.cancel', ['booking' => $booking]),
                'customer_email' => $booking->user->email,
                'metadata[booking_id]' => (string) $booking->id,
                'metadata[booking_reference]' => $booking->booking_reference,
                'line_items[0][quantity]' => 1,
                'line_items[0][price_data][currency]' => strtolower((string) config('services.stripe.currency', 'usd')),
                'line_items[0][price_data][unit_amount]' => (int) round((float) $booking->total_price * 100),
                'line_items[0][price_data][product_data][name]' => $booking->room->type.' booking',
                'line_items[0][price_data][product_data][description]' => sprintf(
                    '%s to %s',
                    $booking->check_in?->format('M d, Y'),
                    $booking->check_out?->format('M d, Y'),
                ),
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Stripe checkout session could not be created.');
        }

        $session = $response->json();

        $payment->update([
            'gateway_reference' => $session['id'] ?? null,
            'provider_payload' => $session,
        ]);

        return [
            'mode' => 'stripe',
            'redirect_url' => (string) ($session['url'] ?? route('payments.cancel', ['booking' => $booking])),
        ];
    }

    /**
     * @return array{mode: string, redirect_url: string}
     */
    private function beginRazorpayCheckout(Booking $booking): array
    {
        $payment = $this->createOrUpdatePayment($booking, 'razorpay');

        if (! $this->hasRazorpayCredentials()) {
            if (! $this->canUseDemoMode()) {
                throw new RuntimeException('Razorpay credentials are missing and demo mode is disabled.');
            }

            $payment->update([
                'transaction_id' => 'DEMO-'.Str::upper(Str::random(10)),
            ]);

            return [
                'mode' => 'demo',
                'redirect_url' => route('payments.success', [
                    'booking' => $booking,
                    'demo' => 1,
                ]),
            ];
        }

        $response = Http::withBasicAuth(
            (string) config('services.razorpay.key'),
            (string) config('services.razorpay.secret'),
        )->post('https://api.razorpay.com/v1/orders', [
            'amount' => (int) round((float) $booking->total_price * 100),
            'currency' => strtoupper((string) config('services.razorpay.currency', 'INR')),
            'receipt' => $booking->booking_reference,
            'notes' => [
                'booking_id' => (string) $booking->id,
                'booking_reference' => $booking->booking_reference,
                'room_type' => $booking->room->type,
            ],
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('Razorpay order could not be created.');
        }

        $order = $response->json();

        $payment->update([
            'gateway_reference' => $order['id'] ?? null,
            'provider_payload' => $order,
        ]);

        return [
            'mode' => 'razorpay',
            'redirect_url' => route('payments.razorpay.show', ['booking' => $booking]),
        ];
    }

    private function hasStripeCredentials(): bool
    {
        return filled(config('services.stripe.key')) && filled(config('services.stripe.secret'));
    }

    private function hasRazorpayCredentials(): bool
    {
        return filled(config('services.razorpay.key')) && filled(config('services.razorpay.secret'));
    }

    private function canUseDemoMode(): bool
    {
        return app()->environment(['local', 'testing']) || (bool) config('services.payments.demo_mode', false);
    }
}
