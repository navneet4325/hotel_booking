import { Head, router } from '@inertiajs/react';
import StatusPill from '@/components/status-pill';
import { formatCurrency, formatStayRange } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    bookings: Booking[];
    filters: {
        status: string;
        search: string;
    };
};

export default function AdminBookings({ bookings, filters }: Props) {
    const updateBooking = (booking: Booking, status: string, paymentStatus = booking.payment_status) => {
        router.put(`/admin/bookings/${booking.id}`, {
            status,
            payment_status: paymentStatus,
        });
    };

    return (
        <>
            <Head title="Manage bookings" />

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                            Booking operations
                        </p>
                        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            Update reservation states and payment progress.
                        </h1>
                    </div>
                    <form action="/admin/bookings" method="get" className="grid gap-3 sm:grid-cols-2">
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Search guest, room, or reference"
                            className="h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/6"
                        />
                        <select
                            name="status"
                            defaultValue={filters.status}
                            className="h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/6"
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </form>
                </div>

                <div className="mt-8 space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="neo-panel rounded-[1.85rem] px-5 py-5">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        {booking.booking_reference}
                                    </p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {booking.user?.name}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {booking.room?.type} · {formatStayRange(booking)} · {booking.guests} guests
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-4 xl:items-end">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusPill status={booking.status} />
                                        <StatusPill status={booking.payment_status} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {formatCurrency(booking.total_price)}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateBooking(booking, 'confirmed', booking.payment_status === 'pending' ? 'paid' : booking.payment_status)}
                                            className="rounded-full border border-cyan-300/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateBooking(booking, 'completed', 'paid')}
                                            className="rounded-full border border-emerald-300/60 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:-translate-y-0.5 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateBooking(booking, 'cancelled', booking.payment_status === 'paid' ? 'refunded' : 'failed')}
                                            className="rounded-full border border-rose-300/60 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 transition hover:-translate-y-0.5 dark:border-rose-300/20 dark:bg-rose-500/10 dark:text-rose-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
