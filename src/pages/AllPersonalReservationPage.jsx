import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getReservationByUserId, deleteReservation } from '../services/reservationService.jsx';
import { getRoomById } from '../services/roomService.jsx';
import { getCubicleById } from '../services/cubicleService.jsx';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { usePersonalReservation } from '../hooks/usePersonalReservation.js';
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

function AllPersonalReservationPage() {
    const { user } = useAuthContext();
    const {selectedReservation, handleEditReservation, handleReservationUpdated } = usePersonalReservation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await getReservationByUserId(user);
            const reservationsWithDetails = await Promise.all(data.map(async (reservation) => {
                let placeName = '';

                if (reservation.idCubiculo) {
                    const cubicle = await getCubicleById(reservation.idCubiculo);
                    placeName = cubicle.Nombre;
                } else if (reservation.idSala) {
                    const room = await getRoomById(reservation.idSala);
                    placeName = room.Nombre;
                }
                return { ...reservation, placeName };
            }));

            setReservations(reservationsWithDetails);
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
        try {
            await deleteReservation(idReservacion);
            setReservations(reservations.filter((reservation) => reservation.idReservacion !== idReservacion));
        } catch (error) {
            console.error('Error al eliminar la reservación:', error);
        }
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/personalReservations/edit/");


    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
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



                {/* Configuración de las rutas */}
                <Routes>
                    <Route
                        path="edit/:id"
                        element={<ReservationFormEdit selectedPersonalReservation={selectedReservation} onReservationUpdated={handleReservationCreated} />}
                    />
                    {/* Otras rutas que quieras agregar */}
                </Routes>

                {!isOnCreateOrEditPage && (
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
                                        {reservation.idSala && (
                                            <button onClick={() => handleEditPersonalReservation(reservation)} style={{ marginRight: '8px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteReservation(reservation.idReservacion)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z"/>
                                                <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

export default AllPersonalReservationPage;
