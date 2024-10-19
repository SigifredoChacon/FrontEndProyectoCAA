import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const ShareReservationModal = ({ open, handleClose, handleShare, reservation }) => {
    const [emails, setEmails] = useState('');

    const handleChange = (event) => {
        setEmails(event.target.value);
    };

    const handleSubmit = () => {
        const emailList = emails.split(/[\s,]+/).map(email => email.trim()).filter(email => email !== '');
        handleShare(emailList, reservation);
        setEmails('');
        handleClose();


    };

    const handleModalClose = () => {
        setEmails('');
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
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
                    border: 'none', // Quitamos el borde sólido
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2, // Bordes redondeados
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Compartir Reservación
                </Typography>
                <TextField
                    fullWidth
                    label="Correos Electrónicos"
                    variant="outlined"
                    value={emails}
                    onChange={handleChange}
                    helperText="Ingrese los correos separados por comas, además que sean correos validos ya que sino, no se enviara la reservación correctamente"
                    margin="normal"
                    sx={{ mb: 3 }} // Margen inferior para separar del botón
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        width: '100%', // Botón ocupa el ancho completo
                        py: 1.5, // Padding vertical para un botón más grande
                        borderRadius: 1, // Bordes redondeados en el botón
                        textTransform: 'none', // Evita que el texto del botón esté en mayúsculas
                        fontWeight: 'bold', // Hace el texto del botón más destacado
                        backgroundColor: '#002855', // Color personalizado
                        '&:hover': {
                            backgroundColor: '#004080', // Color personalizado al pasar el mouse
                        },
                    }}
                >
                    Enviar
                </Button>
            </Box>
        </Modal>
    );
};

export default ShareReservationModal;
