import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function RoleBasedComponent({ allowedRoles, children }) {
    const { user, role } = useAuthContext();

    if(!user) return null

    if(allowedRoles.includes('all'))  return <>{children}</>

    if (allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    return null; // No renderiza nada si el rol no es permitido
}

export default RoleBasedComponent;
