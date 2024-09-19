
import './App.css'
import UsersPage from "./pages/UserPage.jsx";
import RoomsPage from "./pages/RoomPage.jsx";
import CubiclesPage from "./pages/CubiclePage.jsx";
import React from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';



function App() {
    return (
        <Router> {/* BrowserRouter debe envolver todo */}
            <div>
                {/* Botón para navegar a la lista de usuarios */}
                <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px'}}>
                    {/* Botón para navegar a la lista de usuarios */}
                    <NavigationButtonUsers/>
                    <NavigationButtonRooms/>
                    <NavigationButtonCubicles/>
                </div>

                {/* Rutas de la aplicación */}
                <Routes>
                    <Route path="/users/*" element={<UsersPage/>}/>
                    <Route path="/rooms/*" element={<RoomsPage/>}/>
                    <Route path="/cubicles/*" element={<CubiclesPage/>}/>
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

function NavigationButtonCubicles() {
    const navigate = useNavigate(); // useNavigate debe estar dentro del Router para funcionar

    return (
        <button onClick={() => navigate('/cubicles')}>Ir a Cubiculos</button> // El botón ahora debería funcionar correctamente
    );
}

export default App
