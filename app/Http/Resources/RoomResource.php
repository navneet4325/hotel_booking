<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Room
 */
class RoomResource extends JsonResource
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
            'slug' => $this->slug,
            'room_number' => $this->room_number,
            'type' => $this->type,
            'price' => (float) $this->price,
            'availability' => (bool) $this->availability,
            'rating' => (float) $this->rating,
            'size' => $this->size,
            'beds' => $this->beds,
            'bathrooms' => $this->bathrooms,
            'capacity' => $this->capacity,
            'floor' => $this->floor,
            'view' => $this->view,
            'location' => implode(' · ', array_filter([$this->floor, 'Oceanfront District'])),
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image' => $this->image,
            'gallery' => $this->gallery ?? [],
            'amenities' => $this->amenities ?? [],
            'featured' => (bool) $this->featured,
        ];
    }
}
