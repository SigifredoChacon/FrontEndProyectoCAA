import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="
                absolute
                top-28
                left-10
                z-50
                cursor-pointer
                transform
                transition-transform
                duration-300
                hidden
                md:block
                hover:scale-125
            "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: '40px', height: '50px' }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        </button>
    );
};

export default BackButton;
