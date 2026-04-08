import { Link, router } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SeoHead from '@/components/seo-head';
import { formatCurrency } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
    sessionId: string;
    isDemo: boolean;
    confirmUrl: string;
    cancelUrl: string;
};

export default function PaymentSuccess({
    booking,
    sessionId,
    isDemo,
    confirmUrl,
    cancelUrl,
}: Props) {
    const confirmationSent = useRef(false);

    useEffect(() => {
        if (confirmationSent.current) {
            return;
        }

        confirmationSent.current = true;

        router.post(confirmUrl, {
            session_id: sessionId,
            demo: isDemo ? 1 : 0,
        });
    }, [confirmUrl, isDemo, sessionId]);

    return (
        <>
            <SeoHead
                title="Confirming Payment"
                description="We are verifying your payment details and securing your reservation."
                path={`/payments/${booking.id}/success`}
                image={booking.room?.image || booking.room?.gallery?.[0] || undefined}
                noindex
            />

            <section className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[1.15fr_minmax(0,0.85fr)]">
                <div className="glass-panel rounded-[2.6rem] p-7 sm:p-9">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-400/12 dark:text-emerald-300">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Payment return detected
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Verifying your payment and locking the reservation
                    </h1>
                    <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                        Please wait while we verify provider details, amount, and booking reference. You will be redirected to your confirmation screen automatically.
                    </p>

                    <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-emerald-300/35 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-300/20 dark:text-emerald-200">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Confirming payment...
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                router.post(confirmUrl, {
                                    session_id: sessionId,
                                    demo: isDemo ? 1 : 0,
                                })
                            }
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                        >
                            Retry confirmation
                        </button>
                        <Link
                            href={cancelUrl}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/50 bg-white/70 px-5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            Payment cancel page
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
                                Reservation total
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {formatCurrency(booking.total_price)}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.6rem] p-4">
                            <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <ShieldCheck className="h-4 w-4 text-cyan-500" />
                                Session-to-booking verification enabled
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
