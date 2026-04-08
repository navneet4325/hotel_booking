<?php

namespace App\Models;

use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'room_number',
        'slug',
        'type',
        'price',
        'availability',
        'rating',
        'size',
        'beds',
        'bathrooms',
        'capacity',
        'floor',
        'view',
        'short_description',
        'description',
        'image',
        'gallery',
        'amenities',
        'featured',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'rating' => 'decimal:1',
            'gallery' => 'array',
            'amenities' => 'array',
            'availability' => 'boolean',
            'featured' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeSearch(Builder $query, array $filters): void
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $type = trim((string) ($filters['type'] ?? ''));
        $minPrice = $filters['min_price'] ?? null;
        $maxPrice = $filters['max_price'] ?? null;
        $rating = $filters['rating'] ?? null;

        $query
            ->when($search !== '', function (Builder $builder) use ($search) {
                $builder->where(function (Builder $nested) use ($search) {
                    $nested
                        ->where('type', 'like', "%{$search}%")
                        ->orWhere('room_number', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('floor', 'like', "%{$search}%")
                        ->orWhere('view', 'like', "%{$search}%");
                });
            })
            ->when($type !== '', fn (Builder $builder) => $builder->where('type', $type))
            ->when(is_numeric($minPrice), fn (Builder $builder) => $builder->where('price', '>=', (float) $minPrice))
            ->when(is_numeric($maxPrice), fn (Builder $builder) => $builder->where('price', '<=', (float) $maxPrice))
            ->when(is_numeric($rating), fn (Builder $builder) => $builder->where('rating', '>=', (float) $rating));
    }

    public function scopeAvailableBetween(Builder $query, string $checkIn, string $checkOut): void
    {
        $query
            ->where('availability', true)
            ->whereDoesntHave('bookings', function (Builder $builder) use ($checkIn, $checkOut) {
                $builder
                    ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
                    ->whereDate('check_in', '<', $checkOut)
                    ->whereDate('check_out', '>', $checkIn);
            });
    }

    public function isAvailableFor(string $checkIn, string $checkOut, ?int $ignoreBookingId = null): bool
    {
        if (! $this->availability) {
            return false;
        }

        return ! $this->bookings()
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->when($ignoreBookingId, fn (Builder $builder) => $builder->whereKeyNot($ignoreBookingId))
            ->whereDate('check_in', '<', $checkOut)
            ->whereDate('check_out', '>', $checkIn)
            ->exists();
    }

    public function nightsFor(string $checkIn, string $checkOut): int
    {
        return max(1, Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut)));
    }
}
