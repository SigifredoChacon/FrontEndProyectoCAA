import { useState } from 'react';
import {createUser} from "../services/userService.jsx";


export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false);

    const register = async (user) => {
        setLoading(true);
        setError(null);
        setIsRegister(false);

        try {
            await createUser(user);
            setLoading(false);
            setIsRegister(true);

        } catch (err) {
            setLoading(false);
            setError(err.response.data.message);
        }
    };

    return {
        register,
        loading,
        error,
        isRegister,
    };
};
