import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { deleteReservation, getReservation} from '../services/reservationService.jsx';
import {getNameRoomById, getRoomById} from '../services/roomService.jsx';
import { getCubicleById } from '../services/cubicleService.jsx';
import { usePersonalReservation } from '../hooks/usePersonalReservation.js';
import { getUserById } from '../services/userService.jsx';
import LockDayModal from '../components/Reservations/LockDayModal.jsx';

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Title,
    Badge,
    TextInput,
} from '@tremor/react';

import ReservationFormEdit from '../components/Reservations/ReservationFormEdit.jsx';

function AllReservationPage() {
    const {selectedReservation, handleEditReservation, handleReservationUpdated } = usePersonalReservation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Cantidad de elementos por página

    useEffect(() => {
        fetchReservations();
    }, [isModalOpen]);

    const fetchReservations = async () => {
        try {
            const data = await getReservation();
            const reservationsWithDetails = await Promise.all(data.map(async (reservation) => {

                let placeName = '';
                let userName = '';

                if (reservation.idCubiculo) {
                    const cubicle = await getCubicleById(reservation.idCubiculo);
                    placeName = cubicle.Nombre;
                } else if (reservation.idSala) {
                    const room = await getNameRoomById(reservation.idSala);
                    placeName = room.Nombre;
                }

                const user = await getUserById(reservation.idUsuario);
                userName = user.Nombre;
                return { ...reservation, placeName, userName };
            }));


            const today = new Date();


            const futureReservations = reservationsWithDetails.filter(reservation => new Date(reservation.Fecha) >= today);
            const pastReservations = reservationsWithDetails.filter(reservation => new Date(reservation.Fecha) < today);


            futureReservations.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));


            pastReservations.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

            const sortedReservations = [...futureReservations, ...pastReservations];

            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error al obtener las reservaciones:', error);
        }
    };


    const handleEditPersonalReservation = (reservation) => {

        handleEditReservation(reservation);
        navigate(`/allReservations/edit/${reservation.idReservacion}`);
    };

    const handleReservationCreated = () => {
        handleReservationUpdated();
        navigate('/allReservations');
    };

    const handleDeleteReservation = async (idReservacion) => {
        try {
            await deleteReservation(idReservacion);
            setReservations(reservations.filter((reservation) => reservation.idReservacion !== idReservacion));
        } catch (error) {
            console.error('Error al eliminar la reservación:', error);
        }
    };


    const handlelockDay = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = reservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservations.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/allReservations/edit/");


    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <button
                onClick={() => navigate('/manageReservations')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            <Routes>
                <Route path="lockDayModal" element={<LockDayModal/>}/>
            </Routes>
            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>
                        Reservaciones Generales
                    </h1>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                        <button
                            onClick={handlelockDay}
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
                            Bloquear Fecha
                        </button>
                    </div>
                </>
            )}
            <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
                <Title>
                    Reservaciones Generales
                    <Badge style={{
                        marginLeft: '8px',
                        backgroundColor: '#00000010',
                        color: '#327aff',
                        borderRadius: '17px',
                        padding: '3px 7px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}>
                        {reservations.length}
                    </Badge>
                </Title>

                <Routes>
                    <Route
                        path="edit/:id"
                        element={<ReservationFormEdit selectedPersonalReservation={selectedReservation}
                                                      onReservationUpdated={handleReservationCreated}/>}
                    />
                </Routes>

                {!isOnCreateOrEditPage && (
                    <Table className="mt-8">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Cedula/Carnet</TableHeaderCell>
                                <TableHeaderCell>Usuario</TableHeaderCell>
                                <TableHeaderCell>Fecha</TableHeaderCell>
                                <TableHeaderCell>Hora Inicio</TableHeaderCell>
                                <TableHeaderCell>Hora Fin</TableHeaderCell>
                                <TableHeaderCell>Lugar</TableHeaderCell>
                                <TableHeaderCell>Observaciones</TableHeaderCell>
                                <TableHeaderCell>Refrigerio</TableHeaderCell>
                                <TableHeaderCell>Recursos</TableHeaderCell>
                                <TableHeaderCell>Acciones</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentReservations.map((reservation) => (
                                <TableRow key={reservation.idReservacion}>
                                    <TableCell>{reservation.idUsuario}</TableCell>
                                    <TableCell>{reservation.userName}</TableCell>
                                    <TableCell>{new Date(reservation.Fecha).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</TableCell>
                                    <TableCell>{reservation.HoraInicio}</TableCell>
                                    <TableCell>{reservation.HoraFin}</TableCell>
                                    <TableCell>{reservation.placeName}</TableCell>
                                    <TableCell>{reservation.idCubiculo ? 'N/A' : reservation.Observaciones}</TableCell>
                                    <TableCell>{reservation.idCubiculo ? 'N/A' : (reservation.Refrigerio ? 'Sí' : 'No')}</TableCell>
                                    <TableCell>{reservation.idCubiculo ? 'N/A' : reservation.recursos?.map(recurso => recurso.NombreRecurso).join(', ')}</TableCell>
                                    <TableCell>
                                        {new Date(reservation.Fecha) >= new Date() ? (
                                            <>
                                                {reservation.idSala && (
                                                    <button
                                                        onClick={() => handleEditPersonalReservation(reservation)}
                                                        style={{marginRight: '8px'}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                             fill="currentColor" className="size-6">
                                                            <path
                                                                d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/>
                                                            <path
                                                                d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteReservation(reservation.idReservacion)}
                                                    style={{marginRight: '8px'}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                         fill="currentColor" className="size-6">
                                                        <path
                                                            d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"/>
                                                        <path fillRule="evenodd"
                                                              d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <span>Acciones no disponibles</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                )}
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                    >
                        Siguiente
                    </button>
                </div>
            </Card>
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <LockDayModal onCancel={handleCloseModal}/>
                </div>
            )}

        </div>
    );
}

export default AllReservationPage;
