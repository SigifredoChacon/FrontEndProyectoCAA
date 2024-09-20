import { useState } from 'react';


export function useCubicleReservationEdit() {
    const [selectedCubicleReservation, setSelectedCubicleRservation] = useState(null);



    const handleEditCubicleReservation = (cubicleReservation) => {
        setSelectedCubicleRservation(cubicleReservation);
    };


    const handleCubicleReservationUpdated = () => {
        setSelectedCubicleRservation(null);
    };

    return {
        selectedCubicleReservation,
        handleEditCubicleReservation,
        handleCubicleReservationUpdated,
    };
}
