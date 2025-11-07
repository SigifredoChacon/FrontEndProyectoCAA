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
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <BackButton />

                <header className="text-center mt-4 mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-pantone-blue">
                        Salas
                    </h1>
                    <p className="mt-3 text-slate-600">
                        Elige un espacio para reservar y ver disponibilidad.
                    </p>
                </header>

                <div className="mx-auto mb-8 h-1.5 w-24 rounded-full bg-pantone-red" />

                <div className="flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
                    {rooms.map((room) => (
                        <Link
                            key={room.id}
                            to={{ pathname: "/reservationsRoom" }}
                            state={{ selectedRoom: room }}
                            aria-label={`Abrir ${room.Nombre}`}
                            className="group"
                        >
                            <article
                                className="
                                          w-[320px] sm:w-[360px] md:w-[380px]
                                          h-full flex flex-col
                                          overflow-hidden rounded-2xl bg-white
                                          border border-slate-200 shadow-sm
                                          transition-all duration-300
                                          hover:-translate-y-1 hover:shadow-lg hover:border-pantone-blue/30
                                        "
                            >
                                <div className="relative overflow-hidden">
                                    <div className="aspect-[4/3] w-full">
                                        <img
                                            src={room.imageUrl}
                                            alt={room.Nombre}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                        />
                                    </div>
                                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-inset transition group-hover:ring-2 group-hover:ring-pantone-blue/20" />
                                </div>

                                <div className="p-5 sm:p-6 flex flex-col grow">
                                    <h3 className="text-xl font-semibold text-pantone-blue tracking-tight">
                                        {room.Nombre}
                                    </h3>

                                    <p className="mt-2 text-slate-700 leading-relaxed line-clamp-3">
                                        {room.Descripcion}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="inline-flex items-center text-sm font-medium text-pantone-blue">
                                          Reservar
                                          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                          </svg>
                                        </span>

                                        <span className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs bg-pantone-blue-50 text-pantone-blue border border-pantone-blue/20">
                                          Disponible
                                        </span>
                                    </div>
                                </div>

                                <div className="h-1 w-full bg-gradient-to-r from-pantone-blue/80 via-pantone-blue to-pantone-blue/80" />
                            </article>
                        </Link>
                    ))}
                </div>


                {rooms.length === 0 && (
                    <div className="mt-16 text-center text-slate-500">
                        No hay salas para mostrar por ahora.
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllRoomReservationPage;
