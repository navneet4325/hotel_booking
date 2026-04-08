import { Head, router } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/hotel';
import type { Booking } from '@/types';

type Props = {
    booking: Booking;
    checkout: {
        key: string;
        order_id: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        prefill?: {
            name?: string | null;
            email?: string | null;
            contact?: string | null;
        };
        notes?: Record<string, string>;
        verify_url: string;
        cancel_url: string;
        theme?: {
            color?: string;
        };
    };
};

export default function RazorpayCheckout({ booking, checkout }: Props) {
    const [scriptReady, setScriptReady] = useState(false);
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasOpened, setHasOpened] = useState(false);

    useEffect(() => {
        if (window.Razorpay) {
            setScriptReady(true);

            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptReady(true);
        script.onerror = () => setError('Razorpay checkout script could not be loaded.');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const openCheckout = () => {
        if (!window.Razorpay) {
            setError('Razorpay checkout is not available yet.');

            return;
        }

        setOpening(true);
        setError(null);

        const instance = new window.Razorpay({
            key: checkout.key,
            amount: checkout.amount,
            currency: checkout.currency,
            name: checkout.name,
            description: checkout.description,
            order_id: checkout.order_id,
            prefill: checkout.prefill,
            notes: checkout.notes,
            theme: checkout.theme,
            modal: {
                ondismiss: () => {
                    router.visit(checkout.cancel_url);
                },
            },
            handler: (response) => {
                router.post(checkout.verify_url, response);
            },
        });

        instance.open();
        setHasOpened(true);
        setOpening(false);
    };

    useEffect(() => {
        if (scriptReady && !hasOpened && !error) {
            openCheckout();
        }
        // We intentionally exclude openCheckout to avoid re-instantiating the SDK.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scriptReady, hasOpened, error]);

    return (
        <>
            <Head title="Razorpay Checkout" />

            <section className="grid gap-6 xl:grid-cols-[1fr_minmax(0,0.88fr)]">
                <div className="glass-panel rounded-[2.8rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                        Secure checkout
                    </p>
                    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Launching your Razorpay payment window
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                        This handoff screen keeps the booking experience branded and clear before payment opens. If the modal does not appear automatically, you can launch it manually.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <Wallet className="h-5 w-5 text-cyan-500" />
                            <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                Test ready
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Built for Razorpay test-mode integration.
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                Verified
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Signature validation runs server-side before confirmation.
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                Branded
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Keeps checkout aligned with the hotel experience.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openCheckout}
                            disabled={!scriptReady || opening}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-50 dark:bg-white dark:text-slate-950"
                        >
                            {opening && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Pay with Razorpay
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit(checkout.cancel_url)}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/50 bg-white/70 px-5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                        >
                            Cancel and return
                        </button>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-[1.6rem] border border-rose-300/40 bg-rose-400/10 px-4 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:text-rose-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="glass-panel rounded-[2.8rem] p-6">
                    <img
                        src={booking.room?.image || booking.room?.gallery?.[0] || ''}
                        alt={booking.room?.type || 'Booking room'}
                        className="h-72 w-full rounded-[2rem] object-cover"
                    />
                    <div className="mt-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Reservation summary
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                            {booking.room?.type}
                        </h2>
                    </div>
                    <div className="mt-6 grid gap-4">
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Booking reference
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {booking.booking_reference}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Stay total
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {formatCurrency(booking.total_price, checkout.currency)}
                            </p>
                        </div>
                        <div className="neo-panel rounded-[1.7rem] p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                Guests and nights
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {booking.guests} guests · {booking.nights} nights
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
