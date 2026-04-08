import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, MapPin, Sparkles } from 'lucide-react';
import {
    aboutPillars,
    contactDetails,
    heroMedia,
    immersiveGallery,
    teamMembers,
} from '@/data/site-content';

export default function AboutPage() {
    return (
        <>
            <Head title="About" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                            About AetherStay
                        </p>
                        <h1 className="mt-5 font-display text-5xl font-semibold text-slate-950 dark:text-white">
                            A premium hotel brand built around visual confidence, calm booking, and modern hospitality.
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                            This experience is designed to feel like a real commercial hotel website: immersive room discovery, design-led storytelling, and a booking flow that stays elegant from search to confirmation.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <Building2 className="h-5 w-5 text-cyan-500" />
                                <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    72 keys
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Boutique-scale inventory with suite-first positioning.
                                </p>
                            </div>
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    4.9/5
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Guest satisfaction across design, dining, and stay comfort.
                                </p>
                            </div>
                            <div className="neo-panel rounded-[1.7rem] p-4">
                                <MapPin className="h-5 w-5 text-rose-500" />
                                <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    Marina front
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Steps from the waterfront, nightlife, and cultural district.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <img src={heroMedia[2]} alt="AetherStay exterior mood" className="h-72 w-full rounded-[2rem] object-cover sm:h-full" />
                        <div className="grid gap-4">
                            <img src={heroMedia[3]} alt="AetherStay suite entrance" className="h-36 w-full rounded-[2rem] object-cover" />
                            <img src={immersiveGallery[0].image} alt="AetherStay gallery moment" className="h-36 w-full rounded-[2rem] object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                {aboutPillars.map((pillar) => (
                    <article key={pillar.title} className="glass-panel rounded-[2rem] p-6">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                            Brand pillar
                        </p>
                        <h2 className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                            {pillar.title}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {pillar.description}
                        </p>
                    </article>
                ))}
            </section>

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-9">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Leadership and service
                        </p>
                        <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                            The people shaping the stay experience
                        </h2>
                    </div>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                    >
                        Speak with concierge
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    {teamMembers.map((member) => (
                        <article key={member.name} className="neo-panel overflow-hidden rounded-[2rem]">
                            <img src={member.image} alt={member.name} className="h-72 w-full object-cover" />
                            <div className="p-5">
                                <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    {member.role}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
                <div className="glass-panel rounded-[2.5rem] p-7">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Property location
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Set along the marina, close to city culture and waterfront nights
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {contactDetails.address}
                    </p>
                    <div className="mt-6 overflow-hidden rounded-[2rem]">
                        <iframe
                            title="AetherStay map"
                            src="https://www.google.com/maps?q=27%20Horizon%20Marina%20Drive%20Miami&output=embed"
                            className="h-80 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="glass-panel rounded-[2.5rem] p-7">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                            Stay planning
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                            Ready to turn the story into a reservation?
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Browse signature rooms, compare rates, and step into a real booking flow with live availability.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/rooms"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                            >
                                Explore rooms
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/reviews"
                                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                Read guest reviews
                            </Link>
                        </div>
                    </div>
                    <img src={immersiveGallery[4].image} alt="AetherStay social suite" className="h-80 w-full rounded-[2.5rem] object-cover" />
                </div>
            </section>
        </>
    );
}
