import { useState } from 'react';
import UserList from '../components/User/UserList';
import UserFormCreate from '../components/User/UserFormCreate.jsx';
import UserFormEdit from '../components/User/UserFormEdit.jsx'; // Componente para editar
import { useUserEdit } from '../hooks/useUserEdit.js'; // Importa el hook personalizado

function UsersPage() {
    const { selectedUser, handleEditUser, handleUserUpdated } = useUserEdit(); // Usa el hook personalizado
    const [isCreating, setIsCreating] = useState(false); // Estado para controlar el modo de creación

    const handleUserCreated = () => {
        // Actualiza la lista de usuarios o cualquier otra acción después de crear un usuario
        handleUserUpdated(); // Llama a la función de limpieza de usuario seleccionado
        setIsCreating(false); // Oculta el formulario de creación después de agregar un usuario
    };

    // Función para manejar la apertura del formulario de creación
    const handleAddUser = () => {
        setIsCreating(true); // Cambia el estado para mostrar el formulario de creación
        handleEditUser(null); // Limpia el usuario seleccionado
    };

    return (
        <div>
            <h1>Gestión de Usuarios</h1>

            {/* Botón para agregar un nuevo usuario */}
            <button onClick={handleAddUser}>Agregar Usuario</button>

            {/* Mostrar solo el formulario de creación si estamos en modo de creación */}
            {isCreating && !selectedUser && (
                <UserFormCreate onUserCreated={handleUserCreated} />
            )}

            {/* Mostrar solo el formulario de edición si hay un usuario seleccionado y no estamos en modo de creación */}
            {selectedUser && !isCreating && (
                <UserFormEdit selectedUser={selectedUser} onUserUpdated={handleUserUpdated} />
            )}

            {/* Lista de usuarios */}
            <UserList onEdit={handleEditUser} /> {/* Pasa la función handleEditUser como onEdit */}
        </div>
    );
}

export default UsersPage;
