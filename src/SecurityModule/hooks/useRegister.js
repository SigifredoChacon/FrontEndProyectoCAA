import { useState } from 'react';
import { registerUser } from "../services/userService.jsx";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false);

    const register = async (user) => {
        setLoading(true);
        setError(null);
        setIsRegister(false);

        try {
            await registerUser(user);
            setLoading(false);
            setIsRegister(true);
        } catch (err) {
            setLoading(false);


            const errorData = err.response?.data?.message;
            if (errorData && Array.isArray(errorData)) {
                const tooBigError = errorData.find(
                    (msg) => msg.code === "too_big" && msg.path.includes("cedulaCarnet")
                );
                if (tooBigError) {
                    setError("El número de cédula es demasiado grande.");
                } else {
                    setError("Ocurrió un error al registrar el usuario.");
                }
            } else {
                setError(err.response.data.message);
            }
        }
    };

    return {
        register,
        loading,
        error,
        isRegister,
    };
};
