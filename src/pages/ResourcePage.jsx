import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import ResourceList from '../components/Resource/ResourceList.jsx';
import ResourceFormCreate from '../components/Resource/ResourceFormCreate.jsx';
import ResourceFormEdit from '../components/Resource/ResourceFormEdit.jsx';
import { useResourceEdit } from '../hooks/useResourceEdit.js';

function ResourcesPage() {
    const { selectedResource, handleEditResource, handleResourceUpdated } = useResourceEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const handleResourceCreated = () => {
        handleResourceUpdated();
        setIsCreating(false);
        navigate('/resources');
    };

    const handleAddResource = () => {
        setIsCreating(true);
        handleEditResource(null);
        navigate('/resources/create');
    };

    const handleEdit = (resource) => {
        handleEditResource(resource);
        navigate(`/resources/edit/${resource.idRecursos}`);
    };

    const location = useLocation();

    const isOnCreateOrEditPage = location.pathname === "/resources/create" || location.pathname.startsWith("/resources/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>

            {!isOnCreateOrEditPage && (
                <>
                    <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Gestión de Recursos
                    </h1>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button
                            onClick={handleAddResource}
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
                            Agregar Recurso
                        </button>
                    </div>
                </>
            )}
            <Routes>
                <Route path="/" element={<ResourceList onEdit={handleEdit}/>}/>
                <Route path="create" element={<ResourceFormCreate onResourceCreated={handleResourceCreated}/>}/>
                <Route
                    path="edit/:id"
                    element={<ResourceFormEdit selectedResource={selectedResource}
                                              onResourceUpdated={handleResourceCreated}/>}
                />
            </Routes>
        </div>
    );
}

export default ResourcesPage;
