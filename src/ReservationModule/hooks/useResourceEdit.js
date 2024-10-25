import { useState } from 'react';

export function useResourceEdit() {
    const [selectedResource, setSelectedResource] = useState(null);


    const handleEditResource = (resource) => {
        setSelectedResource(resource);
    };


    const handleResourceUpdated = () => {
        setSelectedResource(null);
    };

    return {
        selectedResource,
        handleEditResource,
        handleResourceUpdated,
    };
}
