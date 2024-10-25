import { useState } from 'react';


export function useUserEdit() {
    const [selectedUser, setSelectedUser] = useState(null);


    const handleEditUser = (user) => {
        setSelectedUser(user);
    };


    const handleUserUpdated = () => {
        setSelectedUser(null);
    };

    return {
        selectedUser,
        handleEditUser,
        handleUserUpdated,
    };
}
