import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'; // Importa Routes y Route de react-router-dom
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

    const location = useLocation();


    const isOnCreateOrEditPage = location.pathname === "/rooms/create" || location.pathname.startsWith("/rooms/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>

            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Gestión de Salas
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button
                            onClick={handleAddRoom}
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
                            Agregar Sala
                        </button>
                    </div>
                </>
            )}

            <Routes>
                <Route path="/" element={<RoomList onEdit={handleEdit}/>}/>
                <Route path="create" element={<RoomFormCreate onRoomCreated={handleRoomCreated}/>}/>
                <Route
                    path="edit/:id"
                    element={<RoomFormEdit selectedRoom={selectedRoom} onRoomUpdated={handleRoomCreated}/>}
                />
            </Routes>
        </div>
    );
}

export default RoomsPage;
