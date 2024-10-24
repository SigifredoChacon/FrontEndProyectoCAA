import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, role, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;  // Puedes personalizar este loader
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if(allowedRoles.includes('all')) return children

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/not-authorized" />;
    }

    return children;
}

export default ProtectedRoute;
