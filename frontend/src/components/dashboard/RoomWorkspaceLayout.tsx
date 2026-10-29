import { useCallback, useEffect, useState } from "react";
import {
    PanelLeft,
    Plus,
    Hash,
    Users,
    X,
} from "lucide-react";
import Logo from "../../assets/Logo";
import { Link, Outlet, useParams } from "react-router-dom";
import { createSpot, roomDetail } from "../../api/client";
import { type Visibility } from "../../types/room";

type SpotData = {
    id: number;
    title: string;
}

type RoomData = {
    id: number;
    spots: SpotData[],
    name: string;
    visibility: Visibility;
}

function RoomWorkspaceLayout() {
    const { room_id, title } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [isCreateSpotOpen, setIsCreateSpotOpen] = useState(false);
    const [newSpotTitle, setNewSpotTitle] = useState("");

    const [roomData, setRoomData] = useState<RoomData | null>(null);


    const fetchRoomDetails = useCallback(async () => {
        if (!room_id) return;

        const numericId = Number(room_id);

        if (Number.isNaN(numericId)) return;

        const roomDetails = await roomDetail(numericId);
        setRoomData(roomDetails);
    }, [room_id]);

    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails])

    const handleSpotCreate = async (room_id: number, title: string) => {
        await createSpot({ room: room_id, title });
        await fetchRoomDetails();

        setIsCreateSpotOpen(false);
        setNewSpotTitle("");

    }


    return (
        <div className="relative h-dvh overflow-hidden bg-[var(--color-canvas)] p-2 font-sans text-white sm:p-4 lg:p-6">

            {/* Ambient lighting behind the glass */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[140px]" />
            <div className="pointer-events-none absolute right-1/3 top-1/4 h-64 w-64 rounded-full bg-cyan-500/[0.04] blur-[100px]" />

            {/* Main application shell */}
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#090d22]/75 shadow-[0_30px_100px_-25px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:rounded-3xl">

                {/* Subtle light along the top edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />

                {/* Global header */}
                <header className="relative z-20 flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4 sm:px-6">

                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                            aria-expanded={isSidebarOpen}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/75 transition hover:border-indigo-400/30 hover:bg-indigo-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden"
                        >
                            <PanelLeft size={19} />
                        </button>

                        <Link
                            to="/dashboard"
                            className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                        >
                            <Logo />
                            <span className="font-display text-lg font-bold tracking-[0.12em] text-white sm:text-xl">
                                COLLAB
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1.5 sm:px-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                        <span className="text-[10px] font-medium tracking-wide text-emerald-200/90 sm:text-xs">
                            {roomData?.visibility.toUpperCase()}
                        </span>
                    </div>
                </header>

                {/* Sidebar + workspace region */}
                <div className="relative flex min-h-0 flex-1">

                    {/* Mobile backdrop */}
                    {isSidebarOpen && (
                        <button
                            type="button"
                            aria-label="Close sidebar"
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[3px] md:hidden"
                        />
                    )}

                    {/* Sidebar */}
                    <aside
                        className={`absolute inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/[0.09] bg-[#0b1027]/95 p-5 shadow-[20px_0_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-transform duration-300 ease-out md:relative md:z-0 md:shrink-0 md:bg-white/[0.025] md:p-6 md:shadow-none md:backdrop-blur-none ${isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:-ml-72"
                            }`}
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                                    WORKSPACE
                                </p>
                                <h2 className="font-display text-xl font-semibold tracking-tight">
                                    Your Spots
                                </h2>
                            </div>

                            <button
                                type="button"
                                aria-label="Close sidebar"
                                onClick={() => setIsSidebarOpen(false)}
                                className="rounded-lg p-2 text-white/50 transition hover:bg-white/[0.07] hover:text-white md:hidden"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-3 flex items-center justify-between px-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                YOUR SPOTS
                            </span>
                            <span className="text-xs text-white/30">01</span>
                        </div>


                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <nav aria-label="Your Spots" className="space-y-1">
                                {roomData?.spots.map((spot) => {
                                    const isActive = spot.title === title;

                                    return (
                                        <Link
                                            key={spot.id}
                                            to={`/rooms/${room_id}/${encodeURIComponent(spot.title)}/`}
                                            onClick={() => window.innerWidth < 768 ? setIsSidebarOpen(false) : setIsSidebarOpen(true)}
                                            aria-current={isActive ? "page" : undefined}
                                            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-sm transition ${isActive
                                                ? "border-indigo-400/20 bg-gradient-to-r from-indigo-500/[0.17] to-violet-500/[0.07] text-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                                : "border-transparent text-white/55 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white"
                                                }`}
                                        >
                                            {isActive && (
                                                <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                                            )}

                                            <Hash
                                                size={17}
                                                className={isActive ? "text-indigo-300" : "text-white/40"}
                                            />

                                            <span className="flex-1 font-medium">{spot.title}</span>

                                            {isActive && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-300/80" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsCreateSpotOpen(true)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.13] bg-white/[0.02] px-3 py-3 text-sm text-white/55 transition hover:border-indigo-400/40 hover:bg-indigo-400/[0.06] hover:text-indigo-200 cursor-pointer"
                        >
                            <Plus size={16} />
                            Create new Spot
                        </button>

                        
                    </aside>


                    <div className="relative flex min-w-0 flex-1">
                        <Outlet context={{ roomData }} />
                    </div>
                </div>
            </div>



            {isCreateSpotOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/65 p-4 backdrop-blur-md"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsCreateSpotOpen(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-spot-title"
                        className="relative w-full max-w-md overflow-hidden
                       rounded-2xl border border-white/10
                       bg-[#0c1128]/95 shadow-2xl
                       shadow-indigo-950/50 backdrop-blur-2xl"
                    >
                        {/* Subtle ambient lighting */}
                        <div className="pointer-events-none absolute -right-16 -top-20
                            h-48 w-48 rounded-full bg-indigo-500/15
                            blur-[80px]" />

                        {/* Modal header */}
                        <div className="relative flex items-start justify-between
                            border-b border-white/[0.08] p-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center
                                    justify-center rounded-xl
                                    border border-indigo-400/20
                                    bg-indigo-400/10">
                                    <Plus size={21} className="text-indigo-300" />
                                </div>

                                <div>
                                    <h2
                                        id="create-spot-title"
                                        className="text-lg font-semibold tracking-tight
                                       text-white"
                                    >
                                        Create a Spot
                                    </h2>

                                    <p className="mt-1 text-sm text-white/45">
                                        Give your next idea a place to grow.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label="Close dialog"
                                onClick={() => setIsCreateSpotOpen(false)}
                                className="rounded-lg p-2 text-white/45
                               transition hover:bg-white/[0.07]
                               hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (!roomData || !newSpotTitle) return;

                                handleSpotCreate(roomData.id, newSpotTitle);

                            }}
                            className="relative space-y-5 p-6"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="spot-name"
                                    className="text-sm font-medium text-white/80"
                                >
                                    Spot name
                                </label>

                                <div className="flex items-center gap-3 rounded-xl
                                    border border-white/10
                                    bg-white/[0.035] px-3.5
                                    transition focus-within:border-indigo-400/50
                                    focus-within:ring-2
                                    focus-within:ring-indigo-400/10">
                                    <Hash size={18} className="shrink-0 text-indigo-300/70" />

                                    <input
                                        id="spot-name"
                                        autoFocus
                                        required
                                        minLength={1}
                                        maxLength={80}
                                        value={newSpotTitle}
                                        onChange={(event) =>
                                            setNewSpotTitle(event.target.value)
                                        }
                                        placeholder="e.g. Development"
                                        className="min-w-0 flex-1 bg-transparent
                                       py-3.5 text-sm text-white
                                       outline-none placeholder:text-white/25"
                                    />
                                </div>

                                <p className="text-xs leading-relaxed text-white/35">
                                    Choose a name that describes what your team will
                                    work on here.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateSpotOpen(false);
                                        setNewSpotTitle("");
                                    }}
                                    className="rounded-xl border border-white/10
                                   px-4 py-2.5 text-sm font-medium
                                   text-white/65 transition
                                   hover:bg-white/[0.05] hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!newSpotTitle.trim()}
                                    className="flex items-center gap-2 rounded-xl
                                   bg-gradient-to-r from-indigo-500
                                   to-violet-600 px-4 py-2.5
                                   text-sm font-semibold text-white
                                   shadow-lg shadow-indigo-950/40
                                   transition hover:brightness-110
                                   disabled:cursor-not-allowed
                                   disabled:opacity-40"
                                >
                                    <Plus size={16} />
                                    Create Spot
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default RoomWorkspaceLayout;
