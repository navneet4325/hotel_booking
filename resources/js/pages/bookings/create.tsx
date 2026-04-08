import { Head, Link, router, usePage } from '@inertiajs/react';
import { CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { startTransition, useEffect, useEffectEvent, useState } from 'react';
import StatusPill from '@/components/status-pill';
import { availabilityLabel, formatCurrency } from '@/lib/hotel';
import type { AvailabilitySummary, Room, User } from '@/types';

type Props = {
    room: Room;
    defaults: {
        check_in: string;
        check_out: string;
        guests: number;
    };
    initialSummary?: AvailabilitySummary | null;
};

export default function BookingCreate({ room, defaults, initialSummary = null }: Props) {
    const user = usePage().props.auth.user as User | null;
    const [checkIn, setCheckIn] = useState(defaults.check_in);
    const [checkOut, setCheckOut] = useState(defaults.check_out);
    const [guests, setGuests] = useState(String(defaults.guests));
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');
    const [summary, setSummary] = useState<AvailabilitySummary | null>(initialSummary);
    const [checking, setChecking] = useState(false);
    const displayCurrency = paymentMethod === 'razorpay' ? 'INR' : 'USD';

    const refreshSummary = useEffectEvent(async (nextCheckIn: string, nextCheckOut: string) => {
        setChecking(true);

        try {
            const response = await fetch(
                `/api/v1/availability?room_id=${room.id}&check_in=${nextCheckIn}&check_out=${nextCheckOut}`,
            );
            const payload = (await response.json()) as AvailabilitySummary;
            startTransition(() => setSummary(payload));
        } finally {
            setChecking(false);
        }
    });

    useEffect(() => {
        if (!checkIn || !checkOut) {
            setSummary(null);

            return;
        }

        refreshSummary(checkIn, checkOut);
    }, [checkIn, checkOut]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            router.visit('/login');

            return;
        }

        router.post('/bookings', {
            room_id: room.id,
            check_in: checkIn,
            check_out: checkOut,
            guests: Number(guests),
            special_requests: notes,
            payment_method: paymentMethod,
        });
    };

    return (
        <>
            <Head title={`Book ${room.type}`} />

            <section className="grid gap-8 xl:grid-cols-[1.08fr_minmax(0,0.92fr)]">
                <div className="rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-10">
                    <p className="text-xs uppercase tracking-[0.32em] text-blue-400 font-bold">Guided checkout</p>
                    <h1 className="mt-4 font-display text-4xl font-bold text-blue-900">Complete your reservation</h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-blue-900/80">Review dates, set guest details, and choose your payment route before the system checks availability one more time.</p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 text-sm text-blue-900 font-medium shadow">
                            <p className="text-xs uppercase tracking-[0.24em] text-blue-400 font-bold">Room</p>
                            <p className="mt-3 font-display text-2xl text-blue-900 font-bold">{room.room_number}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 text-sm text-blue-900 font-medium shadow">
                            <p className="text-xs uppercase tracking-[0.24em] text-blue-400 font-bold">Nightly rate</p>
                            <p className="mt-3 font-display text-2xl text-blue-900 font-bold">{formatCurrency(room.price, displayCurrency)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 text-sm text-blue-900 font-medium shadow">
                            <p className="text-xs uppercase tracking-[0.24em] text-blue-400 font-bold">Capacity</p>
                            <p className="mt-3 font-display text-2xl text-blue-900 font-bold">{room.capacity} guests</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2 text-sm text-blue-900 font-medium">
                                Check in
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(event) => setCheckIn(event.target.value)}
                                    className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                    required
                                />
                            </label>
                            <label className="grid gap-2 text-sm text-blue-900 font-medium">
                                Check out
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(event) => setCheckOut(event.target.value)}
                                    className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                    required
                                />
                            </label>
                        </div>
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Guests
                            <input
                                type="number"
                                min={1}
                                max={room.capacity}
                                value={guests}
                                onChange={(event) => setGuests(event.target.value)}
                                className="h-12 rounded-xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-blue-900 font-medium">
                            Trip notes
                            <textarea
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                className="min-h-28 rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 text-base"
                                placeholder="Arrival timing, celebration setup, airport transfer, or anything your host team should know."
                            />
                        </label>

                        <div>
                            <p className="text-base font-semibold text-blue-900">Payment method</p>
                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('razorpay')}
                                    className={`rounded-2xl border p-4 text-left transition font-semibold flex items-center gap-3 ${
                                        paymentMethod === 'razorpay'
                                            ? 'border-blue-500 bg-blue-100/60 shadow-lg'
                                            : 'border-blue-200 bg-white hover:bg-blue-50'
                                    }`}
                                >
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                    <span>Razorpay <span className="block text-xs font-normal text-blue-400">Test-mode ready checkout for India</span></span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`rounded-2xl border p-4 text-left transition font-semibold flex items-center gap-3 ${
                                        paymentMethod === 'stripe'
                                            ? 'border-yellow-500 bg-yellow-100/60 shadow-lg'
                                            : 'border-blue-200 bg-white hover:bg-yellow-50'
                                    }`}
                                >
                                    <CreditCard className="h-5 w-5 text-yellow-500" />
                                    <span>Stripe <span className="block text-xs font-normal text-blue-400">Card-based fallback for international demo</span></span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2">
                            <button
                                type="submit"
                                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow transition-all px-8"
                            >
                                Continue to secure payment
                            </button>
                            <Link
                                href={`/rooms/${room.slug}`}
                                className="h-12 rounded-xl border border-blue-200 bg-white text-blue-700 font-semibold text-base shadow hover:bg-blue-50 transition-all flex items-center justify-center px-8"
                            >
                                Back to room details
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="grid gap-6">
                    <div className="glass-panel rounded-[2.7rem] p-6">
                        <img
                            src={room.gallery[0] || room.image || ''}
                            alt={room.type}
                            className="h-72 w-full rounded-4xl object-cover"
                        />
                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                    Booking summary
                                </p>
                                <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    {room.type}
                                </h2>
                            </div>
                            <StatusPill status={room.view || 'signature'} />
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="neo-panel rounded-[1.6rem] p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                                    Availability
                                </p>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                    {checking ? 'Refreshing stay total...' : availabilityLabel(summary)}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Nights
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {summary?.nights ?? 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                            Estimated total
                                        </p>
                                        <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                                            {formatCurrency(summary?.total_price ?? room.price, displayCurrency)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {(room.gallery.slice(1, 3).length ? room.gallery.slice(1, 3) : [room.image, room.image]).map((image, index) =>
                                    image ? (
                                        <img
                                            key={`${image}-${index}`}
                                            src={image}
                                            alt={`${room.type} detail ${index + 1}`}
                                            className="h-36 w-full rounded-[1.6rem] object-cover"
                                        />
                                    ) : null,
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="neo-panel rounded-4xl p-5">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <div>
                                <p className="font-medium text-slate-950 dark:text-white">
                                    Secure reservation pipeline
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-300">
                                    Validation, availability checks, authenticated booking, and payment status tracking run through Laravel.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="neo-panel rounded-4xl p-5">
                        <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5 text-cyan-500" />
                            <div>
                                <p className="font-medium text-slate-950 dark:text-white">
                                    Razorpay and Stripe ready
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-300">
                                    Choose Razorpay for India-focused test checkout or keep Stripe for card-based demo payment flow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
