import React from "react";

function ViewPendingReservationModal({
                                         open,
                                         onClose,
                                         selectedReservation,
                                         onReservationAccept,
                                         onReservationReject,
                                     }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose} // <- Cierra al dar click en el fondo
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-[420px] p-6 relative"
                onClick={(e) => e.stopPropagation()} // <- Evita cerrar si se da click dentro
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-lg"
                >
                    ✕
                </button>

                {/* Título */}
                <h2 className="text-xl font-bold text-center mb-4 border-b pb-2">
                    Detalles de la Reservación
                </h2>

                {/* Información */}
                <div className="space-y-2 text-gray-700">
                    <p>
                        <span className="font-semibold">👤 Usuario:</span>{" "}
                        {selectedReservation.userName}
                    </p>
                    <p>
                        <span className="font-semibold">📅 Fecha:</span>{" "}
                        {new Date(selectedReservation.Fecha).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p>
                        <span className="font-semibold">⏰ Hora Inicio:</span>{" "}
                        {selectedReservation.HoraInicio}
                    </p>
                    <p>
                        <span className="font-semibold">⏰ Hora Fin:</span>{" "}
                        {selectedReservation.HoraFin}
                    </p>
                    <p>
                        <span className="font-semibold">📍 Lugar:</span>{" "}
                        {selectedReservation.placeName}
                    </p>

                    {selectedReservation.Refrigerio === 1 && (
                        <p>
                            <span className="font-semibold">🍴 Refrigerio:</span> Sí
                        </p>
                    )}

                    {selectedReservation.Observaciones && (
                        <p>
                            <span className="font-semibold">📝 Observaciones:</span>{" "}
                            {selectedReservation.Observaciones}
                        </p>
                    )}

                    {Array.isArray(selectedReservation.recursos) &&
                        selectedReservation.recursos.length > 0 && (
                            <p>
                                <span className="font-semibold">🛠️ Recursos:</span>{" "}
                                {selectedReservation.recursos
                                    .map((recurso) => recurso.NombreRecurso)
                                    .join(", ")}
                            </p>
                        )}
                </div>

                {/* Botones */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onReservationAccept}
                        className="flex-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={onReservationReject}
                        className="flex-1 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow"
                    >
                        Rechazar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewPendingReservationModal;
