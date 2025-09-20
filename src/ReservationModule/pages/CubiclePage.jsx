import React, { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import CubicleList from '../components/Cubicle/CubicleList.jsx';
import CubicleFormCreate from '../components/Cubicle/CubicleFormCreate.jsx';
import CubicleFormEdit from '../components/Cubicle/CubicleFormEdit.jsx';
import { useCubicleEdit } from '../hooks/useCubicleEdit.js';
import { lockCubicle, unLockCubicle } from '../services/cubicleService.jsx';
import Swal from "sweetalert2";
import {lockRoom} from "../services/roomService.jsx";
import BackButton from "../../utils/BackButton.jsx";

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
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await lockCubicle();
                        setIsCubicleLocked(true);
                        localStorage.setItem('isCubicleLocked', 'true');
                        setRefresh(prev => !prev);

                        await Swal.fire({
                            title: '¡Bloqueado!',
                            text: 'Se han bloqueado los cubículos correctamente',
                            icon: 'success',
                            timer: 1000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });

                    } catch (error) {
                        await Swal.fire({
                            title: '¡Error!',
                            text: 'No se han podido bloquear los cubículos',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,

                        });
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
        <>
        <BackButton />
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>


            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginTop: '50px'}}>
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
                                backgroundColor: isCubicleLocked ? '#28a745' : '#EF3340',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = isCubicleLocked ? '#4bd162' : '#F16C63'}
                            onMouseOut={(e) => e.target.style.backgroundColor = isCubicleLocked ? '#28a745' : '#EF3340'}
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
        </>
    );
}

export default CubiclesPage;
