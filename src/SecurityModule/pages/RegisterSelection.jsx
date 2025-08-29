import React from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import UserList from "../components/User/UserList.jsx";
import RegisterStudentPage from "./RegisterPage.jsx";

function RegisterSelection() {
    const navigate = useNavigate();

    const handleStudentClick = () => {
        navigate('/register/student');
    };

    const handleTeacherClick = () => {
        navigate('/register/teacher');
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <button
                onClick={() => navigate('/login')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
                style={{
                    background: 'none',
                    border: 'none',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900 text-center mb-6">Registrarse</h2>
                <div className="grid grid-cols-1 gap-y-4">
                    <button
                        onClick={handleStudentClick}
                        className="w-full py-2 px-4 bg-gray-300 text-gray-900 text-lg font-medium rounded-md hover:bg-gray-400"
                    >
                        Estudiante
                    </button>
                    <button
                        onClick={handleTeacherClick}
                        className="w-full py-2 px-4 bg-gray-300 text-gray-900 text-lg font-medium rounded-md hover:bg-gray-400"
                    >
                        Profesor
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterSelection;
