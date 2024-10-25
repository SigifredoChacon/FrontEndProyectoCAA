import React from "react";

function NotAuthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold text-red-500">No estás autorizado para acceder a esta página.</h1>
        </div>
    );
}

export default NotAuthorized;
