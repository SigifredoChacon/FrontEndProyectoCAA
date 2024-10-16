import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import CubicleList from '../components/Cubicle/CubicleList.jsx';
import CubicleFormCreate from '../components/Cubicle/CubicleFormCreate.jsx';
import CubicleFormEdit from '../components/Cubicle/CubicleFormEdit.jsx';
import { useCubicleEdit } from '../hooks/useCubicleEdit.js';
import { lockCubicle, unLockCubicle } from '../services/cubicleService.jsx';
import Swal from "sweetalert2";
import {lockRoom} from "../services/roomService.jsx";

function CubiclesPage() {
    const { selectedCubicle, handleEditCubicle, handleCubicleUpdated } = useCubicleEdit();
    const [isCreating, setIsCreating] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const [isCubicleLocked, setIsCubicleLocked] = useState(() => {
        const savedState = localStorage.getItem('isCubicleLocked');
        return savedState === 'true';
    });

    const handleCubicleCreated = () => {
        handleCubicleUpdated();
        setIsCreating(false);
        navigate('/cubicles');
    };

    const handleAddCubicle = () => {
        setIsCreating(true);
        handleEditCubicle(null);
        navigate('/cubicles/create');
    };

    const handleBlockCubicle = async () => {
        if (isCubicleLocked) {
            await unLockCubicle();
            setIsCubicleLocked(false);
            localStorage.setItem('isCubicleLocked', 'false');
            setRefresh(prev => !prev);
        } else {

            Swal.fire({
                title: '¡Bloquear Cubículos!',
                text: '¿Estás seguro de que deseas bloquear todos los cubículos?',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            }).then(async (result) => {  // Usa async aquí
                if (result.isConfirmed) {
                    try {
                        await lockCubicle();
                        setIsCubicleLocked(true);
                        localStorage.setItem('isCubicleLocked', 'true');
                        setRefresh(prev => !prev);

                    } catch (error) {
                        console.error('Error al bloquear la sala:');
                    }
                }
            });
        }


    };

    const handleEdit = (cubicle) => {
        handleEditCubicle(cubicle);
        navigate(`/cubicles/edit/${cubicle.idCubiculo}`);
    };

    const location = useLocation();


    const isOnCreateOrEditPage = location.pathname === "/cubicles/create" || location.pathname.startsWith("/cubicles/edit");

    return (
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
            <button
                onClick={() => navigate('/manageReservations')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
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
                        Gestión de Cubiculos
                    </h1>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                        <button
                            onClick={handleAddCubicle}
                            style={{
                                backgroundColor: '#002855',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                marginRight: '10px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#004080'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#002855'}
                        >
                            Agregar Cubiculo
                        </button>
                        <button
                            onClick={handleBlockCubicle}
                            style={{
                                backgroundColor: isCubicleLocked ? '#28a745' : '#fc1919',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = isCubicleLocked ? '#4bd162' : '#fe5757'}
                            onMouseOut={(e) => e.target.style.backgroundColor = isCubicleLocked ? '#28a745' : '#fc1919'}
                        >
                            {isCubicleLocked ? 'Desbloquear Cubiculos' : 'Bloquear Cubiculos'}
                        </button>
                    </div>
                </>
            )}
            <Routes>
                <Route path="/" element={<CubicleList onEdit={handleEdit} reload={refresh}/>}/>

                <Route path="create" element={<CubicleFormCreate onCubicleCreated={handleCubicleCreated}/>}/>

                <Route path="edit/:id" element={<CubicleFormEdit selectedCubicle={selectedCubicle}
                                                                 onCubicleUpdated={handleCubicleCreated}/>}
                />
            </Routes>
        </div>
    );
}

export default CubiclesPage;
