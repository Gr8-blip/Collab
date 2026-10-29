import SideBar from "../components/dashboard/SideBar";
import DashboardContent from "../components/dashboard/DashboardContent";
import SpotsSideBar from "../components/dashboard/SpotsSideBar";

function Dashboard() {
    return (
        <div className="relative flex h-dvh min-h-0 overflow-hidden bg-canvas font-sans text-white">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(129,140,248,0.10),transparent)]" />

            <SideBar />

            {/* Main dashboard: the scroll owner */}
            <main className="relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain glass-scrollbar">
                <DashboardContent />
            </main>

            <SpotsSideBar />
        </div>
    );
}

export default Dashboard;
