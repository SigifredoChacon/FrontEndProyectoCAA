import {createContext , useReducer, useEffect} from "react";


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

export const AuthContextProvider = ({children}) => {
   const [state , dispatch] = useReducer(authReducer, {user: null})

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('token'))
        if(user) {
            dispatch({type: 'LOGIN', payload: user})
        }
    }, []);
    return (
         <AuthContext.Provider value={{...state, dispatch}}>
              {children}
         </AuthContext.Provider>
    )
}