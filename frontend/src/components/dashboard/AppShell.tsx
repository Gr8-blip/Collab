
import React from "react";
import SideBar from "./SideBar";

function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-dvh min-h-0 overflow-hidden bg-[#080B14] font-sans text-white selection:bg-indigo-500/30">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-indigo-500/[0.09] blur-[120px]" />
                <div className="absolute -right-32 top-[25%] h-[360px] w-[360px] rounded-full bg-violet-600/[0.07] blur-[130px]" />
                <div className="absolute bottom-[-200px] left-[35%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.05] blur-[130px]" />
            </div>

            <SideBar />

            {/* This element owns page scrolling */}
            <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain glass-scrollbar">
                {children}
            </div>
        </div>
    );
}

export default AppShell;
