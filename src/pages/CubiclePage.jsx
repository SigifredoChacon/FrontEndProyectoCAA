import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import CubicleList from '../components/Cubicle/CubicleList.jsx';
import CubicleFormCreate from '../components/Cubicle/CubicleFormCreate.jsx';
import CubicleFormEdit from '../components/Cubicle/CubicleFormEdit.jsx';
import { useCubicleEdit } from '../hooks/useCubicleEdit.js';

function CubiclesPage() {
    const { selectedCubicle, handleEditCubicle, handleCubicleUpdated } = useCubicleEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

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

    const handleEdit = (cubicle) => {
        handleEditCubicle(cubicle);
        navigate(`/cubicles/edit/${cubicle.idCubiculo}`);
    };

    const location = useLocation();


    const isOnCreateOrEditPage = location.pathname === "/cubicles/create" || location.pathname.startsWith("/cubicles/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Gestión de Cubiculos
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
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
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#004080'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#002855'}
                        >
                            Agregar Cubiculo
                        </button>
                    </div>
                </>
            )}
            <Routes>
                <Route path="/" element={<CubicleList onEdit={handleEdit}/>}/>

                <Route path="create" element={<CubicleFormCreate onCubicleCreated={handleCubicleCreated}/>}/>

                <Route
                    path="edit/:id"
                    element={<CubicleFormEdit selectedCubicle={selectedCubicle}
                                              onCubicleUpdated={handleCubicleCreated}/>}
                />
            </Routes>
        </div>
    );
}

export default CubiclesPage;
