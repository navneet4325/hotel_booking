import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Orbit } from 'lucide-react';
import PanoramaViewer from '@/components/panorama-viewer';
import { tourScenes, virtualTourMedia } from '@/data/site-content';

export default function VirtualTourPage() {
    return (
        <>
            <Head title="Virtual Tour" />

            <section className="glass-panel rounded-[2.8rem] p-7 sm:p-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,0.95fr)]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-slate-500 dark:text-slate-300">
                            Virtual tour
                        </p>
                        <h1 className="mt-5 font-display text-5xl font-semibold text-slate-950 dark:text-white">
                            Explore rooms with an interactive 360-style drag experience.
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300">
                            This page gives the website a real hospitality feel: panoramic room exploration, immersive visuals, and rich media sections that help users understand the stay before booking.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {tourScenes.slice(0, 2).map((scene) => (
                            <div key={scene.id} className="glass-panel rounded-[1.8rem] overflow-hidden">
                                <img src={scene.image} alt={scene.title} className="h-64 w-full object-cover" />
                                <div className="p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                                        Panorama scene
                                    </p>
                                    <p className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                                        {scene.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PanoramaViewer scenes={tourScenes} />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="glass-panel rounded-[2rem] p-6">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                        <Orbit className="h-4 w-4" />
                        Supplemental media
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        Public 360 reference video
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Alongside the custom drag panorama, this page includes embedded public 360-style hospitality media to make the experience feel closer to a polished live hotel website.
                    </p>
                    <div className="mt-6 overflow-hidden rounded-[1.8rem] aspect-video">
                        <iframe
                            src={virtualTourMedia[1].embedUrl}
                            title={virtualTourMedia[1].title}
                            className="h-full w-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="glass-panel rounded-[2rem] p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                        Continue journey
                    </p>
                    <h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        After the tour, move directly into the stay pages.
                    </h2>
                    <div className="mt-6 space-y-3">
                        <Link
                            href="/rooms"
                            className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                        >
                            Browse rooms
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/gallery"
                            className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                        >
                            Open photo gallery
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/offers"
                            className="flex items-center justify-between rounded-[1.6rem] border border-white/50 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
                        >
                            Check offers
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
