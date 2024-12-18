import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext.js";

function RoleBasedComponent({ allowedRoles, children }) {
    const { user, role } = useAuthContext();

    if(!user) return null

    if(allowedRoles.includes('all'))  return <>{children}</>

    if (allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    return null;
}

export default RoleBasedComponent;
