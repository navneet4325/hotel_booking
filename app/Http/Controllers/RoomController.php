<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Services\BookingAvailabilityService;
use App\Services\RoomSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display the discoverable room catalogue.
     */
    public function index(
        Request $request,
        BookingAvailabilityService $availability,
        RoomSearchService $roomSearch,
    ): Response
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

        $rooms = $roomSearch->buildQuery($filters)->get()->map(function (Room $room) use ($filters, $availability) {
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

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'location' => $filters['location'] ?? '',
                'type' => $filters['type'] ?? '',
                'view' => $filters['view'] ?? '',
                'amenity' => $filters['amenity'] ?? '',
                'min_price' => $filters['min_price'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'rating' => $filters['rating'] ?? '',
                'availability' => isset($filters['availability']) ? (string) (int) $filters['availability'] : '',
                'check_in' => $filters['check_in'] ?? '',
                'check_out' => $filters['check_out'] ?? '',
                'guests' => $filters['guests'] ?? 2,
                'sort' => $filters['sort'] ?? 'featured',
            ],
            'meta' => [
                'room_types' => Room::query()->select('type')->distinct()->orderBy('type')->pluck('type')->values(),
                'locations' => Room::query()
                    ->whereNotNull('floor')
                    ->select('floor')
                    ->distinct()
                    ->orderBy('floor')
                    ->pluck('floor')
                    ->values(),
                'views' => Room::query()
                    ->whereNotNull('view')
                    ->select('view')
                    ->distinct()
                    ->orderBy('view')
                    ->pluck('view')
                    ->values(),
                'amenities' => Room::query()
                    ->pluck('amenities')
                    ->flatten()
                    ->filter()
                    ->unique()
                    ->sort()
                    ->values(),
                'price_range' => [
                    'min' => (float) Room::min('price'),
                    'max' => (float) Room::max('price'),
                ],
                'result_count' => $rooms->count(),
            ],
        ]);
    }

    /**
     * Display a specific room and its live availability panel.
     */
    public function show(Room $room): Response
    {
        $similarRooms = Room::query()
            ->whereKeyNot($room->id)
            ->orderByDesc('featured')
            ->orderBy('price')
            ->limit(3)
            ->get();

        $availabilityPreview = collect(range(0, 13))
            ->map(function (int $offset) use ($room) {
                $day = Carbon::today()->addDays($offset);
                $nextDay = $day->copy()->addDay();

                return [
                    'date' => $day->toDateString(),
                    'label' => $day->format('D d'),
                    'available' => $room->isAvailableFor($day->toDateString(), $nextDay->toDateString()),
                ];
            })
            ->values();

        return Inertia::render('rooms/show', [
            'room' => (new RoomResource($room))->resolve(),
            'similarRooms' => RoomResource::collection($similarRooms)->resolve(),
            'availabilityPreview' => $availabilityPreview,
        ]);
    }
}
