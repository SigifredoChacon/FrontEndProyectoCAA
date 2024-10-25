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
                    border: 'none',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
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
                    sx={{ mb: 3 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        width: '100%',
                        py: 1.5,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        backgroundColor: '#002855',
                        '&:hover': {
                            backgroundColor: '#004080',
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
