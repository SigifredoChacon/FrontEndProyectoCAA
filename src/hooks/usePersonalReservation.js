import { useState } from 'react';


export function usePersonalReservation() {
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleEditReservation = (Reservation) => {
        setSelectedReservation(Reservation);
    };

    const handleReservationUpdated = () => {
        setSelectedReservation(null);
    };

    return {
        selectedReservation,
        handleEditReservation,
        handleReservationUpdated,
    };
}
