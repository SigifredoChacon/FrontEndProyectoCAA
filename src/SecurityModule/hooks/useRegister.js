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

                const invalidID = errorData.find(
                    (msg) => msg.code === "too_small" && msg.path.includes("cedulaCarnet")
                );
                if (invalidID) {
                    setError("El número de cédula es invalido");
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
