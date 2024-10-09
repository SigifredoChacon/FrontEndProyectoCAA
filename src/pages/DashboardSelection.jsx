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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">¿Qué deseas consultar?</h1>
            <div className="grid grid-cols-2 gap-16">
                <button
                    onClick={handleRoomClick}
                    className="w-64 h-64 bg-gray-200 rounded-xl hover:bg-gray-300 transition flex flex-col items-center justify-center shadow-lg"
                >
                    <img src={icons.room} alt="Room Icon" className="w-20 h-20 mb-4" />
                    <span className="text-2xl font-semibold text-gray-700">Salas</span>
                </button>

                <button
                    onClick={handleCubicleClick}
                    className="w-64 h-64 bg-gray-200 rounded-xl hover:bg-gray-300 transition flex flex-col items-center justify-center shadow-lg"
                >
                    <img src={icons.cubicle} alt="Cubicle Icon" className="w-20 h-20 mb-4" />
                    <span className="text-2xl font-semibold text-gray-700">Cubículos</span>
                </button>
            </div>
        </div>
    );
}

export default DashboardSelection;
