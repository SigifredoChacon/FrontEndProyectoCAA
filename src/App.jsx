import './App.css';
import UsersPage from "./pages/UserPage.jsx";
import AssetsPage from "./pages/AssetPage.jsx";
import RoomsPage from "./pages/RoomPage.jsx";
import CubiclesPage from "./pages/CubiclePage.jsx";
import LogIn from "./pages/LogIn.jsx";
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, BrowserRouter} from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {AuthContextProvider} from "./components/Context/AuthContext.jsx";
import {useLogout} from "./hooks/useLogout.js";
import {useAuthContext} from "./hooks/useAuthContext.js";
import CubicleReservationPage from "./pages/CubicleReservationPage.jsx";
import EmailPage from "./pages/EmailPage.jsx";
import AllRoomReservationPage from "./pages/AllRoomReservationPage.jsx";
import SalaDeReunion from './assets/SalaDeReunion.jpeg';
import cubiculos from './assets/cubiculos.jpg';
import computadoras from './assets/computadoras.png';
import ResourcesPage from "./pages/ResourcePage.jsx";
import {RoomReservationPage} from "./pages/RoomReservationPage.jsx";
import AllPersonalReservationPage from "./pages/AllPersonalReservationPage.jsx";
import {ManageReservationsPage} from "./pages/ManageReservationsPage.jsx";
import Swal from 'sweetalert2';
import RegisterSelection from "./pages/RegisterSelection.jsx";
import RegisterStudentPage from "./pages/RegisterPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/Context/ProtectedRoute.jsx";
import NotAuthorized from "./components/Context/NotAuthorized.jsx";
import RoleBasedComponent from "./components/Context/RoleBasedComponent.jsx";
import AllReservationPage from "./pages/AllReservationPage.jsx";
import AllPendingReservationPage from "./pages/AllPendingReservationPage.jsx";
import StarRating from "./components/Reservations/StarRating.jsx";
import useReservationChecker from "./hooks/useReservationChecker.js";
import {updateReservation} from "./services/reservationService.jsx";
import {createValoration} from "./services/valorationService.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import DashboardSelection from "./pages/DashboardSelection.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import {CategoryAssetsPage} from "./pages/CategoryAssetsPage.jsx";
import {AssetRequestPage} from "./pages/AssetRequestPage.jsx";
import AllPersonalRequestPage from "./pages/AllPersonalRequestPage.jsx";
import AllRequestPage from "./pages/AllRequestPage.jsx";
import {ManageApplicationPage} from "./pages/ManageApplicationPage.jsx";
import AllPendingApplicationPage from "./pages/AllPendingApplicationPage.jsx";
import AllToSignApplicationPage from "./pages/AllToSignApplicationPage.jsx";
import {getUserById} from "./services/userService.jsx";



const navigation = [
    {name: 'Mis reservaciones', href: '/personalReservations', current: false, allowedRoles: ['all']},
    {name: 'Administrar Reservas', href: '/manageReservations', current: false, allowedRoles: ['Administrador','AdministradorReservaciones']},
    {name: 'Mis solicitudes', href: '/personalRequests', current: false, allowedRoles: ['Administrador', 'Profesor','AdministradorSolicitudes','AdministradorReservaciones']},
    {name: 'Administrar Solicitudes', href: '/manageApplications', current: false, allowedRoles: ['Administrador','AdministradorSolicitudes']},

];



function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Navbar() {
    const {user} = useAuthContext()
    
    return (
        <Disclosure as="nav" style={{ backgroundColor: '#002855' }}>
            {({ open }) => (
                <>
                    <div className="px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link to= '/'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="40"
                                         viewBox="0 0 320 50">

                                        <path id="TEC" fill="#fff"
                                              d="M112.905 0c-4.443 0-8.545 1.106-12.305 3.315-3.739 2.187-6.676 5.278-8.816 9.274-2.14 3.996-3.21 8.38-3.21 13.152 0 5.923 1.622 11.072 4.866 15.445C97.79 47.062 103.926 50 111.85 50c4.396 0 8.19-.988 11.388-2.963 3.197-1.974 5.995-5.09 8.393-9.344l-1.095-.705c-2.844 3.95-5.452 6.594-7.825 7.934-2.375 1.316-5.116 1.974-8.219 1.974-3.572 0-6.756-.846-9.555-2.54-2.772-1.69-4.854-4.124-6.241-7.297-1.388-3.174-2.08-6.924-2.08-11.25 0-5.242.727-9.626 2.186-13.151 1.482-3.526 3.503-6.087 6.065-7.685 2.563-1.622 5.43-2.434 8.604-2.434 3.783 0 7.028 1.07 9.73 3.208 2.704 2.14 4.786 5.642 6.243 10.508h1.092L129.444 0h-1.234c-.26 1.128-.695 2.01-1.306 2.645a2.332 2.332 0 01-1.659.67c-.422 0-1.127-.26-2.115-.777C119.77.846 116.363 0 112.907 0h-.002zM.564 1.096L0 12.308h1.34c.164-2.163.68-3.88 1.55-5.15.87-1.268 1.918-2.127 3.14-2.574.94-.33 2.526-.494 4.76-.494h5.746v36.53c0 2.679-.257 4.397-.774 5.15-.847 1.221-2.28 1.831-4.303 1.831H9.767v1.303H30.04v-1.303h-1.658c-1.857 0-3.232-.494-4.125-1.48-.635-.73-.954-2.561-.954-5.5V4.091h6.736c1.975 0 3.56.33 4.76.987 1.223.636 2.198 1.632 2.928 2.996.445.846.8 2.258 1.057 4.234h1.34l-.53-11.213zm42.737 0v1.303h1.692c1.975 0 3.386.47 4.233 1.41.61.706.916 2.574.916 5.605V40.48c0 2.328-.14 3.867-.42 4.62-.26.752-.767 1.315-1.52 1.69a6.688 6.688 0 01-3.207.813h-1.69v1.303H80.15l4.125-11.987h-1.41c-1.528 2.938-3.02 5.136-4.478 6.594-1.13 1.105-2.303 1.845-3.526 2.222-1.222.376-3.186.563-5.89.563h-8.11c-1.316 0-2.21-.128-2.68-.387-.47-.283-.8-.647-.988-1.094-.188-.47-.28-1.763-.28-3.88v-15.76h10.504c1.998 0 3.48.236 4.444.706s1.658 1.118 2.08 1.94c.33.66.66 2.151.99 4.48h1.303V15.656H74.93c-.14 2.727-.823 4.63-2.045 5.71-.917.824-2.74 1.236-5.468 1.236H56.912v-18.9h13.115c2.375 0 4.033.177 4.973.529 1.175.494 2.058 1.213 2.645 2.153.61.94 1.164 2.668 1.659 5.183h1.375l-.53-10.471z"/>

                                        <path id="separador" fill="#c1272d" d="M150 0h2.999v50h-3z"/>

                                        <path id="tecnologico-de-costa-rica" fill="#fff"
                                              d="M250.243 0l-4.044 1.66.253.517c.395-.158.72-.237.977-.237.237 0 .43.064.578.193.158.128.272.37.341.723.07.347.103 1.285.103 2.815v12.32c0 .84-.065 1.406-.193 1.702-.13.295-.306.51-.533.637-.227.128-.652.193-1.274.193v.532h6.65v-.532c-.702 0-1.18-.07-1.437-.21a1.39 1.39 0 01-.578-.635c-.12-.277-.178-.84-.178-1.688V0zm38.188 0c-.425 0-.786.148-1.082.444a1.434 1.434 0 00-.429 1.053c0 .415.147.77.444 1.068.295.296.652.443 1.067.443.414 0 .764-.147 1.05-.443.298-.298.445-.653.445-1.068 0-.415-.147-.766-.445-1.053a1.402 1.402 0 00-1.05-.443zm-27.334.475l-1.554 5.107h.504l4.367-5.107zm-88.266.503l-.236 4.71h.562c.07-.91.287-1.63.653-2.164.366-.533.806-.893 1.32-1.08.395-.138 1.06-.207 1.998-.207h2.414v15.34c0 1.126-.109 1.846-.325 2.162-.356.514-.958.77-1.807.77h-.71v.547h8.513v-.547h-.693c-.78 0-1.359-.207-1.733-.62-.267-.307-.4-1.078-.4-2.312V2.237h2.828c.83 0 1.497.138 2 .414.514.268.923.686 1.23 1.259.187.355.334.947.443 1.777h.564l-.222-4.71h-16.393zm22.583 6.1c-1.797 0-3.293.653-4.486 1.955-1.185 1.293-1.778 3.099-1.778 5.418 0 2.144.578 3.85 1.733 5.124 1.165 1.264 2.56 1.898 4.19 1.898 1.5 0 2.748-.552 3.745-1.658.997-1.116 1.6-2.35 1.807-3.703l-.46-.296c-.444 1.185-.996 2.024-1.658 2.518-.652.484-1.42.724-2.31.724-1.33 0-2.492-.572-3.479-1.716-.986-1.146-1.476-2.725-1.466-4.738h9.373c0-1.68-.489-3.017-1.465-4.014-.977-1.007-2.226-1.51-3.746-1.51zm13.62.015c-1.777 0-3.3.667-4.574 2-1.263 1.331-1.893 3.065-1.893 5.197 0 2.2.572 3.948 1.716 5.24 1.146 1.293 2.488 1.939 4.029 1.939 1.294 0 2.473-.48 3.54-1.437 1.066-.967 1.78-2.344 2.145-4.13l-.43-.208c-.513 1.195-1.04 2.02-1.584 2.473-.77.66-1.638.992-2.605.992-1.353 0-2.43-.617-3.23-1.85-.788-1.245-1.182-2.675-1.182-4.294 0-1.59.4-2.87 1.2-3.836.6-.73 1.394-1.095 2.382-1.095.612 0 1.092.15 1.437.445.346.305.543.75.592 1.33.06.583.172.98.34 1.186.295.375.736.562 1.317.562.435 0 .77-.114 1.008-.341.247-.237.37-.543.37-.918 0-.76-.43-1.49-1.287-2.192-.86-.71-1.956-1.066-3.29-1.066zm10.204 0l-4.089 1.658.223.533c.385-.148.716-.22.992-.22.257 0 .46.062.608.19.158.13.27.371.34.726.078.356.12 1.348.12 2.977v5.033c0 .988-.126 1.66-.371 2.014-.237.346-.7.52-1.39.52h-.298v.53h6.707v-.53c-.74 0-1.234-.066-1.48-.194a1.432 1.432 0 01-.562-.637c-.109-.218-.162-.785-.162-1.703v-7.152c1.165-1.282 2.335-1.923 3.51-1.923.759 0 1.296.28 1.613.844.325.553.487 1.446.487 2.68v5.551c0 .78-.02 1.245-.058 1.393-.1.375-.277.66-.533.858-.247.188-.687.283-1.32.283h-.28v.532h6.707v-.532c-.652 0-1.1-.07-1.346-.21a1.235 1.235 0 01-.52-.575c-.138-.306-.207-.89-.207-1.748v-5.79c0-1.222-.11-2.13-.325-2.723-.317-.85-.74-1.456-1.275-1.823-.532-.374-1.17-.561-1.91-.561-1.44 0-2.956.958-4.544 2.873V7.094h-.637zm18.48 0a6.206 6.206 0 00-3.198.887c-1.008.583-1.823 1.49-2.445 2.725-.611 1.223-.917 2.457-.917 3.7 0 1.71.51 3.25 1.525 4.622 1.204 1.63 2.828 2.444 4.87 2.444 1.254 0 2.39-.316 3.407-.947 1.028-.63 1.83-1.57 2.413-2.814.582-1.245.875-2.474.875-3.69 0-1.727-.53-3.256-1.585-4.589-1.245-1.558-2.893-2.338-4.945-2.338zm23.57 0c-1.124 0-2.19.295-3.197.887-1.007.583-1.822 1.49-2.444 2.725-.612 1.223-.918 2.457-.918 3.7 0 1.71.51 3.25 1.526 4.622 1.204 1.63 2.828 2.444 4.87 2.444 1.254 0 2.39-.316 3.407-.947 1.027-.63 1.83-1.57 2.412-2.814.583-1.245.875-2.474.875-3.69 0-1.727-.527-3.256-1.584-4.589-1.243-1.56-2.894-2.34-4.947-2.338zm14.986 0c-1.58 0-2.877.483-3.894 1.45-1.006.967-1.51 2.123-1.51 3.466 0 .878.224 1.683.668 2.414.444.72 1.08 1.283 1.91 1.687-1.016.848-1.67 1.506-1.955 1.97-.276.464-.414.867-.414 1.213 0 .306.102.582.31.83.218.237.582.508 1.096.814-.938.978-1.44 1.51-1.51 1.6-.523.652-.87 1.158-1.037 1.524-.105.222-.16.464-.162.71 0 .534.37 1.05 1.11 1.542 1.313.858 2.923 1.287 4.828 1.287 2.478 0 4.485-.72 6.025-2.163 1.047-.977 1.57-2.023 1.57-3.138 0-.81-.277-1.49-.83-2.044-.542-.554-1.273-.893-2.19-1.022-.603-.089-1.92-.158-3.954-.207-1.106-.03-1.796-.064-2.071-.103-.475-.07-.796-.184-.963-.342-.16-.158-.238-.32-.238-.487 0-.198.073-.435.22-.71.16-.287.455-.618.89-.993.7.198 1.387.298 2.059.298 1.63 0 2.928-.45 3.894-1.347.967-.898 1.45-1.98 1.45-3.242 0-1.106-.275-2.015-.83-2.725h1.763c.425 0 .67-.015.74-.045a.31.31 0 00.164-.12c.05-.099.074-.275.074-.53 0-.227-.03-.387-.09-.476a.232.232 0 00-.148-.12c-.07-.03-.316-.043-.74-.043h-2.87c-.95-.63-2.07-.947-3.362-.947zm12.733 0l-4.086 1.658.207.533c.395-.148.73-.22 1.008-.22.256 0 .46.062.607.19.147.119.255.336.323.653.09.434.135 1.387.135 2.858v5.226c0 .84-.07 1.407-.21 1.703-.127.295-.303.51-.53.637-.227.128-.673.193-1.333.193v.532h6.59v-.532c-.643 0-1.087-.07-1.333-.21a1.353 1.353 0 01-.55-.62c-.117-.286-.177-.854-.177-1.703V7.094h-.652.001zm10.943 0c-1.776 0-3.302.667-4.575 2-1.264 1.331-1.895 3.065-1.895 5.197 0 2.2.573 3.948 1.717 5.24 1.146 1.293 2.489 1.939 4.028 1.939 1.294 0 2.474-.48 3.54-1.437 1.066-.967 1.782-2.344 2.147-4.13l-.43-.208c-.513 1.195-1.04 2.02-1.584 2.473-.77.66-1.64.992-2.607.992-1.35 0-2.427-.617-3.227-1.85-.79-1.245-1.184-2.675-1.184-4.294 0-1.59.4-2.87 1.198-3.836.602-.73 1.397-1.095 2.385-1.095.611 0 1.09.15 1.435.445.346.305.543.75.592 1.33.06.583.174.98.342 1.186.295.375.736.562 1.317.562.435 0 .77-.114 1.006-.341.247-.237.37-.543.37-.918 0-.76-.43-1.49-1.287-2.192-.86-.71-1.954-1.066-3.287-1.066zm13.52 0a6.213 6.213 0 00-3.2.887c-1.005.583-1.82 1.49-2.442 2.725-.612 1.223-.918 2.457-.918 3.7 0 1.71.51 3.25 1.526 4.622 1.204 1.63 2.827 2.444 4.87 2.444 1.253 0 2.39-.316 3.406-.947 1.026-.63 1.832-1.57 2.415-2.814.581-1.245.873-2.474.873-3.69 0-1.727-.528-3.256-1.584-4.589-1.244-1.56-2.892-2.34-4.946-2.338zm-37.446.71c.79 0 1.436.328 1.94.979.679.888 1.02 2.115 1.02 3.685 0 1.203-.24 2.087-.723 2.65-.484.563-1.102.846-1.853.846-.79 0-1.441-.327-1.954-.98-.67-.857-1.006-2.066-1.006-3.626 0-1.204.246-2.097.74-2.68.493-.581 1.105-.874 1.836-.874zm-38.766.252c1.086 0 1.98.475 2.68 1.423 1.036 1.381 1.554 3.277 1.554 5.684 0 1.925-.31 3.283-.93 4.072-.623.79-1.413 1.184-2.37 1.184-1.284 0-2.32-.716-3.11-2.147-.78-1.43-1.17-3.132-1.17-5.106 0-1.224.163-2.226.489-3.006.326-.78.75-1.323 1.274-1.63.533-.315 1.06-.474 1.584-.474zm23.572 0c1.086 0 1.98.475 2.682 1.423 1.037 1.381 1.554 3.277 1.554 5.684 0 1.925-.31 3.283-.932 4.072-.622.79-1.412 1.184-2.37 1.184-1.283 0-2.32-.716-3.11-2.147-.78-1.43-1.17-3.132-1.17-5.106 0-1.224.164-2.226.49-3.006.325-.78.75-1.323 1.274-1.63.533-.315 1.06-.474 1.584-.474zm52.182 0c1.086 0 1.98.475 2.68 1.423 1.036 1.381 1.554 3.277 1.554 5.684 0 1.925-.312 3.283-.934 4.072-.62.79-1.41 1.184-2.37 1.184-1.281 0-2.318-.716-3.107-2.147-.78-1.43-1.17-3.132-1.17-5.106 0-1.224.163-2.226.487-3.006.326-.78.75-1.323 1.275-1.63.533-.315 1.062-.474 1.585-.474zm-118.428.075c.533 0 1.042.158 1.525.474a2.918 2.918 0 011.11 1.302c.16.355.261.967.31 1.836h-6.278c.11-1.135.485-2.018 1.126-2.65.65-.642 1.386-.963 2.205-.963zM273.3 21.055c1.193.167 2.9.282 5.122.34 1.52.039 2.537.17 3.05.385.504.219.755.584.755 1.098 0 .71-.426 1.376-1.274 1.998-.84.632-2.147.95-3.924.95-1.867 0-3.293-.307-4.28-.921-.573-.354-.857-.77-.857-1.243 0-.366.117-.765.355-1.2.237-.433.587-.904 1.05-1.407zm-90.743 9.993l-3.56 1.46.167.457c.374-.14.674-.21.9-.21a.799.799 0 01.522.17c.14.114.24.326.3.64.07.313.105 1.152.105 2.517v2.203c-.687-.67-1.555-1.004-2.607-1.004-1.696 0-3.084.714-4.162 2.14-1.077 1.416-1.616 2.98-1.616 4.694 0 1.713.487 3.117 1.46 4.213.974 1.087 2.114 1.63 3.418 1.63a4.196 4.196 0 001.8-.39c.556-.27 1.125-.71 1.708-1.318v1.71h.6l3.55-1.475-.146-.455c-.39.15-.703.222-.938.222a.782.782 0 01-.51-.181c-.14-.12-.243-.336-.313-.64-.06-.314-.09-1.17-.09-2.57V31.05h-.588zm110.26 0c-.373 0-.69.13-.95.39a1.263 1.263 0 00-.38.927c0 .365.133.676.394.938.262.26.574.391.939.391.366 0 .674-.13.926-.391.26-.26.393-.573.393-.938 0-.366-.131-.675-.393-.928a1.24 1.24 0 00-.926-.39zm-79.206.456a8.834 8.834 0 00-4.55 1.224c-1.384.81-2.469 1.954-3.26 3.431-.792 1.478-1.19 3.1-1.19 4.865 0 2.192.6 4.096 1.8 5.713 1.61 2.174 3.878 3.26 6.81 3.26 1.626 0 3.03-.365 4.212-1.095 1.183-.73 2.219-1.884 3.105-3.457l-.403-.26c-1.053 1.46-2.018 2.438-2.897 2.934-.878.487-1.89.732-3.04.732-1.32 0-2.5-.312-3.534-.939-1.026-.625-1.795-1.526-2.308-2.7-.514-1.174-.77-2.56-.77-4.16 0-1.94.27-3.562.81-4.866.546-1.304 1.295-2.253 2.243-2.844.947-.6 2.007-.9 3.18-.9 1.4 0 2.604.397 3.603 1.187 1 .792 1.77 2.088 2.31 3.888h.403l-.404-6.012h-.46c-.094.417-.255.744-.48.978a.856.856 0 01-.614.246c-.157 0-.418-.093-.783-.285-1.244-.626-2.504-.94-3.782-.94zm57.95.404v.483h.666c.67 0 1.174.19 1.513.574.244.27.366.96.366 2.072V46.46c0 1.008-.093 1.648-.275 1.918-.322.487-.856.73-1.603.73h-.667v.483h7.578v-.482h-.692c-.66 0-1.156-.19-1.486-.574-.244-.27-.366-.962-.366-2.076v-5.14l.404.03h.365c.28 0 .64-.01 1.082-.03l5.987 8.27h4.722v-.481c-.965-.105-1.747-.349-2.347-.73-.6-.384-1.318-1.157-2.154-2.322l-3.652-5.072c1.487-.33 2.583-.897 3.287-1.697.712-.8 1.07-1.742 1.07-2.83 0-1.016-.314-1.89-.94-2.62a4.659 4.659 0 00-2.27-1.515c-.887-.278-2.27-.416-4.148-.416h-6.443.004zm7.08.99c1.14 0 2.054.35 2.74 1.045.696.687 1.044 1.582 1.044 2.686 0 1.13-.43 2.06-1.29 2.791-.854.73-2.124 1.096-3.81 1.096h-.3a5.95 5.95 0 00-.431-.012v-7.358c.86-.165 1.542-.249 2.047-.248zm-29.566.823c-.356.878-.636 1.482-.836 1.812a7.753 7.753 0 01-1.342 1.63c-.495.452-.982.774-1.46.965v.432h1.89v8.034c0 .86.09 1.5.274 1.918.182.408.465.725.847.95a2.353 2.353 0 001.174.326c.592 0 1.167-.212 1.724-.638.556-.434.986-1.077 1.29-1.93h-.51c-.147.348-.354.613-.624.796a1.531 1.531 0 01-.836.26c-.348 0-.633-.133-.86-.403-.217-.27-.325-.793-.325-1.566v-7.749h2.79v-.914h-2.79V33.72zm-57.492 3.56c-1.582 0-2.9.575-3.953 1.723-1.045 1.14-1.566 2.73-1.566 4.773 0 1.886.508 3.39 1.526 4.51 1.026 1.114 2.257 1.67 3.69 1.67 1.323 0 2.424-.486 3.302-1.46.878-.983 1.407-2.07 1.59-3.26l-.404-.26c-.393 1.042-.88 1.78-1.46 2.215-.575.426-1.252.64-2.035.64-1.173 0-2.196-.504-3.066-1.514-.87-1.008-1.3-2.4-1.29-4.174h8.254c0-1.477-.43-2.657-1.29-3.535-.862-.886-1.96-1.33-3.3-1.33zm36.53.014a5.476 5.476 0 00-2.815.78c-.887.514-1.605 1.315-2.152 2.402-.54 1.077-.81 2.165-.81 3.26 0 1.504.45 2.86 1.345 4.07 1.06 1.433 2.49 2.15 4.29 2.15 1.105 0 2.105-.277 3-.833.906-.557 1.614-1.383 2.126-2.48.513-1.094.77-2.177.77-3.247 0-1.52-.465-2.87-1.394-4.043-1.095-1.374-2.548-2.06-4.357-2.06zm11.61 0c-1.07 0-1.943.33-2.622.99-.67.66-1.004 1.483-1.004 2.465 0 .756.196 1.383.588 1.88.39.502 1.217 1.068 2.478 1.694 1.26.626 2.098 1.143 2.516 1.553.426.408.64.91.64 1.51 0 .495-.19.923-.574 1.28-.374.348-.86.519-1.46.519-.852 0-1.621-.307-2.31-.924-.686-.619-1.151-1.535-1.395-2.752h-.43v4.262h.43c.113-.226.27-.338.47-.338.182 0 .416.044.703.13.94.26 1.774.39 2.504.39 1.017 0 1.936-.33 2.754-.99.826-.67 1.238-1.548 1.238-2.635 0-1.41-.883-2.544-2.648-3.404l-1.905-.928c-.826-.4-1.373-.778-1.642-1.135-.28-.35-.418-.766-.418-1.252 0-.39.186-.747.56-1.069.373-.322.866-.483 1.475-.483.8 0 1.456.23 1.97.691.52.46.947 1.33 1.278 2.607h.43V37.29h-.43c-.105.21-.195.342-.273.403a.518.518 0 01-.327.094c-.147 0-.445-.067-.887-.197-.67-.2-1.238-.3-1.708-.3zm18.638 0c-1.383 0-2.456.314-3.22.94-.767.625-1.15 1.312-1.15 2.06 0 .39.1.7.3.927.21.226.474.338.796.338.33 0 .597-.109.797-.326.208-.217.313-.525.313-.925l-.028-.757c0-.383.166-.722.496-1.018.322-.295.757-.443 1.306-.443.72 0 1.267.222 1.64.666.384.443.576 1.26.576 2.45v.472c-2.052.747-3.522 1.38-4.41 1.902-.877.523-1.494 1.08-1.85 1.67-.26.426-.39.93-.39 1.514 0 .92.264 1.665.794 2.23.54.565 1.22.848 2.047.848.53 0 1.03-.11 1.5-.326.314-.148 1.084-.694 2.31-1.643.007.713.14 1.216.39 1.511.253.295.59.444 1.017.444.887 0 1.82-.65 2.794-1.955v-.73c-.523.52-.875.837-1.057.95a.718.718 0 01-.365.092.536.536 0 01-.354-.13c-.094-.087-.162-.256-.206-.51-.044-.26-.066-.961-.066-2.1v-4.054c0-1.157-.078-1.923-.235-2.297-.243-.574-.622-.994-1.135-1.264-.68-.356-1.55-.535-2.61-.536zm34.967 0l-3.6 1.46.182.47c.348-.13.643-.196.886-.196.226 0 .405.058.535.17.13.107.226.298.287.575.077.383.116 1.22.116 2.516v4.606c0 .74-.06 1.24-.18 1.5-.114.26-.272.448-.472.56-.2.114-.59.17-1.173.17v.47h5.805v-.47c-.565 0-.957-.06-1.174-.182a1.194 1.194 0 01-.48-.547c-.106-.252-.158-.752-.158-1.5v-9.6h-.574zm9.64 0c-1.567 0-2.91.587-4.032 1.76-1.114 1.173-1.67 2.7-1.67 4.578 0 1.94.505 3.478 1.513 4.617 1.008 1.14 2.19 1.71 3.547 1.71 1.14 0 2.178-.422 3.117-1.266.94-.852 1.57-2.065 1.893-3.638l-.38-.182c-.45 1.053-.915 1.778-1.395 2.178-.677.582-1.443.874-2.295.874-1.192 0-2.138-.544-2.842-1.63-.697-1.098-1.045-2.356-1.045-3.782 0-1.4.35-2.527 1.056-3.38.53-.643 1.23-.963 2.1-.963.538 0 .96.131 1.265.391.305.27.48.66.522 1.174.052.513.153.86.3 1.043.262.33.649.495 1.16.495.385 0 .68-.1.888-.3.218-.21.326-.48.326-.811 0-.67-.379-1.31-1.135-1.93-.755-.625-1.72-.939-2.893-.939zm11.007 0c-1.383 0-2.459.314-3.223.94-.765.625-1.147 1.312-1.147 2.06 0 .39.1.7.3.927a1.035 1.035 0 00.796.338c.332 0 .596-.109.796-.326.21-.217.314-.525.314-.925l-.027-.757c0-.383.165-.722.496-1.018.32-.295.753-.443 1.301-.443.722 0 1.27.222 1.645.666.383.443.575 1.26.575 2.45v.472c-2.05.747-3.52 1.38-4.407 1.902-.88.523-1.497 1.08-1.854 1.67-.262.426-.393.93-.393 1.514 0 .92.266 1.665.796 2.23.54.565 1.222.848 2.05.848.53 0 1.03-.11 1.5-.326.312-.148 1.082-.694 2.308-1.643.01.713.14 1.216.39 1.511.253.295.592.444 1.02.444.885 0 1.816-.65 2.789-1.955v-.73c-.522.52-.874.837-1.057.95a.718.718 0 01-.365.092.536.536 0 01-.35-.13c-.097-.087-.167-.256-.21-.51-.044-.26-.065-.961-.065-2.1v-4.054c0-1.157-.08-1.923-.236-2.297-.244-.574-.622-.994-1.135-1.264-.678-.357-1.547-.536-2.607-.536zm-135.747.795c.408 0 .825.127 1.252.38.433.242.78.607 1.04 1.093a4.12 4.12 0 01.47 1.618v6.156c-.74.79-1.504 1.185-2.295 1.185-.94 0-1.79-.464-2.557-1.394-.767-.938-1.15-2.286-1.15-4.042 0-1.74.397-3.06 1.188-3.965.6-.687 1.283-1.03 2.05-1.03zm49.481.053c.956 0 1.743.417 2.36 1.25.913 1.22 1.37 2.888 1.37 5.01 0 1.695-.273 2.892-.82 3.587-.55.695-1.245 1.042-2.09 1.042-1.13 0-2.04-.63-2.737-1.89-.687-1.26-1.03-2.759-1.03-4.5 0-1.079.143-1.961.43-2.65.288-.686.66-1.163 1.12-1.43.47-.281.935-.419 1.397-.419zm-36.857.064c.47 0 .917.14 1.343.417.435.278.76.66.977 1.148.14.314.231.852.275 1.618h-5.53c.094-1 .426-1.78.99-2.336.574-.565 1.222-.848 1.945-.848zm69.333 4.265v4.55c-1.08.869-1.947 1.305-2.608 1.305-.486 0-.916-.206-1.29-.613-.374-.418-.563-.94-.563-1.565 0-.495.147-.95.444-1.37.295-.417.787-.818 1.474-1.2.383-.217 1.23-.586 2.543-1.107zm55.615 0v4.55c-1.077.869-1.949 1.305-2.61 1.305-.486 0-.916-.206-1.29-.613-.374-.418-.56-.94-.56-1.565 0-.495.147-.95.443-1.37.295-.417.787-.818 1.474-1.2.383-.218 1.23-.587 2.543-1.107z"/>

                                    </svg>
                                    </Link>
                                </div>

                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <RoleBasedComponent allowedRoles={item.allowedRoles}>
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-900 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            </RoleBasedComponent>

                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button
                                            className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-6 text-white">
                                                <path fillRule="evenodd"
                                                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                      clipRule="evenodd"/>
                                            </svg>

                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={React.Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {!user && (
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="/login"
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            Iniciar Sesión
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            )}

                                            {user && (
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                href="/profile"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700'
                                                                )}
                                                            >
                                                                Mi Perfil
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                            )}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}


function HomePage() {
    const navigate = useNavigate();
    const { role } = useAuthContext();
    const { user } = useAuthContext();
    const expiredReservations = useReservationChecker();
    const [activeReservation, setActiveReservation] = useState(null);
    const [rating, setRating] = useState(0);
    const [observaciones, setObservaciones] = useState('');
    const [isValorationOpen, setIsValorationOpen] = useState(false);

    useEffect(() => {
        if (expiredReservations.length > 0) {
            setActiveReservation(expiredReservations[0]);
            setIsValorationOpen(true);
        }
    }, [expiredReservations]);

    const handleSubmitValoration = async (e) => {
        e.preventDefault();
        try {
            await createValoration({
                idSala: activeReservation.idSala,
                idCubiculo: activeReservation.idCubiculo,
                nota: rating,
                observaciones
            });
            await updateReservation(activeReservation.idReservacion, { encuestaCompletada: true });

            setActiveReservation(null);
            setRating(0);
            setObservaciones('');
            setIsValorationOpen(false);
        } catch (error) {
            console.error('Error al enviar la valoración:', error);
        }
    };

    const handleCloseValoration = async () => {
        await updateReservation(activeReservation.idReservacion, { encuestaCompletada: true });
        setIsValorationOpen(false);
    };

    const handleClickAssets = async () => {
        const userInfo = await getUserById(user);

        if (userInfo.CorreoInstitucional && userInfo.Telefono && userInfo.Telefono2 && userInfo.Direccion) {
            navigate('/categoryAssets');
        } else {
            await Swal.fire({
                title: '¡Error!',
                text: 'Debes completar tu información personal para poder reservar activos',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Ir a perfil',
                cancelButtonText: 'Cerrar',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/profile');
                }
            });
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
            <button
                onClick={() => navigate('/allRoomReservation')}
                className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                style={{
                    fontSize: 'clamp(2rem, 5vw, 8rem)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    borderRadius: '50px',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${SalaDeReunion})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(50%)',
                        borderRadius: 'inherit',
                    }}
                ></div>
                <span style={{ position: 'relative', zIndex: 1 }}>Salas</span>
            </button>

            {role !== 'Estudiante' && role && (
                <button
                    onClick={() => navigate('/reservationsCubicle')}
                    className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 8rem)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        borderRadius: '50px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${cubiculos})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(50%)',
                            borderRadius: 'inherit',
                        }}
                    ></div>
                    <span style={{ position: 'relative', zIndex: 1 }}>Cubículos</span>
                </button>
            )}

            {role !== 'Estudiante' && role && (
                <button
                    onClick={handleClickAssets}
                    className="mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none relative w-full max-w-6xl h-48 md:h-56 lg:h-80 xl:h-96 lg:max-w-full"
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 8rem)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                        borderRadius: '50px',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${computadoras})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(50%)',
                            borderRadius: 'inherit',
                        }}
                    ></div>
                    <span style={{ position: 'relative', zIndex: 1 }}>Activos</span>
                </button>
            )}


            {/* Formulario de valoración condicional */}
            {isValorationOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <h2 style={{textAlign: 'center', fontWeight: 'bold'}}>Valorar Reservación</h2>
                        <p style={{textAlign: 'center'}}>¿Cómo fue tu experiencia
                            en {activeReservation.idSala ? 'la sala' : 'el cubículo'}?</p>

                        {/* Componente de estrellas para la calificación */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            marginTop: '20px'
                        }}>
                            <StarRating rating={rating} onRating={setRating}/>
                        </div>
                        <h2 style={{marginBottom: '10px'}}>Observaciones:</h2>
                        {/* Campo de observaciones */}
                        <textarea
                            name="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Tu opinion nos ayuda a mejorar"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginBottom: '20px'
                            }}
                            rows={4}
                        />

                        {/* Botones Confirmar y Cancelar */}
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button
                                onClick={handleSubmitValoration}
                                style={{
                                    backgroundColor: '#0d6efd',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCloseValoration}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {


    return (
        <>
        <Navbar/>

        <Routes>

                <Route path="/" element={<HomePage/>}/>

                <Route path="/users/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'AdministradorReservaciones','AdministradorSolicitudes']}>
                        <UsersPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/rooms/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <RoomsPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/cubicles/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <CubiclesPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/reservationsCubicle/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorReservaciones','AdministradorSolicitudes']}>
                        <CubicleReservationPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/generalEmails" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <EmailPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/personalReservations/*" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <AllPersonalReservationPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/personalRequests/*" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <AllPersonalRequestPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/allRequests/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AllRequestPage/>
                    </ProtectedRoute>
                }/>

                <Route path="/resources/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <ResourcesPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/manageReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <ManageReservationsPage/>
                    </ProtectedRoute>}
                />
                <Route path="/manageApplications/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <ManageApplicationPage/>
                    </ProtectedRoute>
                }/>

                <Route path="/categoryAssets/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorSolicitudes']}>
                        <CategoryAssetsPage/>
                    </ProtectedRoute>}
                />
                <Route path="/assetsRequest/*" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Profesor','AdministradorSolicitudes']}>
                        <AssetRequestPage/>
                    </ProtectedRoute>}
                />
                <Route path="/allReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <AllReservationPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/pendingReservations/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <AllPendingReservationPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/pendingApplications/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AllPendingApplicationPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/dashboard/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <DashboardSelection/>
                    </ProtectedRoute>
                }/>
                <Route path="/dashboard/rooms" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <Dashboard type={'room'}/>
                    </ProtectedRoute>
                }/>
                <Route path="/dashboard/cubicles" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorReservaciones']}>
                        <Dashboard type={'cubicle'}/>
                    </ProtectedRoute>
                }/>
                <Route path="/assets/*" element={
                    <ProtectedRoute allowedRoles={['Administrador','AdministradorSolicitudes']}>
                        <AssetsPage/>
                    </ProtectedRoute>
                }/>
            <Route path="/toSignApplication/*" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                    <AllToSignApplicationPage/>
                </ProtectedRoute>
            }/>

                <Route path="/login" element={<LogIn/>}/>
                <Route path="/register" element={<RegisterSelection/>}/>
                <Route path="/register/student" element={<RegisterPage role={'Estudiante'}/>}/>
                <Route path="/register/teacher" element={<RegisterPage role={'Profesor'}/>}/>
                <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <ProfilePage />
                    </ProtectedRoute>

                }/>
                <Route path="/editProfile" element={
                    <ProtectedRoute allowedRoles={['all']}>
                        <EditProfilePage />
                    </ProtectedRoute>

                }/>

                <Route path="/allRoomReservation/*" element={<AllRoomReservationPage/>}/>
                <Route path="/reservationsRoom" element={<RoomReservationPage/>}/>
                <Route path="/not-authorized" element={<NotAuthorized/>}/>
        </Routes>
        </>
    );
}

export default App;
