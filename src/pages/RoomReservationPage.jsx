import React, {useEffect, useState} from "react";
import Calendar from "../components/Calendar/Calendar.jsx";


export function RoomReservationPage(){

    const handleReservationsChange = (newReservations) => {
        console.log('Lista de reservas actualizada:', newReservations);

    };

    return (
        <div className="p-8">
            <div className="grid grid-cols-5 grid-rows-[repeat(3,auto)] gap-3">
                {/* Imagen y Descripción */}
                <div className="col-span-2 row-span-3">
                    <img
                        src="/foto.png" // Aquí reemplaza con la URL de tu imagen
                        alt="Sala de reuniones"
                        className="w-full h-auto object-cover rounded-lg"
                    />
                    <p className="mt-2 text-justify text-sm text-gray-700">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                    </p>
                </div>

                {/* Calendario */}
                <div className="col-span-3 row-span-3">
                    <Calendar onReservationsChange={handleReservationsChange}/>
                </div>

                {/* Refrigerio y Recursos */}
                <div className="col-span-2 row-span-1 bg-gray-200 p-4 rounded-lg">
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
                    <label className="block mt-4 mb-2 font-bold">Recursos</label>
                    <select multiple className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Proyector</option>
                        <option>Pizarra</option>
                        <option>Pilot</option>
                    </select>
                </div>

                {/* Observaciones */}
                <div className="col-span-3 row-span-1 bg-gray-200 p-4 rounded-lg">
      <textarea
          className="w-full p-2 rounded-md border border-gray-300"
          rows="4"
          placeholder="Observaciones"
      />
                </div>

                {/* Botones */}
                <div className="col-span-2 row-span-1 flex justify-end items-center gap-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Cancelar
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        Reservar
                    </button>
                </div>
            </div>
        </div>


    )
}