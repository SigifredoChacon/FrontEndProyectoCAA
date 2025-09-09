import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            if (!action.payload) return state;
            try {
                const decodedToken = jwtDecode(action.payload.token || action.payload);


                const isExpired = decodedToken.exp * 1000 < Date.now();
                if (isExpired) {
                    localStorage.removeItem('token');
                    return { ...state, user: null, role: null };
                }

                return {
                    ...state,
                    user: decodedToken.id,
                    role: decodedToken.role,
                };
            } catch (err) {
                console.error("Token inválido:", err);
                localStorage.removeItem('token');
                return { ...state, user: null, role: null };
            }
        case 'LOGOUT':
            localStorage.removeItem('token'); // Limpieza de token
            return {
                ...state,
                user: null,
                role: null,
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null, role: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch({ type: 'LOGIN', payload: token });
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        };

        checkToken();
        setLoading(false);

        // Detecta cambios en localStorage (otra pestaña/cierre de sesión)
        window.addEventListener('storage', checkToken);

        return () => window.removeEventListener('storage', checkToken);
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
