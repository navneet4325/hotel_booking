<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display payment tracking records.
     */
    public function index(): Response
    {
        $payments = Payment::query()
            ->with(['booking.room', 'booking.user'])
            ->latest('created_at')
            ->get()
            ->map(function (Payment $payment) {
                $payload = (new PaymentResource($payment))->resolve();

                $payload['booking'] = [
                    'id' => $payment->booking?->id,
                    'booking_reference' => $payment->booking?->booking_reference,
                    'room_type' => $payment->booking?->room?->type,
                    'guest_name' => $payment->booking?->user?->name,
                ];

                return $payload;
            });

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
        ]);
    }
}
