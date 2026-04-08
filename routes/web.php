<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CalendarController as AdminCalendarController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\RoomController as AdminRoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RoomController;
use App\Models\Room;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');
Route::inertia('/about', 'site/about')->name('site.about');
Route::inertia('/gallery', 'site/gallery')->name('site.gallery');
Route::inertia('/virtual-tour', 'site/virtual-tour')->name('site.virtual-tour');
Route::inertia('/experiences', 'site/experiences')->name('site.experiences');
Route::inertia('/dining', 'site/dining')->name('site.dining');
Route::inertia('/offers', 'site/offers')->name('site.offers');
Route::inertia('/reviews', 'site/reviews')->name('site.reviews');
Route::inertia('/contact', 'site/contact')->name('site.contact');
Route::get('/sitemap.xml', function () {
    $baseUrl = rtrim((string) config('app.url'), '/');

    $staticPaths = collect([
        '/',
        '/rooms',
        '/about',
        '/gallery',
        '/virtual-tour',
        '/experiences',
        '/dining',
        '/offers',
        '/reviews',
        '/contact',
    ])->map(fn (string $path) => [
        'loc' => $baseUrl.$path,
        'lastmod' => now()->toDateString(),
    ]);

    $roomUrls = Room::query()
        ->where('availability', true)
        ->select(['slug', 'updated_at'])
        ->get()
        ->map(fn (Room $room) => [
            'loc' => $baseUrl.'/rooms/'.$room->slug,
            'lastmod' => optional($room->updated_at)->toDateString() ?? now()->toDateString(),
        ]);

    return response()
        ->view('sitemap', ['urls' => $staticPaths->merge($roomUrls)])
        ->header('Content-Type', 'application/xml');
})->name('sitemap');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return auth()->user()?->isAdmin()
            ? to_route('admin.dashboard')
            : to_route('account.dashboard');
    })->name('dashboard');

    Route::get('/account', AccountController::class)->name('account.dashboard');
    Route::get('/account/bookings', [BookingController::class, 'index'])->name('account.bookings');
    Route::get('/bookings/create/{room}', [BookingController::class, 'create'])->name('bookings.create');
    Route::get('/bookings/{booking}/confirmation', [BookingController::class, 'confirmation'])->name('bookings.confirmation');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    Route::post('/bookings/{booking}/checkout', [PaymentController::class, 'checkout'])->name('payments.checkout');
    Route::get('/payments/{booking}/success', [PaymentController::class, 'success'])->name('payments.success');
    Route::post('/payments/{booking}/success/confirm', [PaymentController::class, 'confirmSuccess'])->name('payments.success.confirm');
    Route::get('/payments/{booking}/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
    Route::post('/payments/{booking}/cancel/confirm', [PaymentController::class, 'confirmCancel'])->name('payments.cancel.confirm');
    Route::get('/payments/{booking}/razorpay', [PaymentController::class, 'showRazorpay'])->name('payments.razorpay.show');
    Route::post('/payments/{booking}/razorpay/verify', [PaymentController::class, 'verifyRazorpay'])->name('payments.razorpay.verify');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::get('/rooms', [AdminRoomController::class, 'index'])->name('rooms.index');
    Route::post('/rooms', [AdminRoomController::class, 'store'])->name('rooms.store');
    Route::put('/rooms/{room}', [AdminRoomController::class, 'update'])->name('rooms.update');
    Route::delete('/rooms/{room}', [AdminRoomController::class, 'destroy'])->name('rooms.destroy');

    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::put('/bookings/{booking}', [AdminBookingController::class, 'update'])->name('bookings.update');

    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('/calendar', [AdminCalendarController::class, 'index'])->name('calendar.index');
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/settings.php';
