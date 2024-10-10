import { useEffect, useState } from 'react';
import {getRooms} from "../services/roomService.jsx";
import {Badge, Card, Title} from "@tremor/react";
import {Link, useNavigate} from 'react-router-dom';

function AllRoomReservationPage() {
    const [rooms, setRooms] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveRooms();
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const data = await getRooms();
            const activeRooms = data.filter(room => room.Estado === 1);

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
            <Title style={{textAlign: 'center', fontSize: '2.5rem', margin: '20px 0'}}>
                Salas
            </Title>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80px',
                    left: '10px',
                    padding: '5px',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" style={{width: '32px', height: '32px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>


            </button>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {rooms.map((room) => (
                    <Link
                        to={{
                            pathname: "/reservationsRoom",

                        }}
                        state={{selectedRoom: room}}
                        key={room.id}
                    >
                        <Card style={{
                            width: '380px',
                            padding: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}>
                            <img src={room.imageUrl} alt={room.Nombre}
                                 style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px'}}/>
                            <h3 style={{marginTop: '12px', marginBottom: '8px', fontSize: '1.25rem'}}>{room.Nombre}</h3>
                            <p style={{
                                marginTop: '12px',
                                marginBottom: '8px',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                            }}>{room.Descripcion}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AllRoomReservationPage;
