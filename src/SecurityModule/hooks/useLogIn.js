import { useState } from 'react';
import { useAuthContext } from "./useAuthContext.js";
import { login } from "../services/userService.jsx";

export const useLogIn = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logIn = async (email, password) => {
        setLoading(true);
        setError(null);
        setIsAuthenticated(false);

        try {
            const response = await login(JSON.stringify({ email, password }));

            localStorage.setItem("token", response.data.token);
            dispatch({ type: 'LOGIN', payload: response.data });

            setLoading(false);
            setIsAuthenticated(true);

            return { success: true };
        } catch (err) {
            setLoading(false);

            const data = err?.response?.data;


            if (data?.requiresVerification) {
                setError(data.message);
                return {
                    success: false,
                    requiresVerification: true,
                    cedulaCarnet: data.cedulaCarnet,
                    correoEmail: data.correoEmail,
                    message: data.message,
                };
            }

            setError(data?.message || 'Error al iniciar sesión');
            return { success: false };
        }
    };

    return {
        logIn,
        loading,
        error,
        isAuthenticated,
    };
};
