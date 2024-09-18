import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Importa Routes y Route de react-router-dom
import RoomList from '../components/Room/RoomList.jsx';
import RoomFormCreate from '../components/Room/RoomFormCreate.jsx';
import RoomFormEdit from '../components/Room/RoomFormEdit.jsx';
import { useRoomEdit } from '../hooks/useRoomEdit.js';

function RoomsPage() {
    const { selectedRoom, handleEditRoom, handleRoomUpdated } = useRoomEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate(); // Hook para navegar entre rutas

    const handleRoomCreated = () => {
        handleRoomUpdated();
        setIsCreating(false);
        navigate('/rooms'); // Navegar de vuelta a la lista de usuarios
    };

    const handleAddRoom = () => {
        setIsCreating(true);
        handleEditRoom(null);
        navigate('/rooms/create'); // Navegar a la ruta de creación de usuario
    };

    const handleEdit = (room) => {
        handleEditRoom(room);
        navigate(`/rooms/edit/${room.idSala}`); // Navegar a la ruta de edición de usuario
    };


    return (
        <div>
            <h1>Gestión de Salas</h1>

            {/* Botón para agregar un nuevo usuario */}
            <button onClick={handleAddRoom}>Agregar Salas</button>

            <Routes>
                {/* Ruta para mostrar la lista de usuarios */}
                <Route path="/" element={<RoomList onEdit={handleEdit} />} />

                {/* Ruta para crear un usuario */}
                <Route path="create" element={<RoomFormCreate onRoomCreated={handleRoomCreated} />} />

                {/* Ruta para editar un usuario */}
                <Route
                    path="edit/:id"
                    element={<RoomFormEdit selectedRoom={selectedRoom} onRoomUpdated={handleRoomCreated}  />}
                />
            </Routes>
        </div>
    );
}

export default RoomsPage;
