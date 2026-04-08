import { Head, Link } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, CreditCard, MapPin, ReceiptText } from 'lucide-react';
import { formatCurrency, formatDate, paymentMethodLabel, roomLocation } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
};

export default function BookingConfirmation({ booking }: Props) {
    return (
        <>
            <Head title="Booking Confirmation" />

            <section className="grid gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-400/12 dark:text-emerald-300">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                        Booking confirmed
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Your reservation is secured and ready.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                        Payment has been recorded and the stay is now confirmed. Use this page as your quick confirmation summary before arrival.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="neo-panel rounded-[1.8rem] p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Booking reference
                            </p>
                            <p className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                {booking.booking_reference}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.8rem] p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Total paid
                            </p>
                            <p className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                {formatCurrency(booking.total_price)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/account/bookings"
                            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary)] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                        >
                            View my bookings
                        </Link>
                        <Link
                            href={`/rooms/${booking.room?.slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            View room details
                        </Link>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-6">
                    <img
                        src={booking.room?.image || booking.room?.gallery?.[0] || ''}
                        alt={booking.room?.type || 'Booked room'}
                        className="h-64 w-full rounded-[1.8rem] object-cover"
                    />
                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Hotel and room
                            </p>
                            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                {booking.room?.type}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {booking.room ? roomLocation(booking.room) : 'Oceanfront District'}
                            </p>
                        </div>

                        <div className="grid gap-3">
                            <div className="neo-panel flex items-center gap-3 rounded-[1.5rem] p-4">
                                <CalendarDays className="h-5 w-5 text-sky-500" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                                        Stay dates
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                        {formatDate(booking.check_in)} to {formatDate(booking.check_out)} · {booking.nights} nights
                                    </p>
                                </div>
                            </div>
                            <div className="neo-panel flex items-center gap-3 rounded-[1.5rem] p-4">
                                <CreditCard className="h-5 w-5 text-amber-500" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                                        Payment
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                        {paymentMethodLabel(booking.payment)}
                                    </p>
                                    {booking.payment?.transaction_id && (
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                            Transaction: {booking.payment.transaction_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="neo-panel flex items-center gap-3 rounded-[1.5rem] p-4">
                                <ReceiptText className="h-5 w-5 text-indigo-500" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                                        Guest details
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                        {booking.guests} guests · Status: {booking.status}
                                    </p>
                                </div>
                            </div>
                            <div className="neo-panel flex items-center gap-3 rounded-[1.5rem] p-4">
                                <MapPin className="h-5 w-5 text-rose-500" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                                        Property address
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                        27 Horizon Marina Drive, Oceanfront District, Miami
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
