import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRating }) => {
    const [hover, setHover] = useState(null);  // Para manejar el hover sobre las estrellas

    return (
        <div className="star-rating" style={{ display: 'flex', gap: '5px' }}>  {/* Asegura que las estrellas estén alineadas horizontalmente */}
            {[...Array(5)].map((star, index) => {
                const starValue = index + 1;

                return (
                    <label key={starValue}>
                        <input
                            type="radio"
                            name="rating"
                            value={starValue}
                            onClick={() => onRating(starValue)} // Establece la calificación
                            style={{ display: 'none' }}  // Ocultar el radio button
                        />
                        <svg
                            className="star"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(starValue)}  // Cambia el estado al pasar el ratón
                            onMouseLeave={() => setHover(null)}  // Vuelve al valor original al salir
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ cursor: 'pointer' }}  // Añade un cursor pointer para que se vea clicable
                        >
                            <path d="M12 .587l3.668 7.431 8.167 1.194-5.895 5.747 1.391 8.111L12 18.896l-7.331 3.847 1.391-8.111L.165 9.212l8.167-1.194L12 .587z"/>
                        </svg>
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
