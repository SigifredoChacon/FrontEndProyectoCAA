import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUsers, deleteUser, getUserById } from '../../services/userService.jsx';
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        <Card style={{border: '0.5px solid #00000085', borderRadius: '12px', padding: '16px', marginBottom: '300px'}}>
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
                            <TableCell>{user.Estado === false ? 'Activo' : 'Bloqueado'}</TableCell>
                            <TableCell className="text-left">
                                <button onClick={() => onEdit(user)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
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
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-pantone-blue text-white'}`}
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-pantone-blue text-white'}`}
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
