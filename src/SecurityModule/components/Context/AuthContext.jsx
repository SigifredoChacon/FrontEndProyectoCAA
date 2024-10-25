import {createContext, useReducer, useEffect, useState} from "react";


import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            if (!action.payload) return state;
            const decodedToken = jwtDecode(action.payload);
            return {
                ...state,
                user: decodedToken.id,
                role: decodedToken.role,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                role: null,
            };
        default:
            return state;
    }
}

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

        window.addEventListener('storage', checkToken);

        return () => window.removeEventListener('storage', checkToken);
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
}