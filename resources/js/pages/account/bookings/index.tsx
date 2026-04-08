import { Head, Link } from '@inertiajs/react';
import { CreditCard, ReceiptText, XCircle } from 'lucide-react';
import StatusPill from '@/components/status-pill';
import { formatCurrency, formatDate, formatStayRange, paymentMethodLabel } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    bookings: Booking[];
};

export default function BookingHistory({ bookings }: Props) {
    return (
        <>
            <Head title="Booking history" />

            <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                    Booking history
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                    Track confirmation, payments, and cancellations.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Every reservation includes dates, payment status, and quick actions to retry checkout or cancel where available.
                </p>

                <div className="mt-8 space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="neo-panel rounded-[1.9rem] px-5 py-5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        {booking.booking_reference}
                                    </p>
                                    <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {booking.room?.type}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {formatStayRange(booking)} · {booking.guests} guests · Booked on {formatDate(booking.created_at)}
                                    </p>
                                    {booking.payment && (
                                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                                            {paymentMethodLabel(booking.payment)}
                                            {booking.payment.transaction_id ? ` · ${booking.payment.transaction_id}` : ''}
                                        </p>
                                    )}
                                    {booking.special_requests && (
                                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                                            Special requests: {booking.special_requests}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-start gap-3 xl:items-end">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusPill status={booking.status} />
                                        <StatusPill status={booking.payment_status} />
                                    </div>
                                    <p className="text-lg font-semibold text-slate-950 dark:text-white">
                                        {formatCurrency(booking.total_price)}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {booking.status === 'confirmed' && (
                                            <Link
                                                href={`/bookings/${booking.id}/confirmation`}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-[color:var(--brand-primary)] dark:border-white/10 dark:bg-white/5 dark:text-white"
                                            >
                                                <ReceiptText className="h-4 w-4" />
                                                Confirmation
                                            </Link>
                                        )}
                                        {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                                            <Link
                                                href={`/bookings/${booking.id}/checkout`}
                                                method="post"
                                                as="button"
                                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                Retry payment
                                            </Link>
                                        )}
                                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                            <Link
                                                href={`/bookings/${booking.id}/cancel`}
                                                method="post"
                                                as="button"
                                                className="inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 transition hover:-translate-y-0.5 dark:border-rose-300/20 dark:bg-rose-500/10 dark:text-rose-200"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Cancel booking
                                            </Link>
                                        )}
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
