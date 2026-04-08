import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { offerCollections } from '@/data/site-content';

export default function OffersPage() {
    return (
        <>
            <Head title="Offers" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                    Offers
                </p>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold text-slate-950 dark:text-white">
                    Rate-led, wellness, and executive offers presented like a real booking campaign site.
                </h1>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                {offerCollections.map((offer) => (
                    <article key={offer.title} className="glass-panel overflow-hidden rounded-[2rem]">
                        <img src={offer.image} alt={offer.title} className="h-72 w-full object-cover" />
                        <div className="p-6">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">
                                {offer.badge}
                            </p>
                            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                {offer.title}
                            </h2>
                            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                                {offer.description}
                            </p>
                            <Link
                                href="/rooms"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                            >
                                Match this offer to a room
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}
            </section>
        </>
    );
}
