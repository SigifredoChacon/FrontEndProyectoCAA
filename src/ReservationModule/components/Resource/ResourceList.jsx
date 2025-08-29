import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getResources, deleteResource } from '../../services/resourceService.jsx';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Title,
    Badge
} from '@tremor/react';
import Swal from "sweetalert2";
import {deleteCubicle} from "../../services/cubicleService.jsx";


function ResourceList({ onEdit }) {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetchResources();
    }, []);


    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
        } catch (error) {
            console.error('Error al obtener las recursos:', error);
        }
    };


    const handleDelete = async (id) => {

        Swal.fire({
            title: '¡Eliminar!',
            text: '¿Estás seguro de que deseas eliminar este recurso?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteResource(id);
                    setResources(resources.filter((resource) => resource.idRecursos !== id));

                    await Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Se ha eliminado el recurso con éxito',
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


    return (
        <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px', marginBottom: '200px' }}>
            <Title>
                Recursos
                <Badge style={{
                    marginLeft: '8px',
                    backgroundColor: '#00000010',
                    color: '#327aff ',
                    borderRadius: '17px',
                    padding: '3px 7px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                }}>{resources.length}</Badge>
            </Title>
            <Table className="mt-8">
                <TableHead>
                    <TableRow >
                        <TableHeaderCell >
                            idRecurso
                        </TableHeaderCell>
                        <TableHeaderCell >
                            Nombre
                        </TableHeaderCell>
                        <TableHeaderCell >
                            Acciones
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.idRecursos}>
                            <TableCell>{resource.idRecursos}</TableCell>
                            <TableCell>{resource.Nombre}</TableCell>
                            <TableCell className="text-left">
                                <button onClick={() => onEdit(resource)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                </button>
                                <button onClick={() => handleDelete(resource.idRecursos)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}


ResourceList.propTypes = {
    onEdit: PropTypes.func.isRequired,
};

export default ResourceList;
