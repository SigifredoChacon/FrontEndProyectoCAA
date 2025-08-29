import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getRooms, deleteRoom } from '../../services/roomService.jsx';
import {
    Card,
    Title,
    Badge
} from '@tremor/react';
import Swal from "sweetalert2";
import {deleteReservation} from "../../services/reservationService.jsx";

function RoomList({ onEdit, reload}) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, [reload]);

    const fetchRooms = async () => {
        try {
            const data = await getRooms();
            const roomsWithImageUrls = data.map((room) => {
                if (room.Imagen) {
                    room.imageUrl = `data:image/jpeg;base64,${room.Imagen}`;
                }
                return room;
            });
            setRooms(roomsWithImageUrls);
        } catch (error) {
            console.error('Error al obtener las salas:', error);
        }
    };


    const handleDelete = async (id) => {

        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar esta sala?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRoom(id);
                    setRooms(rooms.filter((room) => room.idSala !== id));

                    await Swal.fire({
                        title: '¡Eliminada!',
                        text: 'Se ha eliminado la sala con éxito',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: error.response.data.message,
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });
                }
            }
        });
    };


    return (
        <div style={{marginBottom: '200px'}}>
            <Title>
                Salas
                <Badge style={{
                    marginTop: '16px',
                    marginBottom: '16px',
                    marginLeft: '8px',
                    backgroundColor: '#00000010',
                    color: '#327aff',
                    borderRadius: '17px',
                    padding: '3px 7px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                }}>{rooms.length}</Badge>
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' , justifyContent: 'center' }}>
                {rooms.map((room) => (
                    <Card key={room.idSala} style={{
                        width: '380px',
                        padding: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <img src={room.imageUrl} alt={room.Nombre}
                             style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px'}}/>
                        <h3 style={{marginTop: '12px', marginBottom: '8px', fontSize: '1.25rem'}}>{room.Nombre}</h3>
                        <p style={{marginBottom: '12px', color: '#666', textAlign: 'center'}}>
                            {room.Estado === true ? 'Activa' : 'Bloqueada'}
                        </p>
                        <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                            <button onClick={() => onEdit(room)}
                                    style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6"
                                     style={{width: '24px', height: '24px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                </svg>
                            </button>
                            <button onClick={() => handleDelete(room.idSala)}
                                    style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6"
                                     style={{width: '24px', height: '24px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

RoomList.propTypes = {
    onEdit: PropTypes.func.isRequired,
};

export default RoomList;
