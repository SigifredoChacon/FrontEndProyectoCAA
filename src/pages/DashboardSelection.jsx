import React from 'react';
import { useNavigate } from 'react-router-dom';

const icons = {
    room: "src/assets/rooms.svg",
    cubicle: "src/assets/cubicle.svg"
};

function DashboardSelection() {
    const navigate = useNavigate();

    const handleRoomClick = () => {
        navigate('/dashboard/rooms');
    };

    const handleCubicleClick = () => {
        navigate('/dashboard/cubicles');
    };

    return (
        <div className="h-screen flex flex-col items-center justify-start bg-gray-100 pt-40">
            <button
                onClick={() => navigate('/manageReservations')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80px',
                    left: '10px',
                    padding: '5px',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" style={{width: '32px', height: '32px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>


            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">¿Qué deseas consultar?</h1>
            <div className="grid grid-cols-2 gap-16">

                <button
                    onClick={handleRoomClick}
                    className="w-64 h-64 bg-gray-200 rounded-xl hover:bg-gray-300 transition flex flex-col items-center justify-center shadow-lg"
                >
                    <img src={icons.room} alt="Room Icon" className="w-20 h-20 mb-4"/>
                    <span className="text-2xl font-semibold text-gray-700">Salas</span>
                </button>

                <button
                    onClick={handleCubicleClick}
                    className="w-64 h-64 bg-gray-200 rounded-xl hover:bg-gray-300 transition flex flex-col items-center justify-center shadow-lg"
                >
                    <img src={icons.cubicle} alt="Cubicle Icon" className="w-20 h-20 mb-4"/>
                    <span className="text-2xl font-semibold text-gray-700">Cubículos</span>
                </button>
            </div>
        </div>
    );
}

export default DashboardSelection;
