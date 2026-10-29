
import React from "react";

type Spot = {
    id: string;
    name: string;
};

type SpotsSideBarProps = {
    spots?: Spot[];
};

function SpotsSideBar({ spots = [] }: SpotsSideBarProps) {
    return (
        <aside className="relative hidden w-80 shrink-0 flex-col overflow-hidden border-l border-white/[0.07] bg-[#0B0F1B]/70 p-5 backdrop-blur-2xl xl:flex">
            {/* Ambient lighting */}
            <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-indigo-500/[0.06] blur-[90px]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

            {/* Header */}
            <header className="relative mb-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-display text-sm font-semibold text-white">
                            Recent active spots
                        </h2>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                            Spaces worth checking in on.
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/[0.07] text-indigo-200">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                            <circle cx="12" cy="12" r="4" />
                        </svg>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3">
                    <span className="text-xs text-slate-400">
                        Active spots
                    </span>

                    <span className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-xs font-semibold tabular-nums text-slate-200">
                        {spots.length}
                    </span>
                </div>
            </header>

            {/* Spots list */}
            <div className="relative min-h-0 flex-1 overflow-y-auto glass-scrollbar">
                {spots.length === 0 ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-5 py-8 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                className="h-7 w-7 text-slate-500"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="8.5" />
                                <circle cx="12" cy="12" r="3.5" />
                                <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2" />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-200">
                            It's quiet in here
                        </h3>

                        <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
                            Your recent active spots will appear here when
                            activity data is connected.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                            Waiting for activity
                        </div>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {spots.map((spot) => (
                            <li key={spot.id}>
                                <div className="group flex items-center gap-3 rounded-xl border border-transparent bg-transparent px-3 py-3 transition-all duration-200 hover:border-white/[0.07] hover:bg-white/[0.035]">
                                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/10 bg-indigo-400/[0.06] text-indigo-200">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <rect x="4" y="4" width="16" height="16" rx="4" />
                                            <path d="M8 9h8M8 12h5M8 15h6" />
                                        </svg>

                                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0B0F1B] bg-emerald-400" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                                            {spot.name}
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-500">
                                            Active spot
                                        </p>
                                    </div>

                                    <span className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-300">
                                        ↗
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <footer className="relative mt-5 border-t border-white/[0.07] pt-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-400">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 11v5m0-8h.01" />
                        </svg>
                    </div>

                    <p className="text-[10px] leading-4 text-slate-500">
                        Your team's activity, all in one place.
                    </p>
                </div>
            </footer>
        </aside>
    );
}

export default SpotsSideBar;
