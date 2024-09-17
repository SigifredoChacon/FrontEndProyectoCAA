import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Importa Routes y Route de react-router-dom
import UserList from '../components/User/UserList';
import UserFormCreate from '../components/User/UserFormCreate.jsx';
import UserFormEdit from '../components/User/UserFormEdit.jsx';
import { useUserEdit } from '../hooks/useUserEdit.js';

function UsersPage() {
    const { selectedUser, handleEditUser, handleUserUpdated } = useUserEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate(); // Hook para navegar entre rutas

    const handleUserCreated = () => {
        handleUserUpdated();
        setIsCreating(false);
        navigate('/users'); // Navegar de vuelta a la lista de usuarios
    };

    const handleAddUser = () => {
        setIsCreating(true);
        handleEditUser(null);
        navigate('/users/create'); // Navegar a la ruta de creación de usuario
    };

    const handleEdit = (user) => {
        handleEditUser(user);
        navigate(`/users/edit/${user.CedulaCarnet}`); // Navegar a la ruta de edición de usuario
    };


    return (
        <div>
            <h1>Gestión de Usuarios</h1>

            {/* Botón para agregar un nuevo usuario */}
            <button onClick={handleAddUser}>Agregar Usuario</button>

            <Routes>
                {/* Ruta para mostrar la lista de usuarios */}
                <Route path="/" element={<UserList onEdit={handleEdit} />} />

                {/* Ruta para crear un usuario */}
                <Route path="create" element={<UserFormCreate onUserCreated={handleUserCreated} />} />

                {/* Ruta para editar un usuario */}
                <Route
                    path="edit/:id"
                    element={<UserFormEdit selectedUser={selectedUser} onUserUpdated={handleUserCreated}  />}
                />
            </Routes>
        </div>
    );
}

export default UsersPage;
