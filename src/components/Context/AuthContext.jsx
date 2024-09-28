import {createContext, useReducer, useEffect, useState} from "react";


import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

const authReducer = (state, action) => {
    const decodedToken = jwtDecode(action.payload)
    switch (action.type) {
        case 'LOGIN':


            return {
                ...state,
                user: decodedToken.id,
                role: decodedToken.role
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null, role: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch({ type: 'LOGIN', payload: token });
        }
        setLoading(false);  // Finaliza la carga después de procesar el token
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
}