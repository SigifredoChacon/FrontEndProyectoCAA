import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import UserList from '../components/User/UserList.jsx';
import UserFormCreate from '../components/User/UserFormCreate.jsx';
import UserFormEdit from '../components/User/UserFormEdit.jsx';
import { useUserEdit } from '../hooks/useUserEdit.js';

function UsersPage() {
    const {selectedUser, handleEditUser, handleUserUpdated} = useUserEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const handleUserCreated = () => {
        handleUserUpdated();
        setIsCreating(false);
        navigate('/users');
    };

    const handleAddUser = () => {
        setIsCreating(true);
        handleEditUser(null);
        navigate('/users/create');
    };

    const handleEdit = (user) => {
        handleEditUser(user);
        navigate(`/users/edit/${user.CedulaCarnet}`);
    };

    const location = useLocation();


    const isOnCreateOrEditPage = location.pathname === "/users/create" || location.pathname.startsWith("/users/edit");

    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px', position: 'relative'}}>

            <button
                onClick={() => navigate('/manageReservations')}
                className="hidden sm:block absolute top-4 left-[-50px] p-1 cursor-pointer"
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


            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>
                        Gestión de Usuarios
                    </h1>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                        <button
                            onClick={handleAddUser}
                            style={{
                                backgroundColor: '#002855',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#004080')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#002855')}
                        >
                            Agregar Usuario
                        </button>
                    </div>
                </>
            )}

            <Routes>
                <Route path="/" element={<UserList onEdit={handleEdit}/>}/>
                <Route path="create" element={<UserFormCreate onUserCreated={handleUserCreated}/>}/>
                <Route
                    path="edit/:id"
                    element={<UserFormEdit selectedUser={selectedUser} onUserUpdated={handleUserCreated}/>}
                />
            </Routes>
        </div>

    );
}

export default UsersPage;
