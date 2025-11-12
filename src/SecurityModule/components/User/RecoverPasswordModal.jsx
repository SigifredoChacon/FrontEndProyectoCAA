import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { updatePassword } from "../../services/userService.jsx";

const ResetPasswordModal = ({ open, handleClose }) => {
    const [cedulaCarnet, setCedulaCarnet] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async () => {
        if (!cedulaCarnet) {
            setError('Por favor ingrese el cédula o carnet');
            return;
        }

        if (!email) {
            setError('Por favor ingrese el Email');
            return;
        }

        try {

            const response = await updatePassword(cedulaCarnet, email);

            Swal.fire({
                title: 'Restablecimiento de contraseña',
                text: response.message,
                icon: 'info',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'bg-pantone-blue text-white px-4 py-2 rounded hover:bg-pantone-blue/80 mr-2'
                }
            });

            handleModalClose();
        } catch (err) {
            setError('Hubo un error al restablecer la contraseña');
        }
    };

    const handleModalClose = () => {
        setCedulaCarnet('');
        setEmail('');
        setError('');
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
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 1 }}>
                    Restablecer Contraseña
                </Typography>

                <TextField
                    fullWidth
                    label="Cédula o Carnet"
                    variant="outlined"
                    value={cedulaCarnet}
                    onChange={(e) => setCedulaCarnet(e.target.value)}
                    margin="normal"
                    sx={{ mb: 1 }}
                />

                <TextField
                    fullWidth
                    label="Correo Electrónico"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    sx={{ mb: 3 }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordReset}
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
                    Restablecer Contraseña
                </Button>
            </Box>
        </Modal>
    );
};

export default ResetPasswordModal;
