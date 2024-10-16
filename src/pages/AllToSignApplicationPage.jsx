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
import SignApplicationModal from "../components/Request/SignApplicationModal.jsx";


function AllToSignApplicationPage() {
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

            const pendingRequests = data.filter((request) => request.Estado === 'Aceptada');

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
            await sendJustification(selectedApplication.idSolicitud,selectedApplication.idUsuario, null);
            await fetchRequests();
        }
        catch (error){
            console.error('Error al aceptar la reservación:', error);
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
                                <TableHeaderCell>Firmar</TableHeaderCell>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                            </svg>


                                        </button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
            <SignApplicationModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                archivoSolicitud={selectedArchivoSolicitud}
                handleAcceptApplication={handleAcceptApplication}
                request={selectedApplication}
            />
        </div>
    );
}

export default AllToSignApplicationPage;
