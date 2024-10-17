import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import {updateUser} from "../../services/userService.jsx";

const ChangePasswordModal = ({ open, handleClose, user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {

            await updateUser(user, { contrasena: newPassword });

            Swal.fire({
                title: '¡Contraseña cambiada!',
                text: 'Su contraseña ha sido actualizada exitosamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });

            handleModalClose();
        } catch (err) {
            setError('Hubo un error al cambiar la contraseña');
        }
    };

    const handleModalClose = () => {
        setNewPassword('');
        setConfirmPassword('');
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
                    Cambiar Contraseña
                </Typography>

                <TextField
                    fullWidth
                    type="password"
                    label="Nueva Contraseña"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    sx={{ mb: 1 }}
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Nueva Contraseña"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    sx={{ mb: 3 }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
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
                    Cambiar Contraseña
                </Button>
            </Box>
        </Modal>
    );
};

export default ChangePasswordModal;
