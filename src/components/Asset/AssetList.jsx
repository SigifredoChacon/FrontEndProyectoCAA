import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAssets, deleteAsset, getAssetById } from '../../services/assetService';
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
    TextInput
} from '@tremor/react';
import Swal from "sweetalert2";
import {deleteCubicle} from "../../services/cubicleService.jsx";

function AssetList({ onEdit }) {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Cantidad de elementos por página

    useEffect(() => {
        fetchAssets();
    }, []);


    const fetchAssets = async () => {
        try {
            const data = await getAssets();
            setAssets(data);
        } catch (error) {
            console.error('Error al obtener activos:', error);
        }
    };


    const handleDelete = async (id) => {

        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar este Activo?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {  // Usa async aquí
            if (result.isConfirmed) {
                try {
                    await deleteAsset(id);
                    setAssets(assets.filter((asset) => asset.NumeroPlaca !== id));

                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Se ha eliminado el activo con éxito',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                } catch (error) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: error.response.data.message,
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,

                    });

                }
            }
        });
    };


    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value !== '') {
            try {
                const asset = await getAssetById(Number(value));
                setSearchResult(asset ? [asset] : []);
            } catch (error) {
                console.error('Error al buscar activo:', error);
                setSearchResult([]);
            }
        } else {
            setSearchResult(null);
        }
    };

    const displayedAssets = searchResult !== null ? searchResult : assets;

    const totalPages = Math.ceil(displayedAssets.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentAssets = displayedAssets.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
            <Title>
                Activos
                <Badge style={{
                    marginLeft: '8px',
                    backgroundColor: '#00000010',
                    color: '#327aff ',
                    borderRadius: '17px',
                    padding: '3px 7px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                }}>{displayedAssets.length}</Badge>
            </Title>
            <div className="w-full flex justify-center">
                <div className="w-96">
                    <TextInput
                        placeholder="Buscar por Numero de Placa"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input w-full text-center rounded-full px-4 py-3 border-2 border-gray-300 outline-none transition-colors duration-300 ease-in-out focus:border-green-500 bg-transparent"
                    />
                </div>
            </div>


            <Table className="mt-8">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>
                            Placa
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Descripción
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Observaciones
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Modelo
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Numero de serie
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Marca
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Estado
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Condición
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Categoría
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Acciones
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentAssets.map((asset) => (
                        <TableRow key={asset.NumeroPlaca}>
                            <TableCell>
                                {asset.NumeroPlaca}
                            </TableCell>
                            <TableCell>{asset.Nombre}</TableCell>
                            <TableCell>{asset.Descripcion}</TableCell>
                            <TableCell>{asset.Modelo}</TableCell>
                            <TableCell>{asset.NumeroSerie}</TableCell>
                            <TableCell>{asset.Marca}</TableCell>
                            <TableCell>{asset.NombreEstado}</TableCell>
                            <TableCell>{asset.Condicion === 1 ? 'Prestado' : 'Disponible'}</TableCell>
                            <TableCell>{asset.NombreCategoria}</TableCell>
                            <TableCell className="text-left">
                                <button onClick={() => onEdit(asset)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                    </svg>
                                </button>
                                <button onClick={() => handleDelete(asset.NumeroPlaca)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                    </svg>
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
    );
}


AssetList.propTypes = {
    onEdit: PropTypes.func.isRequired,
};

export default AssetList;
