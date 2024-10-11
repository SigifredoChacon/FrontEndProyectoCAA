import { useLocation } from "react-router-dom";

export function AssetRequestPage() {
    const location = useLocation();
    const { id } = location.state || {};

    // Función para obtener el título según el ID
    const getTitle = () => {
        switch (id) {
            case 1:
                return "Solicitud de Laptop";
            case 2:
                return "Solicitud de Proyector";
            case 3:
                return "Solicitud de Monitor";
            default:
                return "Solicitud de Activo";
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
        </div>
    );
}
