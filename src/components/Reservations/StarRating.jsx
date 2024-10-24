import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRating }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="star-rating" style={{ display: 'flex', gap: '5px' }}>
            {[...Array(5)].map((star, index) => {
                const starValue = index + 1;

                return (
                    <label key={starValue}>
                        <input
                            type="radio"
                            name="rating"
                            value={starValue}
                            onClick={() => onRating(starValue)}
                            style={{ display: 'none' }}
                        />
                        <svg
                            className="star"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(null)}
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ cursor: 'pointer' }}
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
