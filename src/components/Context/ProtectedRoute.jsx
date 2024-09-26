import { Navigate } from "react-router-dom";
import {useAuthContext} from "../../hooks/useAuthContext.js";


function ProtectedRoute({ children, allowedRoles }) {
    const { user, role } = useAuthContext();

    console.log(user)
    if (!user) {

        // Si no está autenticado, redirigir al login
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
        // Si no tiene el rol permitido, redirigir a una página no autorizada o la página de inicio
        return <Navigate to="/not-authorized" />;
    }

    return children;
}

export default ProtectedRoute;
