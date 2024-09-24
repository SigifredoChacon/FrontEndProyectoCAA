import { useState } from 'react';
import { useAuthContext } from "./useAuthContext.js";
import { login } from "../services/userService.jsx";

export const useLogIn = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado adicional

    const logIn = async (email, password) => {
        setLoading(true);
        setError(null);
        setIsAuthenticated(false); // Resetear el estado de autenticación

        try {
            const response = await login(JSON.stringify({ email, password }));
            localStorage.setItem('token', JSON.stringify(response.data));
            dispatch({ type: 'LOGIN', payload: response.data });
            setLoading(false);
            setIsAuthenticated(true); // Indicar que el usuario está autenticado

        } catch (err) {
            setLoading(false);
            setError(err.response.data.message);
        }
    };

    return {
        logIn,
        loading,
        error,
        isAuthenticated, // Retornar el nuevo estado
    };
};
