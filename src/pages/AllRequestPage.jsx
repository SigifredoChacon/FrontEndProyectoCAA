import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {getRequestByUserId, deleteRequest, getRequest} from '../services/requestService.jsx';
import { useAuthContext } from '../hooks/useAuthContext.js';
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

function AllRequestPage() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArchivoSolicitud, setSelectedArchivoSolicitud] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Nombre Activo');
    const [filterStatus, setFilterStatus] = useState('Pendiente');

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchTerm, filterType, filterStatus, requests]);

    const fetchRequests = async () => {
        try {
            const data = await getRequest();
            const requestsWithDetails = await Promise.all(data.map(async (request) => {
                let assetName = '';
                let userName = '';

                if (request.idActivo) {
                    const asset = await getAssetById(request.idActivo);
                    assetName = asset?.Nombre || 'N/A';
                }
                const user = await getUserById(request.idUsuario);
                userName = user.Nombre;

                return { ...request, assetName, userName };
            }));

            setRequests(requestsWithDetails);
            setFilteredRequests(requestsWithDetails);
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        const newFilterType = e.target.value;
        setFilterType(newFilterType);
        setSearchTerm('');
        setFilteredRequests(requests);
    };

    const handleFilterStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleFilter = () => {
        if (filterType === 'Nombre Activo') {
            setFilteredRequests(
                requests.filter((request) =>
                    request.assetName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else if (filterType === 'Estado') {
            setFilteredRequests(
                requests.filter((request) => request.Estado === filterStatus)
            );
        } else if (filterType === 'Cédula/Carnet') {
            setFilteredRequests(
                requests.filter((request) =>
                    request.idUsuario.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else if (filterType === 'Nombre Usuario') {
            setFilteredRequests(
                requests.filter((request) =>
                    request.userName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else if (filterType === 'Número de Placa') {
            setFilteredRequests(
                requests.filter((request) =>
                    request.idActivo.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    };


    const handleDeleteRequest = async (idSolicitud) => {
        try {
            await deleteRequest(idSolicitud);
            setRequests(requests.filter((request) => request.idSolicitud !== idSolicitud));
        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
        }
    };

    const handleOpenModal = (archivoSolicitud) => {
        setSelectedArchivoSolicitud(archivoSolicitud);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArchivoSolicitud(null);
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/personalRequests/edit/");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            {!isOnCreateOrEditPage && (
                <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Solicitudes Generales
                </h1>
            )}
            <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
                <Title>
                    Solicitudes Generales
                    <Badge style={{
                        marginLeft: '8px',
                        backgroundColor: '#00000010',
                        color: '#327aff',
                        borderRadius: '17px',
                        padding: '3px 7px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}>
                        {filteredRequests.length}
                    </Badge>
                </Title>


                <div className="w-full flex justify-center my-4">
                    {filterType !== 'Estado' && (
                        <div className="w-96">
                            <TextInput
                                placeholder={`Buscar por ${filterType}`}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input w-full text-center rounded-full px-4 py-3 border-2 border-gray-300 outline-none transition-colors duration-300 ease-in-out focus:border-green-500 bg-transparent"
                            />
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-center mb-6">
                    <select
                        value={filterType}
                        onChange={handleFilterTypeChange}
                        className="mr-4 w-64 border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-400 transition duration-200"
                    >
                        <option value="Nombre Activo">Nombre de Activo</option>
                        <option value="Estado">Estado de la Solicitud</option>
                        <option value="Cédula/Carnet">Cédula/Carnet</option>
                        <option value="Nombre Usuario">Nombre de Usuario</option>
                        <option value="Número de Placa">Número de Placa del Activo</option>
                    </select>

                    {filterType === 'Estado' && (
                        <select
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            className="w-64 border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-400 transition duration-200"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aceptada">Aceptada</option>
                            <option value="Rechazada">Rechazada</option>
                        </select>
                    )}
                </div>

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
                            {filteredRequests.map((request) => (
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
                                        <button onClick={() => handleOpenModal(request.archivoSolicitud)}
                                                className="mx-2 p-2 rounded-full hover:bg-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="w-6 h-6">
                                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                <path fillRule="evenodd"
                                                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
            <ShowRequestByUserModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                archivoSolicitud={selectedArchivoSolicitud}
            />
        </div>
    );
}

export default AllRequestPage;
