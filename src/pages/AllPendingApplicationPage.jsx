import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {getRequestByUserId, deleteRequest, getRequest, updateRequest} from '../services/requestService.jsx';
import {updateAsset} from "../services/assetService.jsx";
import { useAuthContext } from '../hooks/useAuthContext.js';
import AcceptApplicationModal from "../components/Request/AcceptApplicationModal.jsx";
import {sendJustification} from "../services/requestService.jsx";
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

import ShowRequestByUserModal from "../components/Request/ShowRequestByUserModal.jsx";
import {getAssetById} from "../services/assetService.jsx";
import {getUserById} from "../services/userService.jsx";
import {deleteReservation, updateReservation} from "../services/reservationService.jsx";
import Swal from "sweetalert2";
import {deleteCubicle} from "../services/cubicleService.jsx";


function AllPendingApplicationPage() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArchivoSolicitud, setSelectedArchivoSolicitud] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);


    useEffect(() => {
        fetchRequests();
    }, [selectedApplication]);

    const fetchRequests = async () => {
        try {
            const data = await getRequest();

            const pendingRequests = data.filter((request) => request.Estado === 'Pendiente');

            const requestsWithDetails = await Promise.all(
                pendingRequests.map(async (request) => {
                    let assetName = '';
                    let userName = '';

                    if (request.idActivo) {
                        const asset = await getAssetById(request.idActivo);
                        assetName = asset?.Nombre || 'N/A';
                    }

                    const user = await getUserById(request.idUsuario);
                    userName = user.Nombre;

                    return { ...request, assetName, userName };
                })
            );

            setRequests(requestsWithDetails);
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
        }
    };

    const handleAcceptApplication = async () => {

        await Swal.fire({
            title: '¡Aceptar solicitud!',
            text: '¿Estás seguro de que deseas aceptar esta solicitud? ' +
                ' Una vez aceptada, no podrás revertir esta acción.',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {  // Usa async aquí
            if (result.isConfirmed) {
                try {
                    await updateRequest(selectedApplication.idSolicitud, {estado: "Aceptada"});
                    await fetchRequests();
                    setSelectedApplication(null);
                    handleCloseModal();
                    navigate('/pendingApplications')

                    await Swal.fire({
                        title: '¡Solicitud Aceptada!',
                        text: 'Se ha aceptado la solicitud con éxito ',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });



                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'Hubo un problema, No se pudo aceptar la solicitud',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                }
            }
        });
    };

    const handleRejectApplication = async (justification) => {

        await Swal.fire({
            title: '¡Rechazar solicitud!',
            text: '¿Estás seguro de que deseas rechazar esta solicitud? ' +
                ' Una vez rechazada, no podrás revertir esta acción.',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {  // Usa async aquí
            if (result.isConfirmed) {
                try {
                    await updateRequest(selectedApplication.idSolicitud, {estado: "Rechazada"});
                    await updateAsset(selectedApplication.idActivo, {condicion: 0});
                    await sendJustification(selectedApplication.idSolicitud,selectedApplication.idUsuario, justification);
                    await fetchRequests();
                    setSelectedApplication(null);
                    handleCloseModal();
                    navigate('/pendingApplications')

                    await Swal.fire({
                        title: '¡Solicitud Rechazada!',
                        text: 'Se ha rechazado la solicitud con éxito ' +
                            'Se le ha informado al usuario vía correo electrónico',
                        icon: 'success',
                        timer: 2500,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });



                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'Hubo un problema, No se pudo rechazar la solicitud',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                }
            }
        });

    };


    const handleOpenModal = (archivoSolicitud, application) => {
        setSelectedArchivoSolicitud(archivoSolicitud);
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArchivoSolicitud(null);
        setSelectedApplication(null);
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/personalRequests/edit/");

    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <button
                onClick={() => navigate('/manageApplications')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
                style={{
                    background: 'none',
                    border: 'none',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            {!isOnCreateOrEditPage && (
                <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>
                    Solicitudes Pendientes
                </h1>
            )}
            <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
                <Title>
                    Solicitudes Pendientes
                    <Badge style={{
                        marginLeft: '8px',
                        backgroundColor: '#00000010',
                        color: '#327aff',
                        borderRadius: '17px',
                        padding: '3px 7px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}>
                        {requests.length}
                    </Badge>
                </Title>


                {!isOnCreateOrEditPage && (
                    <Table className="mt-8">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>idSolicitud</TableHeaderCell>
                                <TableHeaderCell>Fecha Inicio</TableHeaderCell>
                                <TableHeaderCell>Fecha Fin</TableHeaderCell>
                                <TableHeaderCell>Estado</TableHeaderCell>
                                <TableHeaderCell>idActivo</TableHeaderCell>
                                <TableHeaderCell>Activo</TableHeaderCell>
                                <TableHeaderCell>Cédula/Carnet</TableHeaderCell>
                                <TableHeaderCell>Nombre de Usuario</TableHeaderCell>
                                <TableHeaderCell>Documento PDF</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.idSolicitud}>
                                    <TableCell>{request.idSolicitud}</TableCell>
                                    <TableCell>{new Date(request.FechaInicio).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</TableCell>
                                    <TableCell>{new Date(request.FechaFin).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</TableCell>
                                    <TableCell>{request.Estado}</TableCell>
                                    <TableCell>{request.idActivo || 'N/A'}</TableCell>
                                    <TableCell>{request.assetName || 'N/A'}</TableCell>
                                    <TableCell>{request.idUsuario}</TableCell>
                                    <TableCell>{request.userName || 'N/A'}</TableCell>
                                    <TableCell style={{display: 'flex'}}>
                                        <button onClick={() => handleOpenModal(request.archivoSolicitud, request)}
                                                className="mx-2 p-2 rounded-full hover:bg-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 preserveAspectRatio="xMidYMid meet"
                                                 style={{width: '28px', height: '48px', overflow: 'visible'}}>
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
            </Card>
            <AcceptApplicationModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                archivoSolicitud={selectedArchivoSolicitud}
                handleAcceptApplication={handleAcceptApplication}
                handleRejectApplication={handleRejectApplication}
            />
        </div>
    );
}

export default AllPendingApplicationPage;
