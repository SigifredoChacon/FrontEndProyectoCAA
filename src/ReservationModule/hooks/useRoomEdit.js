import { useState } from 'react';

export function useRoomEdit() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
    };

    const handleRoomUpdated = () => {
        setSelectedRoom(null);
    };

    const handleRoomLocked = () => {
        setRefresh(prev => prev + 1);
    };

    return {
        selectedRoom,
        handleEditRoom,
        handleRoomUpdated,
        handleRoomLocked,
        refresh
    };
}
