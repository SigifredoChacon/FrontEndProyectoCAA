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
        try{
            await updateRequest(selectedApplication.idSolicitud, {estado: "Aceptada"});
        }
        catch (error){
            console.error('Error al aceptar la reservación:', error);
        }
        setSelectedApplication(null);
        handleCloseModal();
        navigate('/pendingApplications')
    };

    const handleRejectApplication = async (justification) => {
        try{
            console.log(justification)
            await updateRequest(selectedApplication.idSolicitud, {estado: "Rechazada"});
            await updateAsset(selectedApplication.idActivo, {condicion: 0});
            await sendJustification(selectedApplication.idSolicitud,selectedApplication.idUsuario, justification);
        }
        catch (error){
            console.error('Error al rechazar la reservación:', error);
        }
        setSelectedApplication(null);
        handleCloseModal();
        navigate('/pendingApplications')

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
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            {!isOnCreateOrEditPage && (
                <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
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
