
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoomCard from "./RoomCard";
import type { Room } from "../../types/room";

type Props = {
    title: string;
    subtitle: string;
    fetcher: () => Promise<Room[]>;
    showJoin?: boolean;
    emptyMessage: string;
};

function RoomsListView({
    title,
    subtitle,
    fetcher,
    emptyMessage,
    showJoin,
}: Props) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadRooms() {
            setLoading(true);
            setError("");

            try {
                const data = await fetcher();

                if (!cancelled) {
                    setRooms(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Couldn't load rooms."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadRooms();

        return () => {
            cancelled = true;
        };
    }, [fetcher, retryKey]);

    return (
        <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
            {/* Page introduction */}
            <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.09] blur-[80px]" />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            Your collaboration space
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {title}
                            <span className="text-indigo-400">.</span>
                        </h1>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                            {subtitle}
                        </p>
                    </div>

                    <Link
                        to="/rooms/new"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                    >
                        <span className="text-lg">+</span>
                        Create room
                    </Link>
                </div>

                {/* Compact summary */}
                <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span>
                            {loading
                                ? "Loading workspaces..."
                                : `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} found`}
                        </span>
                    </div>

                    {!loading && !error && (
                        <span className="text-xs text-slate-600">
                            {showJoin
                                ? "Discover a space and join the conversation."
                                : "All your spaces, in one place."}
                        </span>
                    )}
                </div>
            </header>

            {/* Content surface */}
            <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0C1120]/65 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                <div className="relative mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-200">
                            {showJoin ? "Discover rooms" : "Your workspaces"}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            {showJoin
                                ? "Find a team to build something with."
                                : "Pick up where your team left off."}
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs tabular-nums text-slate-400">
                        {loading ? "..." : rooms.length}
                    </div>
                </div>

                {loading ? (
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }, (_, i) => (
                            <li
                                key={i}
                                className="h-64 animate-pulse list-none rounded-2xl border border-white/[0.05] bg-white/[0.025]"
                            >
                                <div className="flex h-full flex-col p-5">
                                    <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
                                    <div className="mt-6 h-4 w-2/3 rounded bg-white/[0.06]" />
                                    <div className="mt-3 h-3 w-full rounded bg-white/[0.04]" />
                                    <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.04]" />
                                    <div className="mt-auto h-9 rounded-lg bg-white/[0.04]" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : error ? (
                    <div
                        role="alert"
                        className="flex flex-col items-center rounded-2xl border border-rose-400/15 bg-rose-400/[0.04] px-5 py-12 text-center"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/[0.07] text-xl text-rose-300">
                            !
                        </div>

                        <h3 className="mt-4 font-semibold text-white">
                            Couldn't load your rooms
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setRooms([]);
                                setError("");
                                setLoading(true);
                                // Trigger a fresh fetch using the existing fetcher.
                                // The effect below handles this retry request.
                                setRetryKey((key) => key + 1);
                            }}
                            className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            Try again
                        </button>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.015] px-5 py-16 text-center">
                        <div className="absolute h-40 w-40 rounded-full bg-indigo-500/[0.07] blur-[70px]" />

                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-inner shadow-white/[0.02]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                className="h-7 w-7 text-indigo-300"
                                aria-hidden="true"
                            >
                                <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
                                <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
                                <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
                                <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
                            </svg>
                        </div>

                        <h3 className="relative mt-5 font-display text-lg font-semibold text-white">
                            No rooms here yet
                        </h3>

                        <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-400">
                            {emptyMessage}
                        </p>

                        <Link
                            to="/rooms/new"
                            className="relative mt-6 rounded-xl border border-indigo-300/20 bg-indigo-400/[0.09] px-5 py-2.5 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-400/[0.15]"
                        >
                            + Create your first room
                        </Link>
                    </div>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                showJoin={showJoin}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

export default RoomsListView;
