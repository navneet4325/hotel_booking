<?php

use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/rooms', [RoomController::class, 'index'])->name('api.rooms.index');
    Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('api.rooms.show');
    Route::match(['get', 'post'], '/availability', [AvailabilityController::class, 'show'])->name('api.availability.show');
});
