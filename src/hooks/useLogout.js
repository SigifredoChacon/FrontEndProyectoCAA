import {useAuthContext} from "./useAuthContext.js";

export const useLogout = () => {
    const {dispatch} = useAuthContext()

    const logout = () => {
        localStorage.removeItem('token')
        dispatch({type: 'LOGOUT'})
    }

    return {logout}
}