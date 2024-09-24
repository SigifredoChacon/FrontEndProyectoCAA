import { useState } from 'react';


export function useCubicleEdit() {
    const [selectedCubicle, setSelectedCubicle] = useState(null);


    const handleEditCubicle = (cubicle) => {
        setSelectedCubicle(cubicle);
    };


    const handleCubicleUpdated = () => {
        setSelectedCubicle(null);
    };

    return {
        selectedCubicle,
        handleEditCubicle,
        handleCubicleUpdated,
    };
}
