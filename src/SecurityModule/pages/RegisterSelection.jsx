import React from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import UserList from "../components/User/UserList.jsx";
import RegisterStudentPage from "./RegisterPage.jsx";
import BackButton from "../../utils/BackButton.jsx";

function RegisterSelection() {
    const navigate = useNavigate();

    const handleStudentClick = () => {
        navigate('/register/student');
    };

    const handleTeacherClick = () => {
        navigate('/register/teacher');
    };

    return (
        <>
        <BackButton/>
        <div className="min-h-screen flex items-center justify-center bg-gray p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-[#002855] text-white py-6 px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-wide">Crea tu cuenta</h2>
                    <p className="mt-2 text-gray-200 text-sm">Elige cómo quieres registrarte</p>
                </div>

                {/* Opciones */}
                <div className="p-8 flex flex-col gap-6">
                    <button
                        onClick={handleStudentClick}
                        className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#002855] to-[#0353a4] text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0L3 9m9 5l9-5" />
                        </svg>
                        <span>Registrarme como Estudiante</span>
                    </button>

                    <button
                        onClick={handleTeacherClick}
                        className="flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-[#002855] text-[#002855] font-semibold text-lg shadow-sm hover:bg-[#002855] hover:text-white hover:shadow-md hover:scale-[1.03] transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Registrarme como Profesor</span>
                    </button>
                </div>

            </div>
        </div>
        </>

    );
}

export default RegisterSelection;
