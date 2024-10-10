import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RoomList from '../components/Room/RoomList.jsx';
import RoomFormCreate from '../components/Room/RoomFormCreate.jsx';
import RoomFormEdit from '../components/Room/RoomFormEdit.jsx';
import { useRoomEdit } from '../hooks/useRoomEdit.js';
import { lockRoom, unLockRoom } from '../services/roomService.jsx';

function RoomsPage() {
    const { selectedRoom, handleEditRoom, handleRoomUpdated } = useRoomEdit();
    const [isCreating, setIsCreating] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const [isRoomLocked, setIsRoomLocked] = useState(() => {
        const savedState = localStorage.getItem('isRoomLocked');
        return savedState === 'true';
    });

    const handleRoomCreated = () => {
        handleRoomUpdated();
        setIsCreating(false);
        navigate('/rooms');
    };

    const handleAddRoom = () => {
        setIsCreating(true);
        handleEditRoom(null);
        navigate('/rooms/create');
    };


    const handleBlockRoom = async () => {
        if (isRoomLocked) {
            await unLockRoom();
            setIsRoomLocked(false);
            localStorage.setItem('isRoomLocked', 'false');
        } else {
            await lockRoom();
            setIsRoomLocked(true);
            localStorage.setItem('isRoomLocked', 'true');
        }

        setRefresh(prev => !prev);
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

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
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
                                transition: 'background-color 0.3s ease',
                                marginRight: '10px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#004080'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#002855'}
                        >
                            Agregar Sala
                        </button>

                        <button
                            onClick={handleBlockRoom}
                            style={{
                                backgroundColor: isRoomLocked ? '#28a745' : '#fc1919',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = isRoomLocked ? '#4bd162' : '#fe5757'}
                            onMouseOut={(e) => e.target.style.backgroundColor = isRoomLocked ? '#28a745' : '#fc1919'}
                        >
                            {isRoomLocked ? 'Desbloquear Salas' : 'Bloquear Salas'}
                        </button>

                    </div>
                </>
            )}

            <Routes>
                <Route path="/" element={<RoomList onEdit={handleEdit} reload={refresh}/>}/>
                <Route path="create" element={<RoomFormCreate onRoomCreated={handleRoomCreated}/>}/>
                <Route path="edit/:id"
                       element={<RoomFormEdit selectedRoom={selectedRoom} onRoomUpdated={handleRoomCreated}/>}/>
            </Routes>
        </div>
    );
}

export default RoomsPage;
