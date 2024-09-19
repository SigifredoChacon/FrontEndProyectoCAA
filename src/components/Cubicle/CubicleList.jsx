import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import { getCubicles, deleteCubicle } from '../../services/cubicleService.jsx'; // Servicio para obtener cubiculos y eliminar
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


function CubicleList({ onEdit }) {
    const [cubicles, setCubicles] = useState([]); // Ventana para almacenar la lista de cubiculos

    useEffect(() => {
        fetchCubicles(); // Llama a la función para obtener cubiculos al montar el componente
    }, []);

    // Función para obtener la lista de cubiculos desde el backend
    const fetchCubicles = async () => {
        try {
            const data = await getCubicles(); // Llama al servicio para obtener la lista de cubiculos
            setCubicles(data); // Actualiza el ventana con los datos obtenidos
        } catch (error) {
            console.error('Error al obtener las cubiculos:', error);
        }
    };

    // Función para manejar la eliminación de un cubiculo
    const handleDelete = async (id) => {
        try {
            await deleteCubicle(id); // Llama al servicio para eliminar un cubiculo por ID
            setCubicles(cubicles.filter((cubicle) => cubicle.idCubiculo !== id)); // Actualiza la lista de cubiculos eliminando el cubiculo borrado
        } catch (error) {
            console.error('Error al eliminar la cubiculo:', error);
        }
    };


    return (
        <Card style={{ border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
            <Title>
                Cubiculos
                <Badge style={{
                    marginLeft: '8px',
                    backgroundColor: '#00000010',   // Fondo suave
                    color: '#327aff ',             // Color de texto
                    borderRadius: '17px',         // Bordes redondeados
                    padding: '3px 7px',           // Relleno más pronunciado
                    fontWeight: 'bold',           // Texto en negrita
                    fontSize: '1rem',          // Tamaño de fuente más pequeño
                }}>{cubicles.length}</Badge>
            </Title>
            <Table className="mt-8">
                <TableHead>
                    <TableRow >
                        <TableHeaderCell >
                            idCubiculo
                        </TableHeaderCell>
                        <TableHeaderCell >
                            Nombre
                        </TableHeaderCell>
                        <TableHeaderCell >
                            Ventana
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cubicles.map((cubicle) => (
                        <TableRow key={cubicle.idCubiculo}>
                            <TableCell>{cubicle.idCubiculo}</TableCell>
                            <TableCell>{cubicle.Nombre}</TableCell>
                            <TableCell>
                                {cubicle.Ventana === 1 ? 'Tiene ventana' : 'No tiene ventana'}
                            </TableCell>
                            <TableCell className="text-left">
                                <button onClick={() => onEdit(cubicle)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                </button>
                                <button onClick={() => handleDelete(cubicle.idCubiculo)}>
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

// Validación de PropTypes para el componente
CubicleList.propTypes = {
    onEdit: PropTypes.func.isRequired, // `onEdit` es una función requerida
};

export default CubicleList;
