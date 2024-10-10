import ReactModal from 'react-modal'; // Importamos react-modal
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {deleteReservation, getPendingReservation, updateReservation} from '../services/reservationService.jsx';
import { getNameRoomById, getRoomById } from '../services/roomService.jsx';
import { getCubicleById } from '../services/cubicleService.jsx';
import { getUserById } from '../services/userService.jsx';

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
    Button,
} from '@tremor/react';
import ViewPendingReservation from "../components/Reservations/ViewPendingReservation.jsx";



function AllPendingReservationPage() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);


    useEffect(() => {
        fetchReservations();
    }, [selectedReservation]);

    const fetchReservations = async () => {
        try {
            const data = await getPendingReservation();
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

            setReservations(reservationsWithDetails);
        } catch (error) {
            console.error('Error al obtener las reservaciones:', error);
        }
    };

    const handleViewReservation = (reservation) => {
        setSelectedReservation(reservation);

    };

    const handleAcceptReservation = async () => {

        try{
            await updateReservation(selectedReservation.idReservacion, {estado: true});
        }
        catch (error){
            console.error('Error al aceptar la reservación:', error);
        }
        setSelectedReservation(null);
        navigate('/pendingReservations')

    };

    const handleRejectReservation = async () => {

        try{
            await deleteReservation(selectedReservation.idReservacion);
        }catch (error){
            console.error('Error al rechazar la reservación:', error);
        }

        setSelectedReservation(null);
        navigate('/pendingReservations')

    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/allReservations/edit/");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            <Routes>
                <Route path="viewPendingReservation" element={<ViewPendingReservation selectedReservation={selectedReservation}
                                                                                      onReservationAccept={handleAcceptReservation}
                                                                                      onReservationReject={handleRejectReservation} />} />
            </Routes>
            {!isOnCreateOrEditPage && (
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    marginTop: '20px'
                }}>
                    Reservaciones Pendientes
                </h1>
            )}
            <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px' }}>
                <Title>
                    Reservaciones Pendientes
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
                    <Route path="view/:id" />
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
                                    <TableCell>
                                        <button onClick={() => handleViewReservation(reservation)}
                                                style={{ display: 'flex', width: '60px', height: '60px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 preserveAspectRatio="xMidYMid meet"
                                                 style={{ width: '28px', height: '48px', overflow: 'visible' }}>
                                                <path
                                                    d="M16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm0 2c-7.7319865 0-14 6.2680135-14 14s6.2680135 14 14 14 14-6.2680135 14-14-6.2680135-14-14-14zm1.3 18.5v2.6h-2.6v-2.6zm-1.3-11.5c2.209139 0 4 1.790861 4 4 0 1.8636009-1.2744465 3.4295388-2.9993376 3.873812l-.0006624 2.126188h-2v-4h1c1.1045695 0 2-.8954305 2-2s-.8954305-2-2-2c-1.0543618 0-1.9181651.8158778-1.9945143 1.8507377l-.0054857.1492623h-2c0-2.209139 1.790861-4 4-4z"/>
                                            </svg>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}


                {selectedReservation && (
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
                        <ViewPendingReservation selectedReservation={selectedReservation}
                                                onReservationAccept={handleAcceptReservation}
                                                onReservationReject={handleRejectReservation} />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default AllPendingReservationPage;
