import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { updateUser } from "../../services/userService.jsx";

const ChangePasswordModal = ({ open, handleClose, user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    // Estado para los requerimientos de contraseña
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    // Función para validar la contraseña
    const validatePassword = (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        setPasswordRequirements(requirements);
        return Object.values(requirements).every(req => req === true);
    };

    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setError('');
        validatePassword(password);
    };

    const handlePasswordChange = async () => {
        // Validar que la contraseña cumpla todos los requerimientos
        if (!validatePassword(newPassword)) {
            setError('La contraseña no cumple con todos los requisitos de seguridad');
            return;
        }

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
        setShowPasswordRequirements(false);
        setPasswordRequirements({
            minLength: false,
            hasUpperCase: false,
            hasLowerCase: false,
            hasNumber: false,
            hasSpecialChar: false
        });
        handleClose();
    };

    // Componente para mostrar un requerimiento
    const RequirementItem = ({ met, text }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {met ? (
                <svg style={{ width: 20, height: 20, color: '#16a34a', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg style={{ width: 20, height: 20, color: '#94a3b8', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            <Typography
                variant="body2"
                sx={{
                    color: met ? '#15803d' : '#64748b',
                    fontWeight: met ? 500 : 400,
                    fontSize: '0.875rem'
                }}
            >
                {text}
            </Typography>
        </Box>
    );

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
                    width: 500,
                    maxWidth: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Cambiar Contraseña
                </Typography>

                <TextField
                    fullWidth
                    type="password"
                    label="Nueva Contraseña"
                    variant="outlined"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onFocus={() => setShowPasswordRequirements(true)}
                    margin="normal"
                    sx={{ mb: 2 }}
                />

                {/* Requerimientos de contraseña */}
                {showPasswordRequirements && (
                    <Box
                        sx={{
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            p: 2,
                            mb: 2
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1.5 }}>
                            Requisitos de la contraseña:
                        </Typography>
                        <RequirementItem
                            met={passwordRequirements.minLength}
                            text="Al menos 8 caracteres"
                        />
                        <RequirementItem
                            met={passwordRequirements.hasUpperCase}
                            text="Al menos una letra mayúscula (A-Z)"
                        />
                        <RequirementItem
                            met={passwordRequirements.hasLowerCase}
                            text="Al menos una letra minúscula (a-z)"
                        />
                        <RequirementItem
                            met={passwordRequirements.hasNumber}
                            text="Al menos un número (0-9)"
                        />
                        <RequirementItem
                            met={passwordRequirements.hasSpecialChar}
                            text="Al menos un carácter especial (!@#$%^&*)"
                        />
                    </Box>
                )}

                <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Nueva Contraseña"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                    }}
                    margin="normal"
                    sx={{ mb: 2 }}
                />

                {error && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 1,
                            p: 1.5,
                            mb: 2
                        }}
                    >
                        <svg style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <Typography sx={{ fontSize: '0.875rem', color: '#b91c1c', fontWeight: 500 }}>
                            {error}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={handleModalClose}
                        sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#EF3340',
                            color: '#f8fafc',
                            backgroundColor: '#EF3340',
                            '&:hover': {
                                backgroundColor: '#f65e69',
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handlePasswordChange}
                        sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            backgroundColor: '#002855',
                            '&:hover': {
                                backgroundColor: '#004080',
                            },
                        }}
                    >
                        Cambiar Contraseña
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ChangePasswordModal;