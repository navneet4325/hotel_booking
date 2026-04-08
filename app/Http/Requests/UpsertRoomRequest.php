<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $room = $this->route('room');
        $roomId = $room?->id;

        return [
            'room_number' => ['required', 'string', 'max:50', Rule::unique('rooms', 'room_number')->ignore($roomId)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('rooms', 'slug')->ignore($roomId)],
            'type' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'availability' => ['required', 'boolean'],
            'rating' => ['required', 'numeric', 'min:0', 'max:5'],
            'size' => ['required', 'integer', 'min:150', 'max:4000'],
            'beds' => ['required', 'integer', 'min:1', 'max:8'],
            'bathrooms' => ['required', 'integer', 'min:1', 'max:6'],
            'capacity' => ['required', 'integer', 'min:1', 'max:10'],
            'floor' => ['nullable', 'string', 'max:255'],
            'view' => ['nullable', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'url'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['nullable', 'url'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['nullable', 'string', 'max:120'],
            'featured' => ['required', 'boolean'],
        ];
    }
}
