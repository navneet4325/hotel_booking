<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Booking
 */
class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_reference' => $this->booking_reference,
            'check_in' => optional($this->check_in)->toDateString(),
            'check_out' => optional($this->check_out)->toDateString(),
            'guests' => $this->guests,
            'nights' => $this->nights,
            'total_price' => (float) $this->total_price,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'special_requests' => $this->special_requests,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => optional($this->cancelled_at)->toISOString(),
            'paid_at' => optional($this->paid_at)->toISOString(),
            'created_at' => optional($this->created_at)->toISOString(),
            'room' => $this->whenLoaded('room', fn () => new RoomResource($this->room)),
            'payment' => $this->whenLoaded('payment', fn () => new PaymentResource($this->payment)),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ]),
        ];
    }
}
