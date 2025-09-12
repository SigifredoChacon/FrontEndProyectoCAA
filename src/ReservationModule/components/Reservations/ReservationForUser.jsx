import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../../SecurityModule/services/userService.jsx';

function ReservationForUser({onUserSearched, onCancel }) {
    const [cedulaCarnet, setCedulaCarnet] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearchUser = async () => {
        try {
            const user = await getUserById(cedulaCarnet);
            if (user) {
                setUsuario(user);
                setError('');
            } else {
                setUsuario(null);
                setError('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            setUsuario(null);
            setError('Error al buscar usuario');
        }
    };

    const handleReserve = () => {

        onUserSearched(usuario.CedulaCarnet);
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>
                Reservar por Usuario Registrado
            </h2>

            <div style={{marginBottom: '30px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Cédula:</label>
                <input
                    type="text"
                    value={cedulaCarnet}
                    onChange={(e) => setCedulaCarnet(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#004080'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                />
            </div>

            <button
                onClick={handleSearchUser}
                style={{
                    backgroundColor: '#002855',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    marginBottom: '20px',
                    width: '100%',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004080'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#002855'}
            >
                Buscar Usuario
            </button>

            {error && <div style={{color: 'red', marginBottom: '20px'}}>{error}</div>}

            {usuario && (
                <div style={{marginBottom: '20px'}}>
                    <h3 style={{fontSize: '20px', fontWeight: 'bold'}}>Usuario encontrado:</h3>
                    <p style={{fontSize: '18px'}}>{usuario.Nombre}</p>
                </div>
            )}

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button
                    onClick={handleReserve}
                    disabled={!usuario}
                    style={{
                        backgroundColor: usuario ? '#28a745' : '#ccc',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        cursor: usuario ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.3s ease',
                        width: '48%',
                    }}
                    onMouseOver={(e) => {
                        if (usuario) e.currentTarget.style.backgroundColor = '#218838';
                    }}
                    onMouseOut={(e) => {
                        if (usuario) e.currentTarget.style.backgroundColor = '#28a745';
                    }}
                >
                    Aceptar Reserva
                </button>

                <button
                    onClick={onCancel}
                    style={{
                        backgroundColor: '#EF3340',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        width: '48%',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F16C63'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EF3340'}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ReservationForUser;
