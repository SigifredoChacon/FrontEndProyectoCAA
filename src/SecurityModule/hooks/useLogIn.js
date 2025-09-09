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
            console.log("Respuesta del login:", response.data);
            localStorage.setItem("token", response.data.token);
            dispatch({ type: 'LOGIN', payload: response.data });
            setLoading(false);
            setIsAuthenticated(true);

        } catch (err) {
            setLoading(false);
            setError(err.response.data.message);
        }
    };

    return {
        logIn,
        loading,
        error,
        isAuthenticated,
    };
};
