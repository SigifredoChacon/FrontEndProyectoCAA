import './App.css';
import UsersPage from "./SecurityModule/pages/UserPage.jsx";
import AssetsPage from "./AssetApplicationsModule/pages/AssetPage.jsx";
import RoomsPage from "./ReservationModule/pages/RoomPage.jsx";
import CubiclesPage from "./ReservationModule/pages/CubiclePage.jsx";
import LogIn from "./SecurityModule/pages/LogIn.jsx";
import {Routes, Route} from 'react-router-dom';
import CubicleReservationPage from "./ReservationModule/pages/CubicleReservationPage.jsx";
import EmailPage from "./ReservationModule/pages/EmailPage.jsx";
import AllRoomReservationPage from "./ReservationModule/pages/AllRoomReservationPage.jsx";
import ResourcesPage from "./ReservationModule/pages/ResourcePage.jsx";
import {RoomReservationPage} from "./ReservationModule/pages/RoomReservationPage.jsx";
import AllPersonalReservationPage from "./ReservationModule/pages/AllPersonalReservationPage.jsx";
import {ManageReservationsPage} from "./ReservationModule/pages/ManageReservationsPage.jsx";
import RegisterSelection from "./SecurityModule/pages/RegisterSelection.jsx";
import RegisterPage from "./SecurityModule/pages/RegisterPage.jsx";
import ProtectedRoute from "./SecurityModule/components/Context/ProtectedRoute.jsx";
import NotAuthorized from "./SecurityModule/components/Context/NotAuthorized.jsx";
import AllReservationPage from "./ReservationModule/pages/AllReservationPage.jsx";
import AllPendingReservationPage from "./ReservationModule/pages/AllPendingReservationPage.jsx";
import Dashboard from "./ReportsAnalysisModule/components/Dashboard/Dashboard.jsx";
import DashboardSelection from "./ReportsAnalysisModule/pages/DashboardSelection.jsx";
import ProfilePage from "./SecurityModule/pages/ProfilePage.jsx";
import EditProfilePage from "./SecurityModule/pages/EditProfilePage.jsx";
import {CategoryAssetsPage} from "./AssetApplicationsModule/pages/CategoryAssetsPage.jsx";
import {AssetApplicationPage} from "./AssetApplicationsModule/pages/AssetApplicationPage.jsx";
import AllPersonalApplicationPage from "./AssetApplicationsModule/pages/AllPersonalApplicationPage.jsx";
import AllApplicationPage from "./AssetApplicationsModule/pages/AllApplicationPage.jsx";
import {ManageApplicationPage} from "./AssetApplicationsModule/pages/ManageApplicationPage.jsx";
import AllPendingApplicationPage from "./AssetApplicationsModule/pages/AllPendingApplicationPage.jsx";
import AllToSignApplicationPage from "./AssetApplicationsModule/pages/AllToSignApplicationPage.jsx";
import Navbar from "./Navbar.jsx";
import HomePage from "./HomePage.jsx";
import Footer from "./Footer.jsx";

// Componente principal App que define la estructura general de navegación de la aplicación,
// incluyendo el Navbar y las rutas principales que corresponden a diferentes páginas.
function App() {
    return (
        <>
            {/* Componente de la barra de navegación visible en todas las rutas */}
            <Navbar/>

            {/* Definición de todas las rutas de la aplicación */}
            <Routes>
                {/* Ruta principal que muestra la página de inicio */}
                <Route path="/" element={<HomePage/>}/>

                {/* Ruta para la página de usuarios, protegida y accesible solo por roles específicos */}
                <Route path="/users/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'AdministradorReservaciones','AdministradorSolicitudes']}>
                        <UsersPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar las salas, accesible solo para roles administrativos */}
                <Route path="/rooms/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <RoomsPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar los cubículos, accesible solo para roles administrativos */}
                <Route path="/cubicles/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <CubiclesPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para reservación de cubículos, accesible por roles administrativos y profesores */}
                <Route path="/reservationsCubicle/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorReservaciones','AdministradorSolicitudes']}>
                        <CubicleReservationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para la gestión de correos electrónicos generales */}
                <Route path="/generalEmails" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <EmailPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para mostrar todas las reservaciones personales del usuario */}
                <Route path="/personalReservations/*" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <AllPersonalReservationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para mostrar todas las solicitudes personales del usuario */}
                <Route path="/personalRequests/*" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <AllPersonalApplicationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para acceder a todas las solicitudes, protegida para roles administrativos */}
                <Route path="/allRequests/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AllApplicationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar recursos, protegida para roles administrativos */}
                <Route path="/resources/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <ResourcesPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar todas las reservaciones, protegida para roles administrativos */}
                <Route path="/manageReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <ManageReservationsPage/>
                    </ProtectedRoute>}
                />

                {/* Ruta para gestionar todas las solicitudes, protegida para roles administrativos */}
                <Route path="/manageApplications/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <ManageApplicationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para la página de categoría de activos, protegida para roles específicos */}
                <Route path="/categoryAssets/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorSolicitudes']}>
                        <CategoryAssetsPage/>
                    </ProtectedRoute>}
                />

                {/* Ruta para la página de solicitudes de activos, protegida para roles específicos */}
                <Route path="/assetsRequest/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorSolicitudes']}>
                        <AssetApplicationPage/>
                    </ProtectedRoute>}
                />

                {/* Ruta para ver todas las reservaciones, protegida para roles administrativos */}
                <Route path="/allReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <AllReservationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para ver todas las reservaciones pendientes, protegida para roles administrativos */}
                <Route path="/pendingReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <AllPendingReservationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para ver todas las aplicaciones pendientes, protegida para roles administrativos */}
                <Route path="/pendingApplications/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AllPendingApplicationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para la selección del Dashboard, protegida para roles administrativos */}
                <Route path="/dashboard/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <DashboardSelection/>
                    </ProtectedRoute>
                }/>

                {/* Ruta específica del Dashboard de salas */}
                <Route path="/dashboard/rooms" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <Dashboard type={'room'}/>
                    </ProtectedRoute>
                }/>

                {/* Ruta específica del Dashboard de cubículos */}
                <Route path="/dashboard/cubicles" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <Dashboard type={'cubicle'}/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar activos, protegida para roles administrativos */}
                <Route path="/assets/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AssetsPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para gestionar aplicaciones que requieren firma, accesible para administradores */}
                <Route path="/toSignApplication/*" element={
                    <ProtectedRoute allowedRoles={['Administrador']}>
                        <AllToSignApplicationPage/>
                    </ProtectedRoute>
                }/>

                {/* Ruta para la página de inicio de sesión */}
                <Route path="/login" element={<LogIn/>}/>

                {/* Ruta de selección de registro */}
                <Route path="/register" element={<RegisterSelection/>}/>

                {/* Ruta de registro para estudiantes */}
                <Route path="/register/student" element={<RegisterPage role={'Estudiante'}/>}/>

                {/* Ruta de registro para profesores */}
                <Route path="/register/teacher" element={<RegisterPage role={'Profesor'}/>}/>

                {/* Ruta para la página de perfil del usuario actual */}
                <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <ProfilePage />
                    </ProtectedRoute>
                }/>

                {/* Ruta para la página de edición del perfil del usuario */}
                <Route path="/editProfile" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <EditProfilePage />
                    </ProtectedRoute>
                }/>

                {/* Ruta para ver todas las reservaciones de salas */}
                <Route path="/allRoomReservation/*" element={<AllRoomReservationPage/>}/>

                {/* Ruta para gestionar reservaciones de salas */}
                <Route path="/reservationsRoom" element={<RoomReservationPage/>}/>

                {/* Ruta para la página de "No Autorizado" */}
                <Route path="/not-authorized" element={<NotAuthorized/>}/>
            </Routes>

            <Footer/>
        </>
    );
}

export default App;
