<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display customers and their reservation value.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $customers = User::query()
            ->where('role', 'customer')
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->withCount('bookings')
            ->withSum([
                'bookings as total_spend' => fn ($query) => $query->where('payment_status', Booking::PAYMENT_PAID),
            ], 'total_price')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/customers/index', [
            'customers' => CustomerResource::collection($customers)->resolve(),
            'search' => $search,
        ]);
    }
}
