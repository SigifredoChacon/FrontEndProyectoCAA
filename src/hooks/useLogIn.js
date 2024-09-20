import {useState} from 'react';
import {useAuthContext} from "./useAuthContext.js";
import {login} from "../services/userService.jsx";

export const useLogIn = () => {
    const {dispatch} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logIn = async (email, password) => {
        setLoading(true);
        setError(null);

        const response = await login(JSON.stringify({email, password}));


        if (!response) {
            setLoading(false)
            setError(response.message)

        }
        if(response) {
            localStorage.setItem('token', JSON.stringify(response))
            dispatch({type: 'LOGIN', payload: response})
            setLoading(false)

        }

    }

    return {
        logIn,
        loading,
        error
    }
}