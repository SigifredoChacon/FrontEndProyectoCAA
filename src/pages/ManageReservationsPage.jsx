import { Card, Title } from "@tremor/react";
import { Link } from "react-router-dom";
import UserIcon from "/src/assets/users.svg";
import DashBoardIcon from "/src/assets/dashboard.svg";
import Notifications from "/src/assets/notifications.svg";
import Rooms from "/src/assets/rooms.svg";
import Cubicle from "/src/assets/cubicle.svg";
import Resources from "/src/assets/resources.svg";
import GeneralReservations from "/src/assets/GReservations.svg";

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
        { name: 'Reservaciones Generales', href: '/#', current: false, svg: GeneralReservations },
    ];

    return (
        <div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
            }}>
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card style={{
                            width: '250px',
                            height: '200px',
                            padding: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f7f7f7',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            {/* Incrustar SVG */}
                            {/* Mostrar el SVG */}
                            <img src={item.svg} alt={`${item.name} icon`} style={{ marginBottom: '16px', width: '40px', height: '40px' }} />
                            <Title style={{
                                fontSize: '18px',
                                textAlign: 'center',
                                color: '#333',
                            }}>
                                {item.name}
                            </Title>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
