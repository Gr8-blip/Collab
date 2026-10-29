import React from "react";
import AppShell from "../components/dashboard/AppShell";
import RoomsListView from "../components/dashboard/RoomsListView";
import { exploreRooms } from "../api/client";

function ExploreRoomsPage() {
    return (
        <AppShell>
            <RoomsListView
                title="Explore rooms"
                subtitle="Discover public rooms and jump in"
                fetcher={exploreRooms}
                emptyMessage="No public rooms to explore yet"
                showJoin
            />
        </AppShell>
    );
}

export default ExploreRoomsPage;