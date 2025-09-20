import React, { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import AssetList from '../components/Asset/AssetList.jsx';
import AssetFormCreate from '../components/Asset/AssetFormCreate.jsx';
import AssetFormEdit from '../components/Asset/AssetFormEdit.jsx';
import { useAssetEdit } from '../hooks/useAssetEdit.js';
import BackButton from "../../utils/BackButton.jsx";

function AssetsPage() {
    // Estado y funciones para gestionar la edición y creación de activos
    const {selectedAsset, handleEditAsset, handleAssetUpdated} = useAssetEdit();
    const [isCreating, setIsCreating] = useState(false); // Indica si se está creando un nuevo activo
    const navigate = useNavigate(); // Hook para redireccionar a otras rutas

    // Redirige a la lista de activos después de crear uno nuevo
    // Entrada: ninguna
    // Salida: redirecciona a la ruta '/assets'
    const handleAssetCreated = () => {
        handleAssetUpdated(); // Actualiza el estado del activo
        setIsCreating(false); // Cambia el estado de creación
        navigate('/assets'); // Redirige a la lista de activos
    };

    // Activa la creación de un nuevo activo y redirige al formulario de creación
    // Entrada: ninguna
    // Salida: redirige a la ruta '/assets/create'
    const handleAddAsset = () => {
        setIsCreating(true); // Activa el estado de creación
        handleEditAsset(null); // Limpia el activo seleccionado
        navigate('/assets/create'); // Redirige al formulario de creación
    };

    // Activa la edición de un activo específico y redirige al formulario de edición
    // Entrada: objeto `asset` que representa el activo a editar
    // Salida: redirige a la ruta de edición correspondiente a `asset.NumeroPlaca`
    const handleEdit = (asset) => {
        handleEditAsset(asset); // Selecciona el activo a editar
        navigate(`/assets/edit/${asset.NumeroPlaca}`); // Redirige al formulario de edición
    };

    const location = useLocation(); // Obtiene la ubicación actual
    const isOnCreateOrEditPage = location.pathname === "/assets/create" || location.pathname.startsWith("/assets/edit"); // Verifica si está en una página de creación o edición

    return (
        <>
        <BackButton/>
        <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>


            {/* Encabezado y botón "Agregar Activo" solo visible en la lista de activos */}
            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', marginTop: '50px'}}>
                        Gestión de Activos
                    </h1>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                        <button
                            onClick={handleAddAsset}
                            style={{
                                backgroundColor: '#002855',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#004080'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#002855'}
                        >
                            Agregar Activo
                        </button>
                    </div>
                </>
            )}

            {/* Configuración de rutas para la lista de activos, creación y edición */}
            <Routes>
                <Route path="/" element={<AssetList onEdit={handleEdit}/>}/>
                <Route path="create" element={<AssetFormCreate onAssetCreated={handleAssetCreated}/>}/>
                <Route
                    path="edit/:id"
                    element={<AssetFormEdit selectedAsset={selectedAsset} onAssetUpdated={handleAssetCreated}/>}
                />
            </Routes>
        </div>
        </>
    );
}

export default AssetsPage;
