import React, { useEffect, useState } from 'react';
import {getRooms} from "../services/roomService.jsx";
import {Badge, Card, Title} from "@tremor/react";
import {Link, useNavigate} from 'react-router-dom';
import BackButton from "../../utils/BackButton.jsx";

function AllRoomReservationPage() {
    const [rooms, setRooms] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveRooms();
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const data = await getRooms();
            const activeRooms = data.filter(room => room.Estado === true);

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
        <>
        <BackButton/>
        <div style={{ paddingBottom: "200px" }} >
            <Title style={{textAlign: 'center', fontSize: '2.5rem', margin: '40px 0'}}>
                Salas
            </Title>

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
                            border: '2px solid #002855',
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
        </>
    );
}

export default AllRoomReservationPage;
