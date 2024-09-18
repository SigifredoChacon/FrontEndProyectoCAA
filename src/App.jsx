
import './App.css'
import UsersPage from "./pages/UserPage.jsx";
import RoomsPage from "./pages/RoomPage.jsx";
import React from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';



function App() {
    return (
        <Router> {/* BrowserRouter debe envolver todo */}
            <div>
                {/* Botón para navegar a la lista de usuarios */}
                <NavigationButtonUsers />
                <NavigationButtonRooms />

                {/* Rutas de la aplicación */}
                <Routes>
                    <Route path="/users/*" element={<UsersPage />} /> {/* El asterisco permite que las rutas anidadas coincidan */}
                    <Route path="/rooms/*" element={<RoomsPage />} /> {/* El asterisco permite que las rutas anidadas coincidan */}

                </Routes>
            </div>
        </Router>
    );
}

function NavigationButtonUsers() {
    const navigate = useNavigate(); // useNavigate debe estar dentro del Router para funcionar

    return (
        <button onClick={() => navigate('/users')}>Ir a Usuarios</button> // El botón ahora debería funcionar correctamente
    );
}

function NavigationButtonRooms() {
    const navigate = useNavigate(); // useNavigate debe estar dentro del Router para funcionar

    return (
        <button onClick={() => navigate('/rooms')}>Ir a Salas</button> // El botón ahora debería funcionar correctamente
    );
}

export default App
