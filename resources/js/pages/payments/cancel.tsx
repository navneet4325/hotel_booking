import { Link, router } from '@inertiajs/react';
import { AlertCircle, XCircle } from 'lucide-react';
import SeoHead from '@/components/seo-head';
import { formatCurrency } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
    confirmUrl: string;
};

export default function PaymentCancel({ booking, confirmUrl }: Props) {
    return (
        <>
            <SeoHead
                title="Payment Cancelled"
                description="This booking payment was cancelled before completion."
                path={`/payments/${booking.id}/cancel`}
                image={booking.room?.image || booking.room?.gallery?.[0] || undefined}
                noindex
            />

            <section className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2.6rem] p-7 sm:p-9">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/12 text-rose-600 dark:bg-rose-400/12 dark:text-rose-300">
                        <XCircle className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Checkout cancelled
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Your booking is still pending payment
                    </h1>
                    <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                        No payment was confirmed for this reservation. You can mark this attempt as cancelled and retry securely from your booking history.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => router.post(confirmUrl)}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                        >
                            Confirm cancellation
                        </button>
                        <Link
                            href="/account/bookings"
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/50 bg-white/70 px-5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            Back to bookings
                        </Link>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.6rem] p-6">
                    <img
                        src={booking.room?.image || booking.room?.gallery?.[0] || ''}
                        alt={booking.room?.type || 'Booking room'}
                        className="h-64 w-full rounded-[1.8rem] object-cover"
                    />
                    <div className="mt-6 space-y-4">
                        <div className="neo-panel rounded-[1.6rem] p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Booking reference
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {booking.booking_reference}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.6rem] p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Pending amount
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {formatCurrency(booking.total_price)}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.6rem] p-4">
                            <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                You can retry payment anytime from booking history
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
