import { useState } from 'react';


export function useRequestEdit() {
    const [selectedRequest, setSelectedRequest] = useState(null);


    const handleEditRequest = (request) => {
        setSelectedRequest(request);
    };


    const handleRequestUpdated = () => {
        setSelectedRequest(null);
    };

    return {
        selectedRequest,
        handleEditRequest,
        handleRequestUpdated,
    };
}
