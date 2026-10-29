import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { myRooms } from "../../api/client";
import RoomCard from "./RoomCard";
import type { Room } from "../../types/room";

function DashboardContent() {
    const { user } = useAuth();

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
                const data = await myRooms();

                if (!cancelled) {
                    setRooms(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Couldn't load your rooms."
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
    }, [user, retryKey]);

    const email = user?.email ?? "";
    const initial = email.charAt(0).toUpperCase() || "U";

    return (
        <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
            {/* Welcome panel */}
            <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.10] blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-24 right-[30%] h-40 w-40 rounded-full bg-violet-500/[0.06] blur-[70px]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-gradient-to-br from-indigo-400/[0.18] to-violet-500/[0.08] font-display text-xl font-bold text-indigo-200 shadow-lg shadow-indigo-950/20">
                            {initial}
                        </div>

                        <div className="min-w-0">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                Your workspace
                            </div>

                            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Welcome back
                                <span className="text-indigo-400">.</span>
                            </h1>

                            <p className="mt-2 max-w-md break-all text-sm text-slate-400">
                                {email || "Ready to collaborate?"}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/rooms/new"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                    >
                        <span className="text-lg">+</span>
                        Create room
                    </Link>
                </div>
            </header>

            {/* Overview */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101525]/65 p-5 backdrop-blur-xl">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-500/[0.09] blur-3xl" />

                    <div className="relative flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Your rooms
                            </p>

                            <p className="mt-3 font-display text-3xl font-bold text-white tabular-nums">
                                {loading ? "—" : error ? "—" : rooms.length}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {rooms.length === 1
                                    ? "Workspace available"
                                    : "Workspaces available"}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/[0.08] text-indigo-200">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
                                <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
                                <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
                                <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <Link
                    to="/explore"
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101525]/65 p-5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-300/20 hover:bg-[#141A2C]/80"
                >
                    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-500/[0.08] blur-3xl transition-colors group-hover:bg-violet-500/[0.15]" />

                    <div className="relative flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Find your next team
                            </p>

                            <p className="mt-3 font-display text-lg font-semibold text-white">
                                Explore rooms
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Discover public workspaces.
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200 transition-transform group-hover:translate-x-1">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <circle cx="10.5" cy="10.5" r="6.5" />
                                <path d="m15.5 15.5 4 4M8 10.5h5M10.5 8v5" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Rooms */}
            <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0C1120]/65 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                <div className="relative mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-display text-base font-semibold text-white">
                            Your workspaces
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            All the rooms you're working in.
                        </p>
                    </div>

                    <Link
                        to="/rooms"
                        className="shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-300/20 hover:bg-indigo-400/[0.06] hover:text-indigo-200"
                    >
                        View all <span aria-hidden="true">↗</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 3 }, (_, i) => (
                            <div
                                key={i}
                                className="h-64 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.04] px-5 py-10 text-center"
                    >
                        <p className="font-semibold text-white">
                            Couldn't load your rooms
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setRetryKey((key) => key + 1)}
                            className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            Try again
                        </button>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="relative flex flex-col items-center rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.015] px-5 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/15 bg-indigo-400/[0.07] text-2xl text-indigo-200">
                            +
                        </div>

                        <h3 className="mt-4 font-display text-lg font-semibold text-white">
                            Your next big idea starts here
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                            Create a room to bring your team together, share ideas, and get building.
                        </p>

                        <Link
                            to="/rooms/new"
                            className="mt-6 rounded-xl border border-indigo-300/20 bg-indigo-400/[0.09] px-5 py-2.5 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-400/[0.15]"
                        >
                            Create your first room
                        </Link>
                    </div>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {rooms.slice(0, 6).map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </ul>
                )}

                {!loading && !error && rooms.length > 6 && (
                    <div className="mt-5 border-t border-white/[0.06] pt-4 text-center">
                        <Link
                            to="/rooms"
                            className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
                        >
                            See all {rooms.length} rooms →
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}

export default DashboardContent;
