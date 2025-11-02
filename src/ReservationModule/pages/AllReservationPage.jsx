import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { deleteReservation, getReservation} from '../services/reservationService.jsx';
import {getNameRoomById, getRoomById} from '../services/roomService.jsx';
import {deleteCubicle, getCubicleById} from '../services/cubicleService.jsx';
import { usePersonalReservation } from '../hooks/usePersonalReservation.js';
import { getUserById } from '../../SecurityModule/services/userService.jsx';
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
import Swal from "sweetalert2";
import BackButton from "../../utils/BackButton.jsx";

function AllReservationPage() {
    const {selectedReservation, handleEditReservation, handleReservationUpdated } = usePersonalReservation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [totalReservations, setTotalReservations] = useState(0);

    useEffect(() => {
        fetchReservations();
    }, [isModalOpen]);

    const parseReservationDate = (reservation) => {
        const [hours, minutes] = reservation.HoraInicio.split(":").map(Number);
        const date = new Date(reservation.Fecha);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const fetchReservations = async (page = 1) => {
        try {
            const data = await getReservation(page, itemsPerPage);

            const reservationsWithDetails = await Promise.all(
                data.reservations.map(async (reservation) => {
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
                })
            );

            const now = new Date();

            const futureReservations = reservationsWithDetails.filter(
                (reservation) => parseReservationDate(reservation) >= now
            );

            const pastReservations = reservationsWithDetails.filter(
                (reservation) => parseReservationDate(reservation) < now
            );

            futureReservations.sort(
                (a, b) => parseReservationDate(a) - parseReservationDate(b)
            );

            pastReservations.sort(
                (a, b) => parseReservationDate(b) - parseReservationDate(a)
            );

            setReservations([...futureReservations, ...pastReservations]);
            setTotalPages(data.totalPages);
            setTotalReservations(data.totalReservations)
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
        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar este cubículo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#002855",
            cancelButtonColor: "#EF3340",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
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

                    });

                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'No se ha podido eliminar la reservación',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                }
            }
        });
    };


    const handlelockDay = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchReservations(newPage);
        }
    };


    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/allReservations/edit/");


    return (
        <>
        <BackButton/>
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>

            <Routes>
                <Route path="lockDayModal" element={<LockDayModal/>}/>
            </Routes>
            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginTop: '50px'}}>
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


                    <Card style={{border: '2px solid #002855', borderRadius: '12px', padding: '16px', marginBottom: '200px'}}>
                        <Title>
                            Reservaciones:
                            <Badge style={{
                                marginLeft: '8px',
                                backgroundColor: '#00000010',
                                color: '#327aff',
                                borderRadius: '17px',
                                padding: '3px 7px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                            }}>
                                {totalReservations}
                            </Badge>
                        </Title>



                        {!isOnCreateOrEditPage && (
                            <>
                                <Table className="mt-8" >
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
                                        {reservations.map((reservation) => (
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
                                                    {new Date(reservation.Fecha) > new Date() ||
                                                    (new Date(reservation.Fecha).toDateString() === new Date().toDateString() &&
                                                        new Date().getHours() < parseInt(reservation.HoraInicio.split(':')[0])) ? (
                                                        <>
                                                            {reservation.idSala && (
                                                                <button
                                                                    onClick={() => handleEditPersonalReservation(reservation)}
                                                                    style={{marginRight: '8px'}}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                                         fill="currentColor" className="size-6">
                                                                        <path
                                                                            d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z"/>
                                                                        <path
                                                                            d="M19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/>
                                                                        <path
                                                                            d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteReservation(reservation.idReservacion)}
                                                                style={{marginRight: '8px'}}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                     viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                                     className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
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
                                <div className="flex justify-center items-center mt-4 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-pantone-blue  text-white'}`}
                                    >
                                        Anterior
                                    </button>
                                    <span>Página {currentPage} de {totalPages}</span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-pantone-blue  text-white'}`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                        )}

                    </Card>
                </>
            )}

            <Routes>
                <Route
                    path="edit/:id"
                    element={<ReservationFormEdit selectedPersonalReservation={selectedReservation}
                                                  onReservationUpdated={handleReservationCreated}/>}
                />
            </Routes>

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
        </>
    );
}

export default AllReservationPage;
