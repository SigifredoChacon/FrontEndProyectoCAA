import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import AssetList from '../components/Asset/AssetList';
import AssetFormCreate from '../components/Asset/AssetFormCreate.jsx';
import AssetFormEdit from '../components/Asset/AssetFormEdit.jsx';
import { useAssetEdit } from '../hooks/useAssetEdit.js';

function AssetsPage() {
    const {selectedAsset, handleEditAsset, handleAssetUpdated} = useAssetEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const handleAssetCreated = () => {
        handleAssetUpdated();
        setIsCreating(false);
        navigate('/assets');
    };

    const handleAddAsset = () => {
        setIsCreating(true);
        handleEditAsset(null);
        navigate('/assets/create');
    };

    const handleEdit = (asset) => {
        handleEditAsset(asset);
        navigate(`/assets/edit/${asset.NumeroPlaca}`);
    };

    const location = useLocation();


    const isOnCreateOrEditPage = location.pathname === "/assets/create" || location.pathname.startsWith("/assets/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>

            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Gestión de Activos
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
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

            <Routes>
                <Route path="/" element={<AssetList onEdit={handleEdit} />} />
                <Route path="create" element={<AssetFormCreate onAssetCreated={handleAssetCreated} />} />
                <Route
                    path="edit/:id"
                    element={<AssetFormEdit selectedAsset={selectedAsset} onAssetUpdated={handleAssetCreated} />}
                />
            </Routes>
        </div>
    );
}

export default AssetsPage;
