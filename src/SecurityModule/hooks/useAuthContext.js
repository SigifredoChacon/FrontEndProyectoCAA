import {AuthContext} from "../components/Context/AuthContext.jsx";
import {useContext} from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuthContext debe estar dentro del proveedor AuthProvider')
    }
    return context;
}