function ViewPendingReservation({ selectedReservation, onReservationAccept, onReservationReject }) {
    return (
        <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            textAlign: 'center'
        }}>
            <h2>Detalles de la Reservación</h2>
            <p><strong>Usuario:</strong> {selectedReservation.userName}</p>
            <p><strong>Fecha:</strong> {new Date(selectedReservation.Fecha).toLocaleDateString('es-ES')} (Sábado)</p>
            <p><strong>Hora Inicio:</strong> {selectedReservation.HoraInicio}</p>
            <p><strong>Hora Fin:</strong> {selectedReservation.HoraFin}</p>
            <p><strong>Lugar:</strong> {selectedReservation.placeName}</p>
            {((selectedReservation.Refrigerio === 1) && <p><strong>Refrigerio:</strong> {selectedReservation.Refrigerio}</p>)}
            {(selectedReservation.Observaciones && <p><strong>Observaciones:</strong> {selectedReservation.Observaciones}</p>)}
            {Array.isArray(selectedReservation.recursos) && selectedReservation.recursos.length > 0 && (
                <p><strong>Recursos:</strong> {selectedReservation.recursos.map(recurso => recurso.NombreRecurso).join(', ')}</p>
            )}

            {/* Botones de aceptar o rechazar */}
            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-around'}}>
                <button onClick={onReservationAccept} style={{
                    padding: '10px 20px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}>
                    Aceptar
                </button>
                <button onClick={onReservationReject} style={{
                    padding: '10px 20px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}>
                    Rechazar
                </button>
            </div>
        </div>
    );
}

export default ViewPendingReservation;
