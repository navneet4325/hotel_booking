import { Head } from '@inertiajs/react';
import { experienceMoments } from '@/data/site-content';

export default function ExperiencesPage() {
    return (
        <>
            <Head title="Experiences" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                    Experiences
                </p>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold text-slate-950 dark:text-white">
                    Spa, pool, concierge, nightlife, and slow-luxury rituals designed like a real destination hotel.
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                    This page extends the brand beyond rooms, which is what makes hotel sites feel real. Guests can see the property lifestyle, not just booking cards.
                </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                {experienceMoments.map((item) => (
                    <article key={item.title} className="glass-panel overflow-hidden rounded-[2rem]">
                        <div className="grid lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
                            <img src={item.image} alt={item.title} className="h-full min-h-72 w-full object-cover" />
                            <div className="p-6 sm:p-8">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    Signature moment
                                </p>
                                <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    {item.title}
                                </h2>
                                <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </>
    );
}
