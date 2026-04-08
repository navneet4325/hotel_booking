<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Services\BookingAvailabilityService;
use App\Services\RoomSearchService;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index(
        Request $request,
        RoomSearchService $roomSearch,
        BookingAvailabilityService $availability,
    )
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'view' => ['nullable', 'string', 'max:255'],
            'amenity' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'availability' => ['nullable', 'boolean'],
            'check_in' => ['nullable', 'date'],
            'check_out' => ['nullable', 'date', 'after:check_in'],
            'guests' => ['nullable', 'integer', 'min:1', 'max:10'],
            'sort' => ['nullable', 'in:featured,price_low,price_high,rating'],
        ]);

        $rooms = $roomSearch->buildQuery($filters)->get()->map(function ($room) use ($filters, $availability) {
            $payload = (new RoomResource($room))->resolve();

            if (filled($filters['check_in'] ?? null) && filled($filters['check_out'] ?? null)) {
                $payload['availability_summary'] = $availability->summary(
                    $room,
                    $filters['check_in'],
                    $filters['check_out'],
                );
            }

            return $payload;
        });

        return response()->json([
            'data' => $rooms,
            'meta' => [
                'result_count' => $rooms->count(),
            ],
        ]);
    }

    /**
     * Display a single room.
     */
    public function show(Room $room): RoomResource
    {
        return new RoomResource($room);
    }
}
