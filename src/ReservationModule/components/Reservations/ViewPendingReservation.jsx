import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

function ViewPendingReservationModal({ open, onClose, selectedReservation, onReservationAccept, onReservationReject }) {

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Detalles de la Reservación
                </Typography>

                <Typography variant="body1"><strong>Usuario:</strong> {selectedReservation.userName}</Typography>
                <Typography variant="body1"><strong>Fecha:</strong> {new Date(selectedReservation.Fecha).toLocaleDateString('es-ES')} (Sábado)</Typography>
                <Typography variant="body1"><strong>Hora Inicio:</strong> {selectedReservation.HoraInicio}</Typography>
                <Typography variant="body1"><strong>Hora Fin:</strong> {selectedReservation.HoraFin}</Typography>
                <Typography variant="body1"><strong>Lugar:</strong> {selectedReservation.placeName}</Typography>
                {selectedReservation.Refrigerio === 1 && (
                    <Typography variant="body1"><strong>Refrigerio:</strong> {selectedReservation.Refrigerio}</Typography>
                )}
                {selectedReservation.Observaciones && (
                    <Typography variant="body1"><strong>Observaciones:</strong> {selectedReservation.Observaciones}</Typography>
                )}
                {Array.isArray(selectedReservation.recursos) && selectedReservation.recursos.length > 0 && (
                    <Typography variant="body1">
                        <strong>Recursos:</strong> {selectedReservation.recursos.map(recurso => recurso.NombreRecurso).join(', ')}
                    </Typography>
                )}

                {/* Botones de aceptar o rechazar */}
                <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                        onClick={onReservationAccept}
                        variant="contained"
                        sx={{
                            backgroundColor: 'green',
                            color: 'white',
                            borderRadius: '5px',
                            '&:hover': {
                                backgroundColor: '#006400',
                            }
                        }}
                    >
                        Aceptar
                    </Button>
                    <Button
                        onClick={onReservationReject}
                        variant="contained"
                        sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '5px',
                            '&:hover': {
                                backgroundColor: '#8B0000',
                            }
                        }}
                    >
                        Rechazar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ViewPendingReservationModal;
