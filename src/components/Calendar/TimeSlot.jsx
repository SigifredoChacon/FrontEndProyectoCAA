import React from 'react';
import PropTypes from 'prop-types';

const TimeSlot = ({ day, time, isReserved, onReserve, disabled }) => {
    const handleClick = () => {
        if (!disabled) {
            onReserve(day, time);
        }
    };

    // Estilos del botón basado en el estado de reserva
    const buttonStyle = {
        width: '100%',
        height: '40px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor:
            isReserved === 'reserved'
                ? '#ff4d4d' // Rojo si está reservado
                : isReserved === 'selected'
                    ? '#4caf50' // Verde si está seleccionado
                    : '#e0e0e0', // Gris si está disponible o deshabilitado
        color: '#ffffff',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    };

    return (
        <button
            style={buttonStyle}
            onClick={handleClick}
            disabled={disabled || isReserved === 'reserved'} // Deshabilitado si está reservado o disabled es true
        >
            {isReserved === 'reserved' ? 'Reservado' : isReserved === 'selected' ? 'Seleccionado' : 'Disponible'}
        </button>
    );
};

TimeSlot.propTypes = {
    day: PropTypes.instanceOf(Date).isRequired, // Asegurarse que "day" sea una instancia de Date
    time: PropTypes.string.isRequired,
    isReserved: PropTypes.oneOf(['reserved', 'available', 'selected']),
    onReserve: PropTypes.func.isRequired,
    disabled: PropTypes.bool, // Prop para manejar si el botón está deshabilitado
};

export default TimeSlot;
