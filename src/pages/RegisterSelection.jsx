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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
