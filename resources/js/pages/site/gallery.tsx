import { Head, Link } from '@inertiajs/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { featuredVideos, immersiveGallery } from '@/data/site-content';

export default function GalleryPage() {
    return (
        <>
            <Head title="Gallery" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                            Gallery
                        </p>
                        <h1 className="mt-5 font-display text-5xl font-semibold text-slate-950 dark:text-white">
                            A real hotel-style visual story across suites, rituals, and social spaces.
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                            This page is built as an editorial media wall, with large photography, embedded motion, and layered room imagery that feels closer to a hospitality brand site than a standard booking portal.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/virtual-tour"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                            >
                                Open virtual tour
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/rooms"
                                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                            >
                                View rooms
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {immersiveGallery.slice(0, 4).map((item) => (
                            <div key={item.title} className="overflow-hidden rounded-[1.8rem]">
                                <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
                {immersiveGallery.map((item, index) => (
                    <article key={item.title} className="glass-panel mb-6 break-inside-avoid rounded-[2rem] overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full object-cover ${index % 3 === 0 ? 'h-[24rem]' : index % 3 === 1 ? 'h-[18rem]' : 'h-[21rem]'}`}
                        />
                        <div className="p-5">
                            <p className="text-xs uppercase tracking-[0.26em] text-slate-500 dark:text-slate-300">
                                {item.category}
                            </p>
                            <h2 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                {item.title}
                            </h2>
                        </div>
                    </article>
                ))}
            </section>

            <section className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        Video gallery
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                        Embedded hotel reels and room mood films
                    </h2>
                </div>
                <div className="grid gap-6 xl:grid-cols-3">
                    {featuredVideos.map((video) => (
                        <div key={video.title} className="glass-panel rounded-[2rem] p-5">
                            <div className={`overflow-hidden rounded-[1.6rem] ${video.aspect}`}>
                                <iframe
                                    src={video.embedUrl}
                                    title={video.title}
                                    className="h-full w-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="mt-4">
                                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                    <PlayCircle className="h-4 w-4" />
                                    {video.provider}
                                </div>
                                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                    {video.title}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {video.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
