// src/pages/AddUserPage.jsx
import { useState } from 'react';
import UserFormCreate from '../components/User/UserFormCreate.jsx'; // Reutilizamos el componente UserFormCreate
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redireccionar después de agregar

function AddUserPage() {
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [user, setUser] = useState({ name: '', email: '' }); // Estado para almacenar los datos del nuevo usuario

    // Maneja la redirección después de agregar un usuario
    const handleUserAdded = () => {
        navigate('/users'); // Redirige a la página de lista de usuarios después de agregar el usuario
    };

    return (
        <div>
            <h1>Agregar Nuevo Usuario</h1>
            {/* Reutilizamos UserFormCreate para agregar un nuevo usuario */}
            <UserFormCreate selectedUser={user} onUserUpdated={handleUserAdded} /> {/* Pasamos user y la función de callback */}
        </div>
    );
}

export default AddUserPage;
