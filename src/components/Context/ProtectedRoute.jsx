import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, role, loading } = useAuthContext();

    if (loading) {
        // Mostrar un spinner o algún componente de carga mientras se obtiene el usuario
        return <div>Loading...</div>;  // Puedes personalizar este loader
    }

    if (!user) {
        // Si no hay usuario autenticado, redirigir al login
        return <Navigate to="/login" />;
    }

    if(allowedRoles.includes('all')) return children

    if (!allowedRoles.includes(role)) {
        // Si el usuario no tiene el rol permitido, redirigir a una página no autorizada
        return <Navigate to="/not-authorized" />;
    }

    return children;
}

export default ProtectedRoute;
