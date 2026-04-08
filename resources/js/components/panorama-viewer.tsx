import { ChevronLeft, ChevronRight, MousePointer2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Scene = {
    id: string;
    title: string;
    description: string;
    image: string;
    hotspotLabel: string;
};

export default function PanoramaViewer({
    scenes,
    className,
}: {
    scenes: Scene[];
    className?: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [offset, setOffset] = useState(50);
    const dragging = useRef(false);
    const lastX = useRef(0);

    const activeScene = scenes[activeIndex];

    const handleMove = (clientX: number) => {
        if (!dragging.current) {
            return;
        }

        const delta = clientX - lastX.current;
        lastX.current = clientX;
        setOffset((current) => Math.min(85, Math.max(15, current - delta * 0.05)));
    };

    useEffect(() => {
        const onMouseUp = () => {
            dragging.current = false;
        };

        const onMouseMove = (event: MouseEvent) => {
            handleMove(event.clientX);
        };

        const onTouchMove = (event: TouchEvent) => {
            if (!event.touches[0]) {
                return;
            }

            handleMove(event.touches[0].clientX);
        };

        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);
        window.addEventListener('touchmove', onTouchMove);

        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    const setScene = (nextIndex: number) => {
        setActiveIndex(nextIndex);
        setOffset(50);
    };

    const sceneSteps = useMemo(() => {
        return scenes.map((scene, index) => ({
            ...scene,
            active: index === activeIndex,
        }));
    }, [activeIndex, scenes]);

    return (
        <div className={cn('glass-panel rounded-[2.3rem] p-5', className)}>
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                        360 room tour
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                        {activeScene.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {activeScene.description}
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-white/8 dark:text-slate-200">
                    <MousePointer2 className="h-4 w-4" />
                    Drag to explore
                </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-slate-950/85">
                <div
                    className="relative h-[24rem] cursor-grab overflow-hidden md:h-[30rem]"
                    onMouseDown={(event) => {
                        dragging.current = true;
                        lastX.current = event.clientX;
                    }}
                    onTouchStart={(event) => {
                        if (!event.touches[0]) {
                            return;
                        }

                        dragging.current = true;
                        lastX.current = event.touches[0].clientX;
                    }}
                >
                    <div
                        className="absolute inset-0 scale-[1.15] bg-cover bg-no-repeat transition-[background-position] duration-150"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(8,15,31,0.12), rgba(8,15,31,0.36)), url(${activeScene.image})`,
                            backgroundPosition: `${offset}% 50%`,
                        }}
                    />
                    <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                        <div className="rounded-[1.6rem] border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-xl">
                            <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                                Hotspot
                            </p>
                            <p className="mt-2 font-display text-2xl font-semibold">
                                {activeScene.hotspotLabel}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setScene(activeIndex === 0 ? scenes.length - 1 : activeIndex - 1)}
                                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setScene(activeIndex === scenes.length - 1 ? 0 : activeIndex + 1)}
                                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
                {sceneSteps.map((scene, index) => (
                    <button
                        key={scene.id}
                        type="button"
                        onClick={() => setScene(index)}
                        className={cn(
                            'overflow-hidden rounded-[1.5rem] border text-left transition',
                            scene.active
                                ? 'border-cyan-400/60 bg-cyan-400/10'
                                : 'border-white/40 bg-white/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10',
                        )}
                    >
                        <div
                            className="h-28 w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${scene.image})` }}
                        />
                        <div className="p-4">
                            <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                                {scene.title}
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {scene.hotspotLabel}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
