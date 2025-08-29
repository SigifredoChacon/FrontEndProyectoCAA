import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RoomList from '../components/Room/RoomList.jsx';
import RoomFormCreate from '../components/Room/RoomFormCreate.jsx';
import RoomFormEdit from '../components/Room/RoomFormEdit.jsx';
import { useRoomEdit } from '../hooks/useRoomEdit.js';
import {deleteRoom, lockRoom, unLockRoom} from '../services/roomService.jsx';
import Swal from "sweetalert2";

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
            setRefresh(prev => !prev);
        } else {
            Swal.fire({
                title: '¡Bloquear Salas!',
                text: '¿Estás seguro de que deseas bloquear todas las salas?',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await lockRoom();
                        setIsRoomLocked(true);
                        localStorage.setItem('isRoomLocked', 'true');
                        setRefresh(prev => !prev);

                        await Swal.fire({
                            title: '¡Bloqueado!',
                            text: 'Se han bloqueado las salas correctamente',
                            icon: 'success',
                            timer: 1000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });

                    } catch (error) {
                        await Swal.fire({
                            title: '¡Error!',
                            text: 'No se han podido bloquear las salas',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });
                    }
                }
            });

        }




    };

    const handleEdit = (room) => {
        handleEditRoom(room);
        navigate(`/rooms/edit/${room.idSala}`);
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname === "/rooms/create" || location.pathname.startsWith("/rooms/edit");

    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <button
                onClick={() => navigate('/manageReservations')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
                style={{
                    background: 'none',
                    border: 'none',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginTop: '50px'}}>
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
