import React from "react";
import AppShell from "../components/dashboard/AppShell";
import RoomsListView from "../components/dashboard/RoomsListView";
import { myRooms } from "../api/client";

function YourRoomsPage() {
    return (
        <AppShell>
            <RoomsListView
                title="Your rooms"
                subtitle="Rooms you own or have joined"
                fetcher={myRooms}
                emptyMessage="No rooms yet, create one"
            />

        </AppShell>
    );
}

export default YourRoomsPage;