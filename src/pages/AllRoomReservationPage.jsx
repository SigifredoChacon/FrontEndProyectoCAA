import { useEffect, useState } from 'react';
import {getRooms} from "../services/roomService.jsx";
import {Badge, Card, Title} from "@tremor/react";
import {Link} from 'react-router-dom';

function AllRoomReservationPage() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchActiveRooms();
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const data = await getRooms();
            const activeRooms = data.filter(room => room.Estado === 1); // Filtrar por estado 1 (activas)

            const roomsWithImageUrls = activeRooms.map((room) => {
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

    return (
        <div>
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
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                {rooms.map((room) => (
                    <Link to="/rooms">
                        <Card style={{
                            height: '500px',
                            width: '380px',
                            padding: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer', // Cambia el cursor al pasar sobre la tarjeta
                        }}>
                            <img src={room.imageUrl} alt={room.Nombre}
                                 style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px'}}/>
                            <h3 style={{marginTop: '12px', marginBottom: '8px', fontSize: '1.25rem'}}>{room.Nombre}</h3>
                            <p style={{marginBottom: '12px', color: '#666', textAlign: 'center'}}>
                                {room.Estado === 1 ? 'Activa' : 'Desactivada'}
                            </p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AllRoomReservationPage;
