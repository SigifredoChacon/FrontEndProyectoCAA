import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUsers, deleteUser, getUserById } from '../../services/userService';
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

function UserList({ onEdit }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Cantidad de elementos por página

    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };


    const handleDelete = async (id) => {

        try {
            await deleteUser(id);
            setUsers(users.filter((user) => user.CedulaCarnet !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };


    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value !== '') {
            try {
                const user = await getUserById(Number(value));
                setSearchResult(user ? [user] : []);
            } catch (error) {
                console.error('Error al buscar usuario:', error);
                setSearchResult([]);
            }
        } else {
            setSearchResult(null);
        }
    };


    const displayedUsers = searchResult !== null ? searchResult : users;


    const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    const currentUsers = displayedUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    return (
        <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px'}}>
            <Title>
                Usuarios
                <Badge style={{
                    marginLeft: '8px',
                    backgroundColor: '#00000010',
                    color: '#327aff ',
                    borderRadius: '17px',
                    padding: '3px 7px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                }}>{displayedUsers.length}</Badge>
            </Title>
            <div className="w-full flex justify-center">
                <div className="w-96">
                    <TextInput
                        placeholder="Buscar por Cédula/Carnet"
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
                            Cédula/Carnet
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Nombre
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Correo Email
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Correo Institucional
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Teléfono
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Teléfono2
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Dirección
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Rol
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Estado
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Acciones
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.CedulaCarnet}>
                            <TableCell>
                                {user.CedulaCarnet}
                            </TableCell>
                            <TableCell>{user.Nombre}</TableCell>
                            <TableCell>{user.CorreoEmail}</TableCell>
                            <TableCell>{user.CorreoInstitucional}</TableCell>
                            <TableCell>{user.Telefono}</TableCell>
                            <TableCell>{user.Telefono2}</TableCell>
                            <TableCell>{user.Direccion}</TableCell>
                            <TableCell>{user.NombreRol}</TableCell>
                            <TableCell>{user.Estado === 0 ? 'Activo' : 'Bloqueado'}</TableCell>
                            <TableCell className="text-left">
                                <button onClick={() => onEdit(user)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                    </svg>
                                </button>
                                <button onClick={() => handleDelete(user.CedulaCarnet)}>
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


UserList.propTypes = {
    onEdit: PropTypes.func.isRequired,
};

export default UserList;
