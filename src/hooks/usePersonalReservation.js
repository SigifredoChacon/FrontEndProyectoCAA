import { useState } from 'react';


export function usePersonalReservation() {
    const [selectedReservation, setSelectedReservation] = useState(null);



    const handleEditReservation = (cubicleReservation) => {
        setSelectedReservation(cubicleReservation);
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
