<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Services\BookingAvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    /**
     * Display the availability for a given room and stay window.
     */
    public function show(Request $request, BookingAvailabilityService $availability): JsonResponse
    {
        $data = $request->validate([
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        $room = Room::query()->findOrFail($data['room_id']);

        return response()->json([
            'room_id' => $room->id,
            'check_in' => $availability->normalizeDate($data['check_in']),
            'check_out' => $availability->normalizeDate($data['check_out']),
            ...$availability->summary($room, $data['check_in'], $data['check_out']),
        ]);
    }
}
