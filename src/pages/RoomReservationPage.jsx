import React, {useEffect, useState} from "react";
import CalendarRooms from "../components/Calendar/CalendarRooms.jsx";


const initialRoomReservationState = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idSala: 0,
    idUsuario: 0,
    observaciones: '',
    refrigerio: false,
    recursos: [],
};

function groupConsecutiveTimes(timeSlots) {
    const grouped = [];
    let currentGroup = [];

    for (let i = 0; i < timeSlots.length; i++) {
        if (currentGroup.length === 0) {
            currentGroup.push(timeSlots[i]);
        } else {
            const lastTime = currentGroup[currentGroup.length - 1];
            const currentTime = timeSlots[i];

            const lastDate = new Date(`1970-01-01T${lastTime}:00`);
            const currentDate = new Date(`1970-01-01T${currentTime}:00`);

            if (currentDate - lastDate === 3600000) { // Diferencia de 1 hora
                currentGroup.push(currentTime);
            } else {
                grouped.push(currentGroup);
                currentGroup = [currentTime];
            }
        }
    }

    if (currentGroup.length > 0) {
        grouped.push(currentGroup);
    }

    return grouped;
}


export function RoomReservationPage(){

    const handleReservationsChange = (newReservations) => {
        console.log('Lista de reservas actualizada:', newReservations);

    };

    return (
        <div className="p-8 max-w-full mx-auto">
            {/* Contenedor Principal */}
            <div className="flex flex-col md:flex-row items-start justify-start">

                {/* Imagen y Descripción */}
                <div className="flex-shrink-0 md:w-5/12 p-4 mt-8">
                    {/* Título de la Sala */}
                    <div className="text-center text-2xl font-bold mb-4 md:mb-2">
                        Sala 1
                    </div>
                    <div className="w-full h-full overflow-hidden"> {/* Contenedor de la imagen con tamaño fijo */}
                        <img
                            src="/foto3.png" // Reemplaza con la URL de tu imagen
                            alt="Sala de reuniones"
                            className="w-full h-full object-contain rounded-lg max-w-full max-h-full"
                        />
                    </div>
                    <div className="mt-4 text-justify text-sm text-gray-700 w-full max-w-md max-h-32 overflow-y-auto">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                        but also the leap into electronic typesetting, remaining essentially unchanged.
                    </div>
                </div>

                {/* Calendario y Controles */}
                <div className="flex-grow md:w-6/10 p-4">
                    {/* Calendario */}
                    <div className="bg-white w-full shadow-md rounded-lg p-4 mb-4 h-full">
                        <CalendarRooms onReservationsChange={handleReservationsChange}/>
                    </div>

                    {/* Refrigerio y Recursos */}
                    <div className="flex flex-col md:flex-row mb-4">
                        <div className="md:w-1/2 bg-gray-200 p-4 rounded-lg mb-4 md:mb-0 md:mr-2">
                            <label className="block mb-2 font-bold">Refrigerio</label>
                            <div>
                                <label className="mr-4">
                                    <input type="radio" name="refrigerio" value="si" className="mr-2"/>
                                    Sí
                                </label>
                                <label>
                                    <input type="radio" name="refrigerio" value="no" className="mr-2"/>
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gray-200 p-4 rounded-lg">
                            <label className="block mb-2 font-bold">Recursos</label>
                            <select multiple className="w-full p-2 border border-gray-300 rounded-md">
                                <option>Proyector</option>
                                <option>Pizarra</option>
                                <option>Pilot</option>
                            </select>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                <textarea
                    className="w-full p-2 rounded-md border border-gray-300"
                    rows="4"
                    placeholder="Observaciones"
                />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                            Cancelar
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
}