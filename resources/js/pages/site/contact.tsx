import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { contactDetails, contactFaq, heroMedia } from '@/data/site-content';

export default function ContactPage() {
    return (
        <>
            <Head title="Contact" />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
                    <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                        Contact
                    </p>
                    <h1 className="mt-5 font-display text-5xl font-semibold text-slate-950 dark:text-white">
                        Reservations and concierge planning in one polished contact page.
                    </h1>
                    <div className="mt-8 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        <p><strong className="text-slate-950 dark:text-white">Phone:</strong> {contactDetails.phone}</p>
                        <p><strong className="text-slate-950 dark:text-white">Email:</strong> {contactDetails.email}</p>
                        <p><strong className="text-slate-950 dark:text-white">Address:</strong> {contactDetails.address}</p>
                    </div>
                    <div className="mt-8 grid gap-4">
                        <input
                            placeholder="Full name"
                            className="h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/6"
                        />
                        <input
                            placeholder="Email address"
                            className="h-12 rounded-2xl border border-white/60 bg-white/80 px-4 text-sm outline-none dark:border-white/10 dark:bg-white/6"
                        />
                        <textarea
                            placeholder="Tell us the dates, room style, guests, or celebration details."
                            className="min-h-36 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/6"
                        />
                        <button
                            type="button"
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                        >
                            Send inquiry
                        </button>
                    </div>
                </div>

                <div className="glass-panel overflow-hidden rounded-[2.5rem]">
                    <img src={heroMedia[3]} alt="Hotel entrance" className="h-[26rem] w-full object-cover" />
                    <div className="p-7">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Planning links
                        </p>
                        <div className="mt-6 space-y-3">
                            <Link
                                href="/rooms"
                                className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                            >
                                Browse available rooms
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/offers"
                                className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                            >
                                Explore current offers
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/virtual-tour"
                                className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                            >
                                Open virtual tour
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass-panel rounded-[2rem] p-7">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                    FAQs
                </p>
                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_minmax(0,0.95fr)]">
                    <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
                        {contactFaq.map((item) => (
                            <article key={item.question} className="neo-panel rounded-[1.6rem] px-5 py-5">
                                <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {item.question}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {item.answer}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 dark:border-white/10 dark:bg-white/8">
                        <iframe
                            title="AetherStay contact map"
                            src="https://www.google.com/maps?q=27%20Horizon%20Marina%20Drive%20Miami&output=embed"
                            className="h-full min-h-80 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
