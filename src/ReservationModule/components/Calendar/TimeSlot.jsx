import React from 'react';
import PropTypes from 'prop-types';
import {useAuthContext} from "../../../SecurityModule/hooks/useAuthContext.js";
import Swal from "sweetalert2";


const TimeSlot = ({ day, time, isReserved, onReserve, disabled }) => {
    const {user} = useAuthContext();
    const handleClick = () => {
        if(!user) {
            Swal.fire({
                title: '¡Tienes que estar registrado!',
                text: 'Para poder realizar una reservación, por favor, inicia sesión 🤗',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'bg-pantone-blue text-white px-4 py-2 rounded hover:bg-pantone-blue/80 mr-2'
                },
                buttonsStyling: false
            });
            return;
        }
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
                ? '#EF3340'
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
            {isReserved === 'reserved' ? 'Reservado' : isReserved === 'selected' ? 'Seleccionado' : 'Disponible'}
        </button>
    );
};

TimeSlot.propTypes = {
    day: PropTypes.instanceOf(Date).isRequired,
    time: PropTypes.string.isRequired,
    isReserved: PropTypes.oneOf(['reserved', 'available', 'selected']),
    onReserve: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default TimeSlot;
