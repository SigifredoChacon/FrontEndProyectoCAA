import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getReservationByUserId, deleteReservation } from '../services/reservationService.jsx';
import {getNameRoomById, getRoomById} from '../services/roomService.jsx';
import {getCubicleById, lockCubicle} from '../services/cubicleService.jsx';
import { useAuthContext } from '../../SecurityModule/hooks/useAuthContext.js';
import { usePersonalReservation } from '../hooks/usePersonalReservation.js';
import { getUserById } from '../../SecurityModule/services/userService.jsx';
import { shareReservation } from '../services/reservationService.jsx';
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
} from '@tremor/react';
import ReservationFormEdit from '../components/Reservations/ReservationFormEdit.jsx';
import ShareReservationModal from '../components/Reservations/ShareReservationModal.jsx';
import Swal from "sweetalert2";

function AllPersonalReservationPage() {
    const { user } = useAuthContext();
    const { selectedReservation, handleEditReservation, handleReservationUpdated } = usePersonalReservation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reservationToShare, setReservationToShare] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const fetchReservations = async (page=1 ) => {
        try {
            const data = await getReservationByUserId(user, page, itemsPerPage);
            console.log(data)
            console.log(page, itemsPerPage)
            const reservationsWithDetails = await Promise.all(data.reservations.map(async (reservation) => {
                let placeName = '';

                if (reservation.idCubiculo) {
                    const cubicle = await getCubicleById(reservation.idCubiculo);
                    placeName = cubicle.Nombre;
                } else if (reservation.idSala) {
                    const room = await getNameRoomById(reservation.idSala);
                    placeName = room.Nombre;
                }
                return { ...reservation, placeName };
            }));

            const today = new Date();


            const upcomingReservations = reservationsWithDetails.filter(reservation => new Date(reservation.Fecha) >= today);
            const pastReservations = reservationsWithDetails.filter(reservation => new Date(reservation.Fecha) < today);

            upcomingReservations.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
            pastReservations.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

            const sortedReservations = [...upcomingReservations, ...pastReservations];

            setReservations(sortedReservations);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error al obtener las reservaciones:', error);
        }
    };



    const handleEditPersonalReservation = (reservation) => {
        handleEditReservation(reservation);
        navigate(`/personalReservations/edit/${reservation.idReservacion}`);
    };

    const handleReservationCreated = () => {
        handleReservationUpdated();
        navigate('/personalReservations');
    };

    const handleDeleteReservation = async (idReservacion) => {
        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar esta reserva?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteReservation(idReservacion);
                    setReservations(reservations.filter((reservation) => reservation.idReservacion !== idReservacion));

                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Se ha eliminado la reservación con éxito',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        willClose: () => {
                            navigate('/personalReservations');
                        }
                    });

                    navigate('/personalReservations');
                } catch (error) {
                    console.error("Error al eliminar la reservación:", error);
                }
            }
        });
    };

    const handleOpenModal = (reservation) => {
        setReservationToShare(reservation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReservationToShare(null);
    };

    const handleShareReservation = async (emails) => {
        if (!reservationToShare) return;

        try {
            const userData = await getUserById(user);
            const userName = userData.Nombre;

            const reservationData = {
                correosDestinatarios: emails,
                nombreRemitente: userName,
                reservationDetails: reservationToShare,
                observaciones: reservationToShare.Observaciones,
                idSala: reservationToShare.idSala,
                idCubiculo: reservationToShare.idCubiculo,
                refrigerio: reservationToShare.Refrigerio,
            };

            await shareReservation(reservationData);

            Swal.fire({
                title: '¡Se compartió la reservación de manera exitosa!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
            handleCloseModal();
        } catch (error) {
            Swal.fire({
                title: '¡Error!',
                text: 'No se digitaron los correos a los que compartir la reservación',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchReservations(newPage);
        }
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/personalReservations/edit/");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            <button
                onClick={() => navigate('/')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>

            {!isOnCreateOrEditPage && (
                <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Mis Reservaciones
                </h1>
            )}
            <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px' }}>
                <Title>
                    Mis Reservaciones
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
                        element={<ReservationFormEdit selectedPersonalReservation={selectedReservation} onReservationUpdated={handleReservationCreated} />}
                    />
                </Routes>

                {!isOnCreateOrEditPage && (
                    <>
                        <Table className="mt-8">
                            <TableHead>
                                <TableRow>
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
                                {reservations.map((reservation) => (
                                    <TableRow key={reservation.idReservacion}>
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
                                            {new Date(reservation.Fecha) > new Date() ||
                                            (new Date(reservation.Fecha).toDateString() === new Date().toDateString() &&
                                                new Date().getHours() < parseInt(reservation.HoraInicio.split(':')[0])) ? (
                                                <>
                                                    {reservation.idSala && (
                                                        <button onClick={() => handleEditPersonalReservation(reservation)} style={{ marginRight: '8px' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z" />
                                                                <path d="M19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteReservation(reservation.idReservacion)} style={{ marginRight: '8px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                             className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleOpenModal(reservation)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                             fill="currentColor" className="size-6">
                                                            <path fillRule="evenodd"
                                                                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
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

                        {/* Paginador */}
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
                    </>
                )}
            </Card>
            <ShareReservationModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                handleShare={handleShareReservation}
            />
        </div>
    );
}

export default AllPersonalReservationPage;
