import { Head } from '@inertiajs/react';
import { diningSpaces, featuredVideos } from '@/data/site-content';

export default function DiningPage() {
    return (
        <>
            <Head title="Dining" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                    Dining
                </p>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold text-slate-950 dark:text-white">
                    A restaurant page, rooftop breakfast, and lounge story that make the site feel like a real hotel brand.
                </h1>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                {diningSpaces.map((space) => (
                    <article key={space.title} className="glass-panel overflow-hidden rounded-[2rem]">
                        <img src={space.image} alt={space.title} className="h-72 w-full object-cover" />
                        <div className="p-6">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                {space.subtitle}
                            </p>
                            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                                {space.title}
                            </h2>
                            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                                {space.description}
                            </p>
                        </div>
                    </article>
                ))}
            </section>

            <section className="glass-panel rounded-[2rem] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                    Dining reel
                </p>
                <div className="mt-6 overflow-hidden rounded-[1.8rem] aspect-video">
                    <iframe
                        src={featuredVideos[0].embedUrl}
                        title="Dining reel"
                        className="h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </section>
        </>
    );
}
