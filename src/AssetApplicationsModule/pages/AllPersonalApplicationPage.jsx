import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApplicationByUserId, deleteApplication, getApplicationById } from '../services/applicationService.jsx';
import { useAuthContext } from '../../SecurityModule/hooks/useAuthContext.js';
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
import ShowApplicationByUserModal from "../components/Application/ShowApplicationByUserModal.jsx";
import { updateAsset } from "../services/assetService.jsx";
import Swal from "sweetalert2";
import {deleteReservation} from "../../ReservationModule/services/reservationService.jsx";

function AllPersonalApplicationPage() {
    const { user } = useAuthContext(); // Obtiene el usuario autenticado
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]); // Almacena todas las solicitudes del usuario
    const [filteredRequests, setFilteredRequests] = useState([]); // Solicitudes filtradas según criterios de búsqueda
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para mostrar el modal
    const [selectedArchivoSolicitud, setSelectedArchivoSolicitud] = useState(null); // Archivo de solicitud seleccionado
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    const [filterType, setFilterType] = useState('Nombre Activo'); // Tipo de filtro aplicado
    const [filterStatus, setFilterStatus] = useState('Pendiente'); // Estado de filtro por estado de solicitud
    const [currentPage, setCurrentPage] = useState(1); // Página actual en la paginación
    const itemsPerPage = 10; // Número de elementos por página

    // Obtiene solicitudes cuando se monta el componente
    useEffect(() => {
        fetchRequests();
    }, []);

    // Filtra las solicitudes cada vez que cambian los términos de filtro o las solicitudes
    useEffect(() => {
        handleFilter();
    }, [searchTerm, filterType, filterStatus, requests]);

    // Función para obtener solicitudes del usuario actual
    // Entrada: ninguna
    // Salida: actualiza requests y filteredRequests con las solicitudes obtenidas
    const fetchRequests = async () => {
        try {
            const data = await getApplicationByUserId(user);
            setRequests(data);
            setFilteredRequests(data);
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
        }
    };

    // Actualiza el término de búsqueda cuando el usuario escribe en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Cambia el tipo de filtro y reinicia la búsqueda
    const handleFilterTypeChange = (e) => {
        const newFilterType = e.target.value;
        setFilterType(newFilterType);
        setSearchTerm('');
        setFilteredRequests(requests);
    };

    // Cambia el estado de filtro (Pendiente, Aceptada, etc.)
    const handleFilterStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    // Función para filtrar solicitudes basadas en el término de búsqueda y el tipo de filtro
    // Entrada: ninguna
    // Salida: actualiza filteredRequests con los resultados filtrados
    const handleFilter = () => {
        if (filterType === 'Nombre Activo') {
            setFilteredRequests(
                requests.filter((request) =>
                    request.activo?.NombreActivo.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else if (filterType === 'Estado') {
            setFilteredRequests(
                requests.filter((request) => request.Estado === filterStatus)
            );
        }
    };

    // Función para eliminar una solicitud
    // Entrada: idSolicitud (ID de la solicitud a eliminar)
    // Salida: elimina la solicitud de requests y actualiza el estado del activo
    const handleDeleteRequest = async (idSolicitud) => {
        try {


        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
        }

        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar esta solicitud?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestdata = await getApplicationById(idSolicitud);
                    await deleteApplication(idSolicitud);
                    await updateAsset(requestdata.idActivo, { condicion: 0 });
                    setRequests(requests.filter((request) => request.idSolicitud !== idSolicitud));

                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Se ha eliminado la solicitud con éxito',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });

                } catch (error) {
                    console.error("Error al eliminar la reservación:", error);
                }
            }
        });
    };

    // Abre el modal para ver detalles del archivo de solicitud seleccionado
    // Entrada: archivoSolicitud (ruta del archivo PDF de la solicitud)
    // Salida: muestra el modal y establece el archivo seleccionado
    const handleOpenModal = (archivoSolicitud) => {
        setSelectedArchivoSolicitud(archivoSolicitud);
        setIsModalOpen(true);
    };

    // Cierra el modal y restablece el archivo seleccionado
    // Entrada: ninguna
    // Salida: cierra el modal y elimina la selección del archivo
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArchivoSolicitud(null);
    };

    // Cálculos para la paginación
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

    // Cambia de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith("/personalRequests/edit/");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            <button
                onClick={() => navigate('/')}
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
                <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Mis Solicitudes
                </h1>
            )}

            <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px' }}>
                <Title>
                    Mis Solicitudes
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

                {/* Filtros de búsqueda y selección */}
                <div className="w-full flex justify-center my-4">
                    {filterType === 'Nombre Activo' && (
                        <div className="w-96">
                            <TextInput
                                placeholder="Buscar por Nombre Activo"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input w-full text-center rounded-full px-4 py-3 border-2 border-gray-300 outline-none transition-colors duration-300 ease-in-out focus:border-green-500 bg-transparent"
                            />
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col sm:flex-row justify-center mb-6 gap-4">
                    <select
                        value={filterType}
                        onChange={handleFilterTypeChange}
                        className="w-full sm:w-64 border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-400 transition duration-200"
                    >
                        <option value="Nombre Activo">Nombre de Activo</option>
                        <option value="Estado">Estado de la Solicitud</option>
                    </select>

                    {filterType === 'Estado' && (
                        <select
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            className="w-full sm:w-64 border border-gray-300 px-3 py-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-400 transition duration-200"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aceptada">Aceptada</option>
                            <option value="Rechazada">Rechazada</option>
                            <option value="Firmado">Firmado</option>
                        </select>
                    )}
                </div>

                {/* Tabla de solicitudes */}
                {!isOnCreateOrEditPage && (
                    <Table className="mt-8">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>idSolicitud</TableHeaderCell>
                                <TableHeaderCell>Fecha Inicio</TableHeaderCell>
                                <TableHeaderCell>Fecha Fin</TableHeaderCell>
                                <TableHeaderCell>Estado</TableHeaderCell>
                                <TableHeaderCell>Activo</TableHeaderCell>
                                <TableHeaderCell>Documento PDF</TableHeaderCell>
                                <TableHeaderCell>Acciones</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRequests.map((request) => (
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
                                    <TableCell>{request.activo?.NombreActivo || 'N/A'}</TableCell>
                                    <TableCell style={{ display: 'flex' }}>
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
                                    <TableCell>
                                        {request.Estado === "Pendiente" ? (
                                            <button onClick={() => handleDeleteRequest(request.idSolicitud)}
                                                    style={{ marginRight: '8px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>
                                            </button>
                                        ) : (
                                            <span>No disponible</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

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
            </Card>
            <ShowApplicationByUserModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                archivoSolicitud={selectedArchivoSolicitud}
            />
        </div>
    );
}

export default AllPersonalApplicationPage;
