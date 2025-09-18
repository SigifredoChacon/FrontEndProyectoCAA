import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApplication } from '../services/applicationService.jsx';
import { sendJustification } from "../services/applicationService.jsx";
import { getAssetById } from "../services/assetService.jsx";
import { getUserById } from "../../SecurityModule/services/userService.jsx";
import SignApplicationModal from "../components/Application/SignApplicationModal.jsx";
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

function AllToSignApplicationPage() {
    const navigate = useNavigate(); // Hook para redireccionar
    const [requests, setRequests] = useState([]); // Almacena las solicitudes pendientes de firma
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para mostrar o cerrar el modal
    const [selectedArchivoSolicitud, setSelectedArchivoSolicitud] = useState(null); // Almacena el archivo de la solicitud seleccionada
    const [selectedApplication, setSelectedApplication] = useState(null); // Almacena la solicitud seleccionada

    // Carga las solicitudes al montar el componente o cuando cambia selectedApplication
    useEffect(() => {
        fetchRequests();
    }, [selectedApplication]);

    // Función para obtener todas las solicitudes con estado 'Aceptada' y detalles adicionales
    // Entrada: ninguna
    // Salida: actualiza requests con las solicitudes aceptadas
    const fetchRequests = async () => {
        try {
            const data = await getApplication();
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

    // Función para aceptar la solicitud y enviar una justificación (sin justificación en este caso)
    // Entrada: ninguna
    // Salida: actualiza el estado de la solicitud y cierra el modal
    const handleAcceptApplication = async () => {
        try {
            await sendJustification(selectedApplication.idSolicitud, selectedApplication.idUsuario, null);
            await fetchRequests();
        } catch (error) {
            console.error('Error al aceptar la reservación:', error);
        }
        setSelectedApplication(null);
        handleCloseModal();
        navigate('/toSignApplication');
    };

    // Función para abrir el modal de firma de solicitud
    // Entrada: archivoSolicitud (ruta del archivo PDF) y application (datos de la solicitud seleccionada)
    // Salida: muestra el modal y establece la solicitud y el archivo seleccionados
    const handleOpenModal = (archivoSolicitud, application) => {
        setSelectedArchivoSolicitud(archivoSolicitud);
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal de firma de solicitud
    // Entrada: ninguna
    // Salida: cierra el modal y restablece la solicitud y el archivo seleccionados
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArchivoSolicitud(null);
        setSelectedApplication(null);
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/toSignApplication/edit/");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
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

            {/* Título de la página */}
            {!isOnCreateOrEditPage && (
                <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', marginTop: '50px' }}>
                    Solicitudes por Firmar
                </h1>
            )}
            <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px', marginBottom: '300px' }}>
                <Title>
                    Solicitudes por Firmar
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

                {/* Tabla de solicitudes */}
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
                                    <TableCell style={{ display: 'flex' }}>
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
