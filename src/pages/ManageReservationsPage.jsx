import { Card, Title } from "@tremor/react";
import { Link } from "react-router-dom";
import UserIcon from "/src/assets/users.svg";
import DashBoardIcon from "/src/assets/dashboard.svg";
import Notifications from "/src/assets/notifications.svg";
import Rooms from "/src/assets/rooms.svg";
import Cubicle from "/src/assets/cubicle.svg";
import Resources from "/src/assets/resources.svg";
import GeneralReservations from "/src/assets/GReservations.svg";
import PendingReservations from "/src/assets/pendingReservations.svg";

export function ManageReservationsPage() {
    const navigation = [
        {
            name: 'Usuarios',
            href: '/users',
            current: false,
            svg: UserIcon
        },
        {
            name: 'Dashboard',
            href: '/#',
            current: false,
            svg: DashBoardIcon
        },
        { name: 'Enviar notificaciones', href: '/generalEmails', current: false, svg: Notifications },
        { name: 'Salas', href: '/rooms', current: false, svg: Rooms },
        { name: 'Cubiculos', href: '/cubicles', current: false, svg: Cubicle },
        { name: 'Recursos', href: '/resources', current: false, svg: Resources },
        { name: 'Reservaciones Generales', href: '/allReservations', current: false, svg: GeneralReservations },
        { name: 'Reservaciones Pendientes', href: '/pendingReservations', current: false, svg: PendingReservations },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className="text-none"
                    >
                        <div className="w-full sm:w-64 h-48 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200">
                            <img src={item.svg} alt={`${item.name} icon`} className="mb-4 w-10 h-10" />
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
