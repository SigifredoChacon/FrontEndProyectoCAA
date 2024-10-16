import { Card, Title } from "@tremor/react";
import {Link, useNavigate} from "react-router-dom";
import UserIcon from "/src/assets/users.svg";
import DashBoardIcon from "/src/assets/dashboard.svg";
import Notifications from "/src/assets/notifications.svg";
import Rooms from "/src/assets/rooms.svg";
import Check from "/src/assets/check.svg";
import Computer from "/src/assets/computadora.svg";
import General from "/src/assets/GReservations.svg";
import Digital from "/src/assets/digital.svg";



export function ManageApplicationPage() {
    const navigation = [
        { name: 'Activos', href: '/assets', current: false, svg: Computer},
        { name: 'Historial de Solicitudes', href: '/allRequests', current: false, svg: General},
        { name: 'Solicitudes Pendientes', href: '/pendingApplications', current: false, svg: Check },
        { name: 'Solicitudes Por Firmar', href: '/toSignApplication', current: false, svg: Digital },

    ];
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <button
                onClick={() => navigate('/')}
                className="hidden sm:block absolute top-20 left-2 p-1 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className="text-none"
                    >
                        <div
                            className="w-full sm:w-64 h-48 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            <img src={item.svg} alt={`${item.name} icon`} className="mb-4 w-10 h-10"/>
                            <div className="text-lg text-center text-gray-800">
                                {item.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
