// src/components/TimeSlot.js
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
        borderRadius: '4px', // Bordes redondeados
        cursor: disabled ? 'not-allowed' : 'pointer', // Deshabilitar cursor si está deshabilitado
        backgroundColor:
            disabled
                ? '#e0e0e0' // Gris claro si está deshabilitado
                : isReserved === 'reserved'
                    ? '#ff4d4d' // Rojo si está reservado por otro
                    : isReserved === 'available'
                        ? '#e0e0e0' // Gris claro si está disponible
                        : '#4caf50', // Verde si lo selecciona
        color: isReserved === 'selected' ? '#ffffff' : 'grey', // Texto blanco si está seleccionado, gris en otros estados
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', // Transición suave
    };

    // Estilos del botón cuando el ratón pasa por encima
    const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor:
            isReserved === 'reserved'
                ? '#e53935' // Rojo más oscuro si está reservado
                : isReserved === 'available'
                    ? '#bdbdbd' // Gris más oscuro si está disponible
                    : '#388e3c', // Verde más oscuro si lo selecciona
    };

    // Texto del botón basado en el estado de reserva
    const buttonText = isReserved === 'reserved' ? 'Reservado' : isReserved === 'selected' ? 'Seleccionado' : 'Disponible';

    return (
        <button
            style={buttonStyle}
            onClick={handleClick}
            onMouseOver={(e) => {
                if (!disabled) e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
            }} // Efecto hover
            onMouseOut={(e) => {
                if (!disabled) e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
            }} // Resetear efecto
            disabled={disabled}
        >
            {buttonText}
        </button>
    );
};

TimeSlot.propTypes = {
    day: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isReserved: PropTypes.oneOf(['reserved', 'available', 'selected']), // Acepta diferentes estados
    onReserve: PropTypes.func.isRequired,
    disabled: PropTypes.bool, // Nuevo prop para manejar el deshabilitado
};

export default TimeSlot;
