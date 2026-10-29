import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/dashboard/AppShell";
import type { Visibility } from "../types/room";
import { createRoom } from "../api/client";

const inputClass =
    "w-full rounded-xl border border-white/[0.09] bg-[#090E1B]/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-400/50 focus:bg-[#10162A]/90 focus:ring-4 focus:ring-indigo-400/[0.08]";

const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400";

const visibilityOptions: {
    value: Visibility;
    title: string;
    hint: string;
    icon: string;
}[] = [
    {
        value: "public",
        title: "Public room",
        hint: "Anyone can discover and join.",
        icon: "◎",
    },
    {
        value: "private",
        title: "Private room",
        hint: "Keep your workspace restricted.",
        icon: "⌑",
    },
];

function CreateRoomPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [visibility, setVisibility] = useState<Visibility>("public");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleCreate = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (submitting) return;

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Give your room a name before creating it.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await createRoom({
                name: trimmedName,
                visibility,
            });

            navigate("/rooms");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Couldn't create the room."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppShell>
            <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
                {/* Page header */}
                <header className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        Workspace setup
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Create a room
                        <span className="text-indigo-400">.</span>
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                        Set up your space, bring your people together, and
                        start building something great.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    {/* Main form */}
                    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#101525]/75 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />
                        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.08] blur-[90px]" />

                        <div className="relative border-b border-white/[0.07] px-6 py-5 sm:px-8">
                            <h2 className="font-display text-base font-semibold text-white">
                                Room details
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Choose a name and set who can access your room.
                            </p>
                        </div>

                        <form
                            onSubmit={handleCreate}
                            className="relative flex flex-col gap-7 p-6 sm:p-8"
                        >
                            {/* Room name */}
                            <div className="flex flex-col gap-3">
                                <label htmlFor="room-name" className={labelClass}>
                                    Room name
                                </label>

                                <input
                                    id="room-name"
                                    type="text"
                                    required
                                    maxLength={100}
                                    autoComplete="off"
                                    placeholder="e.g. Design sprint"
                                    className={inputClass}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={submitting}
                                />

                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs text-slate-500">
                                        Make it easy for your team to recognize.
                                    </p>
                                    <span className="shrink-0 text-[10px] tabular-nums text-slate-600">
                                        {name.length}/100
                                    </span>
                                </div>
                            </div>

                            {/* Visibility */}
                            <fieldset className="flex flex-col gap-3">
                                <legend className={labelClass}>
                                    Room visibility
                                </legend>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {visibilityOptions.map((option) => {
                                        const selected =
                                            visibility === option.value;

                                        return (
                                            <label
                                                key={option.value}
                                                className="group cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    value={option.value}
                                                    checked={selected}
                                                    onChange={() =>
                                                        setVisibility(option.value)
                                                    }
                                                    disabled={submitting}
                                                    className="peer sr-only"
                                                />

                                                <div
                                                    className={`relative h-full rounded-2xl border p-4 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400/70 ${
                                                        selected
                                                            ? "border-indigo-400/40 bg-indigo-400/[0.09] shadow-[inset_0_0_24px_rgba(129,140,248,0.035)]"
                                                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.035]"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl ${
                                                                selected
                                                                    ? "border-indigo-300/20 bg-indigo-400/[0.12] text-indigo-200"
                                                                    : "border-white/[0.07] bg-white/[0.03] text-slate-400"
                                                            }`}
                                                        >
                                                            {option.icon}
                                                        </div>

                                                        <span
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                                selected
                                                                    ? "border-indigo-300 bg-indigo-400 text-[#080B14]"
                                                                    : "border-white/20"
                                                            }`}
                                                        >
                                                            {selected && (
                                                                <svg
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2.5"
                                                                    className="h-3 w-3"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path d="m3 8 3 3 7-7" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-4 text-sm font-semibold text-white">
                                                        {option.title}
                                                    </h3>

                                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                                        {option.hint}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm leading-5 text-rose-300"
                                >
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting || !name.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    )}

                                    {submitting ? "Creating room..." : "Create room"}
                                    {!submitting && (
                                        <span aria-hidden="true">↗</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Supporting panel */}
                    <aside className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/[0.08] blur-[65px]" />

                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path d="M12 3 14.8 9.2 21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z" />
                            </svg>
                        </div>

                        <h2 className="relative mt-5 font-display text-base font-semibold text-white">
                            Your space, your rules.
                        </h2>

                        <p className="relative mt-2 text-sm leading-6 text-slate-400">
                            Every room gives your team a dedicated place to
                            collaborate.
                        </p>

                        <div className="relative mt-6 flex flex-col gap-4 border-t border-white/[0.07] pt-5">
                            <div className="flex gap-3">
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-300">
                                    ◎
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Public
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Discoverable by other users.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-400/[0.08] text-indigo-300">
                                    ◈
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Private
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Intended for restricted access.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </main>
        </AppShell>
    );
}

export default CreateRoomPage;
