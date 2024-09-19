import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Importa Routes y Route de react-router-dom
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


    return (
        <div>
            <h1>Gestión de Cubiculos</h1>

            {/* Botón para agregar un nuevo usuario */}
            <button onClick={handleAddCubicle}>Agregar Cubiculos</button>

            <Routes>
                {/* Ruta para mostrar la lista de usuarios */}
                <Route path="/" element={<CubicleList onEdit={handleEdit} />} />

                {/* Ruta para crear un usuario */}
                <Route path="create" element={<CubicleFormCreate onCubicleCreated={handleCubicleCreated} />} />

                {/* Ruta para editar un usuario */}
                <Route
                    path="edit/:id"
                    element={<CubicleFormEdit selectedCubicle={selectedCubicle} onCubicleUpdated={handleCubicleCreated}  />}
                />
            </Routes>
        </div>
    );
}

export default CubiclesPage;
