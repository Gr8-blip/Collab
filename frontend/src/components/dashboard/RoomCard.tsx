
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import { joinRoom } from "../../api/client";

type JoinStatus = "idle" | "loading" | "joined" | "error";

type RoomCardProps = {
    room: Room;
    showJoin?: boolean;
    onJoined?: (room: Room) => void;
};

function RoomCard({
    room,
    showJoin = false,
    onJoined,
}: RoomCardProps) {
    const isPublic = room.visibility === "public";
    const [status, setStatus] = useState<JoinStatus>("idle");
    const [error, setError] = useState("");

    const handleJoin = async () => {
        if (status === "loading" || status === "joined") return;

        setStatus("loading");
        setError("");

        try {
            await joinRoom(room.id);
            setStatus("joined");
            onJoined?.(room);
        } catch (e) {
            setStatus("error");
            setError(
                e instanceof Error ? e.message : "Couldn't join room."
            );
        }
    };

    return (
        <li className="group relative min-w-0 list-none">
            {/* Ambient card glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-400/0 via-violet-400/0 to-blue-400/0 opacity-0 blur-xl transition duration-500 group-hover:from-indigo-400/[0.12] group-hover:via-violet-400/[0.06] group-hover:to-blue-400/[0.08] group-hover:opacity-100" />

            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101525]/70 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/20 hover:bg-[#141A2C]/90 hover:shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                {/* Top lighting */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent transition-colors group-hover:via-indigo-300/40" />

                <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-indigo-500/[0.045] blur-3xl transition-colors group-hover:bg-indigo-500/[0.12]" />

                {/* Room identity */}
                <div className="relative flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-300/[0.12] bg-gradient-to-br from-indigo-400/[0.15] to-violet-500/[0.06] text-indigo-200 shadow-inner shadow-white/[0.03]">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
                            <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
                            <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
                            <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
                        </svg>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            isPublic
                                ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                                : "border-white/[0.09] bg-white/[0.035] text-slate-400"
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${
                            isPublic ? "bg-emerald-400" : "bg-slate-500"
                        }`} />
                        {room.visibility}
                    </span>
                </div>

                {/* Clickable room details */}
                <Link
                    to={`/rooms/${room.id}`}
                    className="relative mt-5 block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#101525]"
                >
                    <h3 className="break-words font-display text-lg font-semibold tracking-tight text-slate-100 transition-colors group-hover:text-white">
                        {room.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        A space to share ideas and collaborate.
                    </p>

                    <div className="mt-5 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-xs font-semibold uppercase text-indigo-200">
                            {room.owner.email?.charAt(0) || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                                Created by
                            </p>
                            <p className="mt-0.5 truncate text-xs font-medium text-slate-300">
                                {room.owner.email}
                            </p>
                        </div>

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.025] text-slate-500 transition-all duration-200 group-hover:border-indigo-300/20 group-hover:bg-indigo-400/10 group-hover:text-indigo-200">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                                aria-hidden="true"
                            >
                                <path d="M7 17 17 7M7 7h10v10" />
                            </svg>
                        </span>
                    </div>
                </Link>

                {/* Action area */}
                {showJoin && (
                    <div className="relative mt-5 border-t border-white/[0.06] pt-4">
                        <button
                            type="button"
                            onClick={handleJoin}
                            disabled={status === "loading" || status === "joined"}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed ${
                                status === "joined"
                                    ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                                    : status === "loading"
                                      ? "border-indigo-400/15 bg-indigo-400/[0.06] text-indigo-200"
                                      : "border-indigo-300/15 bg-indigo-400/[0.09] text-indigo-200 hover:border-indigo-300/30 hover:bg-indigo-400/[0.16] active:scale-[0.99]"
                            }`}
                        >
                            {status === "loading" && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200/30 border-t-indigo-200" />
                            )}

                            {status === "joined" && (
                                <span aria-hidden="true">✓</span>
                            )}

                            {status === "loading"
                                ? "Joining room..."
                                : status === "joined"
                                  ? "Joined successfully"
                                  : "Join room"}

                            {status === "idle" && (
                                <span aria-hidden="true">↗</span>
                            )}
                        </button>

                        {status === "error" && (
                            <p
                                role="alert"
                                className="mt-2 rounded-lg border border-rose-400/15 bg-rose-400/[0.06] px-3 py-2 text-xs leading-5 text-rose-300"
                            >
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </article>
        </li>
    );
}

export default RoomCard;
