import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'; // Importa Routes y Route de react-router-dom
import UserList from '../components/User/UserList';
import UserFormCreate from '../components/User/UserFormCreate.jsx';
import UserFormEdit from '../components/User/UserFormEdit.jsx';
import { useUserEdit } from '../hooks/useUserEdit.js';

function UsersPage() {
    const {selectedUser, handleEditUser, handleUserUpdated} = useUserEdit();
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

    const location = useLocation();

    // Verifica si la ruta actual es '/create' o empieza con '/edit'
    const isOnCreateOrEditPage = location.pathname === "/users/create" || location.pathname.startsWith("/users/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            {/* Mostrar el título y el botón solo si no estás en la página de creación o edición */}
            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Gestión de Usuarios
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button
                            onClick={handleAddUser}
                            style={{
                                backgroundColor: '#002855',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#004080'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#002855'}
                        >
                            Agregar Usuario
                        </button>
                    </div>
                </>
            )}

            <Routes>
                {/* Ruta para mostrar la lista de usuarios */}
                <Route path="/" element={<UserList onEdit={handleEdit} />} />

                {/* Ruta para crear un usuario */}
                <Route path="create" element={<UserFormCreate onUserCreated={handleUserCreated} />} />

                {/* Ruta para editar un usuario */}
                <Route
                    path="edit/:id"
                    element={<UserFormEdit selectedUser={selectedUser} onUserUpdated={handleUserCreated} />}
                />
            </Routes>
        </div>
    );
}

export default UsersPage;
