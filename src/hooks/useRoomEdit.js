import { useState } from 'react';


export function useRoomEdit() {
    const [selectedRoom, setSelectedRoom] = useState(null);


    const handleEditRoom = (room) => {
        setSelectedRoom(room);
    };


    const handleRoomUpdated = () => {
        setSelectedRoom(null);
    };

    return {
        selectedRoom,
        handleEditRoom,
        handleRoomUpdated,
    };
}
