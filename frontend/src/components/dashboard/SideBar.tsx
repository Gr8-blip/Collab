
import { NavLink, Link } from "react-router-dom";
import Logo from "../../assets/Logo";

const links = [
    { label: "Home", to: "/dashboard", icon: "⌂" },
    { label: "Your rooms", to: "/rooms", icon: "▦" },
    { label: "Explore rooms", to: "/explore", icon: "⌕" },
];

function SideBar() {
    return (
        <aside className="relative z-20 hidden w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0B0F1B]/75 p-5 backdrop-blur-2xl lg:flex">
            {/* Brand */}
            <Link to="/dashboard" className="mb-12 flex items-center gap-3 px-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                    <Logo />
                </div>

                <span className="font-display text-xl font-bold tracking-tight text-white">
                    COLLAB
                    <span className="text-indigo-400">.</span>
                </span>
            </Link>

            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Workspace
            </div>

            <nav className="flex flex-1 flex-col gap-1.5">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/dashboard"}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "border-indigo-400/15 bg-indigo-500/[0.12] text-indigo-200 shadow-inner shadow-indigo-400/[0.03]"
                                    : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                                )}

                                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors ${
                                    isActive
                                        ? "bg-indigo-400/10 text-indigo-300"
                                        : "bg-white/[0.03] text-slate-500 group-hover:text-slate-200"
                                }`}>
                                    {link.icon}
                                </span>

                                {link.label}

                                {isActive && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Create action */}
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="mb-3 px-1">
                    <p className="text-sm font-semibold text-white">
                        Got an idea?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Create a space and build it together.
                    </p>
                </div>

                <Link
                    to="/rooms/new"
                    className="group flex items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                >
                    <span className="text-lg transition-transform group-hover:rotate-90">
                        +
                    </span>
                    Create room
                </Link>
            </div>

            <div className="mt-5 flex items-center gap-2 px-1 text-[10px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Your space to collaborate
            </div>
        </aside>
    );
}

export default SideBar;
