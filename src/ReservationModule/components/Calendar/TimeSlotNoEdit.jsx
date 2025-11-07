import React from 'react';
import PropTypes from 'prop-types';

const TimeSlot = ({ day, time, isReserved, onReserve, disabled }) => {
    const handleClick = () => {
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
                    : isReserved === 'userReserved'
                        ? "bg-pantone-blue text-white"
                        : isReserved === 'selected'
                            ? "bg-pantone-blue text-white"
                            : "bg-white text-pantone-blue border border-pantone-blue/30 hover:bg-pantone-blue-50",
                disabled && isReserved !== 'reserved' && isReserved !== 'userReserved'
                    ? "bg-slate-200 text-slate-500 border border-slate-300 hover:bg-slate-200"
                    : ""
            ].join(' ')}
        >

            <span className="hidden sm:inline">
        {isReserved === 'reserved'
            ? 'Reservado'
            : isReserved === 'userReserved'
                ? 'Reserva'
                : isReserved === 'selected'
                    ? 'Seleccionado'
                    : 'Disponible'}
    </span>
            <span className="sm:hidden">
        {isReserved === 'reserved'
            ? 'Res.'
            : isReserved === 'userReserved'
                ? 'Tu Res.'
                : isReserved === 'selected'
                    ? 'Sel.'
                    : 'Disp.'}
    </span>
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
