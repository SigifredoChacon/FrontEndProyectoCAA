
import './App.css'
import UsersPage from "./pages/UserPage.jsx";
import React from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Calendar from "./components/Calendar/Calendar.jsx";



function App() {
    return (
        <Router> {/* BrowserRouter debe envolver todo */}
            <div>
                {/* Botón para navegar a la lista de usuarios */}
                <NavigationButton />
                <Calendar />
                {/* Rutas de la aplicación */}
                <Routes>
                    <Route path="/users/*" element={<UsersPage />} /> {/* El asterisco permite que las rutas anidadas coincidan */}
                </Routes>
            </div>
        </Router>
    );
}

function NavigationButton() {
    const navigate = useNavigate(); // useNavigate debe estar dentro del Router para funcionar

    return (
        <button onClick={() => navigate('/users')}>Ir a Usuarios</button> // El botón ahora debería funcionar correctamente
    );
}

export default App
