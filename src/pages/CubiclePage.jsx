import { useState } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'; // Importa Routes y Route de react-router-dom
import CubicleList from '../components/Cubicle/CubicleList.jsx';
import CubicleFormCreate from '../components/Cubicle/CubicleFormCreate.jsx';
import CubicleFormEdit from '../components/Cubicle/CubicleFormEdit.jsx';
import { useCubicleEdit } from '../hooks/useCubicleEdit.js';

function CubiclesPage() {
    const { selectedCubicle, handleEditCubicle, handleCubicleUpdated } = useCubicleEdit();
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate(); // Hook para navegar entre rutas

    const handleCubicleCreated = () => {
        handleCubicleUpdated();
        setIsCreating(false);
        navigate('/cubicles'); // Navegar de vuelta a la lista de usuarios
    };

    const handleAddCubicle = () => {
        setIsCreating(true);
        handleEditCubicle(null);
        navigate('/cubicles/create'); // Navegar a la ruta de creación de usuario
    };

    const handleEdit = (cubicle) => {
        handleEditCubicle(cubicle);
        navigate(`/cubicles/edit/${cubicle.idCubiculo}`); // Navegar a la ruta de edición de usuario
    };

    const location = useLocation();

    // Verifica si la ruta actual es '/create' o empieza con '/edit'
    const isOnCreateOrEditPage = location.pathname === "/cubicles/create" || location.pathname.startsWith("/cubicles/edit");

    return (
        <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 20px' }}>
            {/* Mostrar el título y el botón solo si no estás en la página de creación o edición */}
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
                {/* Ruta para mostrar la lista de usuarios */}
                <Route path="/" element={<CubicleList onEdit={handleEdit}/>}/>

                {/* Ruta para crear un usuario */}
                <Route path="create" element={<CubicleFormCreate onCubicleCreated={handleCubicleCreated}/>}/>

                {/* Ruta para editar un usuario */}
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
