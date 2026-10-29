import { Navigate, useParams } from "react-router-dom";


function RoomDefaultRedirect() {
    const { room_id } = useParams();

    if (!room_id) return null;

    return (
        <Navigate
            to={`/rooms/${room_id}/general/`}
            replace
        />
    );
}

export default RoomDefaultRedirect;