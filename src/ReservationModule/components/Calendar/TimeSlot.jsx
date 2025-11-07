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


    return (
        <button
            onClick={handleClick}
            disabled={disabled || isReserved === 'reserved'}
            className={[
                "w-full min-h-8 sm:min-h-9 rounded px-1 py-1 sm:px-2 sm:py-1.5",
                "text-[9px] sm:text-[10px] md:text-xs font-semibold transition shadow-sm",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-pantone-blue",
                "disabled:cursor-not-allowed",
                isReserved === 'reserved'
                    ? "bg-pantone-red text-white"
                    : isReserved === 'selected'
                        ? "bg-pantone-blue text-white"
                        : "bg-white text-pantone-blue border border-pantone-blue/30 hover:bg-pantone-blue-50",
                disabled && isReserved !== 'reserved'
                    ? "bg-slate-200 text-slate-500 border border-slate-300 hover:bg-slate-200"
                    : ""
            ].join(' ')}
        >

            <span className="hidden sm:inline">
        {isReserved === 'reserved' ? 'Reservado' : isReserved === 'selected' ? 'Seleccionado' : 'Disponible'}
    </span>
            <span className="sm:hidden">
        {isReserved === 'reserved' ? 'Res.' : isReserved === 'selected' ? 'Sel.' : 'Disp.'}
    </span>
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
