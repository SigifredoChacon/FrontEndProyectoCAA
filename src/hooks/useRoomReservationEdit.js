import { useState } from 'react';


export function useRoomReservationEdit() {
    const [selectedRoomReservation, setSelectedRoomReservation] = useState(null);



    const handleEditRoomReservation = (roomReservation) => {
        setSelectedRoomReservation(roomReservation);
    };


    const handleRoomReservationUpdated = () => {
        setSelectedRoomReservation(null);
    };

    return {
        selectedRoomReservation,
        handleEditRoomReservation,
        handleRoomReservationUpdated,
    };
}
