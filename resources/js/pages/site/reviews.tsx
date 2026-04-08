import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { guestReviews, heroMedia } from '@/data/site-content';

export default function ReviewsPage() {
    return (
        <>
            <Head title="Reviews" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,0.8fr)]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                            Guest reviews
                        </p>
                        <h1 className="mt-5 font-display text-5xl font-semibold text-slate-950 dark:text-white">
                            Real guest-style feedback presented like a modern hotel platform.
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                            Ratings, stay stories, and visual confidence are a big part of how people decide to book. This page gives the site a more complete, trusted, commercial travel feel.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    Overall score
                                </p>
                                <p className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    4.9 / 5
                                </p>
                            </div>
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    Verified stays
                                </p>
                                <p className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    1.2k+
                                </p>
                            </div>
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    Recommend rate
                                </p>
                                <p className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    96%
                                </p>
                            </div>
                        </div>
                    </div>

                    <img src={heroMedia[1]} alt="Guest review hero" className="h-full min-h-80 w-full rounded-[2.2rem] object-cover" />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                {guestReviews.map((review) => (
                    <article key={review.author} className="glass-panel rounded-[2rem] p-6">
                        <div className="flex items-start gap-4">
                            <img src={review.avatar} alt={review.author} className="h-14 w-14 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                            {review.author}
                                        </h2>
                                        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                                            {review.location}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                                        <Star className="h-4 w-4 fill-current text-amber-500" />
                                        {review.rating}.0
                                    </div>
                                </div>
                                <h3 className="mt-5 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                    {review.title}
                                </h3>
                                <div className="mt-4 flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <Quote className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                                    <p className="text-sm leading-8">{review.review}</p>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-9">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Continue the journey
                        </p>
                        <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            Explore rooms, offers, and the immersive media experience
                        </h2>
                    </div>
                    <Link
                        href="/rooms"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                    >
                        View stays
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <Link href="/rooms" className="neo-panel rounded-[1.8rem] p-5 transition hover:-translate-y-0.5">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Stay
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                            Browse rooms
                        </h3>
                    </Link>
                    <Link href="/offers" className="neo-panel rounded-[1.8rem] p-5 transition hover:-translate-y-0.5">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Offers
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                            Seasonal packages
                        </h3>
                    </Link>
                    <Link href="/virtual-tour" className="neo-panel rounded-[1.8rem] p-5 transition hover:-translate-y-0.5">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                            Tour
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                            Open 360 preview
                        </h3>
                    </Link>
                </div>
            </section>
        </>
    );
}
