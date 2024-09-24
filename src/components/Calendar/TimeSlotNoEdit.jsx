import React from 'react';
import PropTypes from 'prop-types';

const TimeSlot = ({ day, time, isReserved, onReserve, disabled }) => {
    const handleClick = () => {
        if (!disabled) {
            onReserve(day, time);
        }
    };

    const buttonStyle = {
        width: '100%',
        height: '40px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor:
            isReserved === 'reserved'
                ? '#ff4d4d'
                : isReserved === 'userReserved'
                    ? '#1E90FF'
                    : isReserved === 'selected'
                        ? '#4caf50'
                        : '#e0e0e0',
        color: '#ffffff',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    };

    return (
        <button
            style={buttonStyle}
            onClick={handleClick}
            disabled={disabled || isReserved === 'reserved'}
        >
            {isReserved === 'reserved'
                ? 'Reservado'
                : isReserved === 'userReserved'
                    ? 'Reservado por Ti'
                    : isReserved === 'selected'
                        ? 'Seleccionado'
                        : 'Disponible'}
        </button>
    );
};

TimeSlot.propTypes = {
    day: PropTypes.instanceOf(Date).isRequired,
    time: PropTypes.string.isRequired,
    isReserved: PropTypes.oneOf(['reserved', 'available', 'selected', 'userReserved']),
    onReserve: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default TimeSlot;
