import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    getReservationsByYear,
    getReservationsByMonth,
    getReservationsByRange
} from '../../../ReservationModule/services/reservationService.jsx';
import { getRooms } from '../../../ReservationModule/services/roomService.jsx';
import { getCubicles } from '../../../ReservationModule/services/cubicleService.jsx';
import { getAllValorations } from '../../../ReservationModule/services/valorationService.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'chart.js/auto';
import ViewReviewStars from "./ViewReviewStars.jsx";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './dashboard.css';
import {useNavigate} from "react-router-dom";


// Componente principal Dashboard para mostrar datos de reservas y valoraciones de salas o cubículos
const Dashboard = ({ type }) => {
    // Estado para almacenar datos de reservas, valoraciones, período de tiempo, fechas de rango, ...
    const [reservationsData, setReservationsData] = useState([]);
    const [valorationsData, setValorationsData] = useState([]);
    const [timePeriod, setTimePeriod] = useState('week');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [totalReservations, setTotalReservations] = useState(0);
    const dashboardRef = useRef();
    const navigate = useNavigate();

    // Carga las salas o cubículos en función del tipo pasado como prop
    useEffect(() => {
        loadItems();
    }, [type]);

    // Función para cargar items (salas o cubículos) y almacenarlos en el estado
    const loadItems = async () => {
        const data = type === 'room' ? await getRooms() : await getCubicles();
        setItems(data);
    };

    // Carga datos de reservas y valoraciones cada vez que cambian el período de tiempo o las fechas de rango
    useEffect(() => {
        loadReservationsData();
        loadValorationsData();
    }, [timePeriod, startDate, endDate, items]);

    // Función para cargar datos de reservas basados en el período de tiempo seleccionado y fechas de rango
    const loadReservationsData = async () => {
        let reservations;
        if (timePeriod === 'year') {
            reservations = await getReservationsByYear(startDate.getFullYear());
        } else if (timePeriod === 'month') {
            reservations = await getReservationsByMonth(startDate.getFullYear(), startDate.getMonth() + 1);
        } else {
            reservations = await getReservationsByRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        }

        // Calcula el uso de cada sala o cubículo en base a las reservas
        const usageData = calculateUsage(reservations);
        const total = usageData.reduce((sum, item) => sum + item.usage, 0); // Calcula el total de reservas
        setTotalReservations(total);

        setReservationsData(usageData);
    };

    // Función para cargar datos de valoraciones y calcular promedio de valoraciones para cada sala o cubículo
    const loadValorationsData = async () => {
        const allValorations = await getAllValorations();
        const averageRatings = calculateAverageRating(allValorations);
        setValorationsData(averageRatings);
    };

    // Calcula el número de reservas para cada sala o cubículo y retorna un arreglo de objetos con el nombre y el uso
    const calculateUsage = (reservations) => {
        const usage = items.map((item) => {
            const itemId = type === 'room' ? item.idSala : item.idCubiculo;
            const usageCount = reservations.filter((res) =>
                (type === 'room' ? res.idSala : res.idCubiculo) === itemId
            ).length;
            return { item: item.Nombre, usage: usageCount };
        });
        return usage;
    };

    // Calcula el promedio de valoraciones para cada sala o cubículo en base a las valoraciones existentes
    const calculateAverageRating = (valorations) => {
        const averageRatings = items.map((item) => {
            const itemId = type === 'room' ? item.idSala : item.idCubiculo;
            const itemValorations = valorations.filter((val) =>
                (type === 'room' ? val.idSala : val.idCubiculo) === itemId
            );
            const averageRating = itemValorations.length > 0
                ? itemValorations.reduce((sum, val) => sum + val.Nota, 0) / itemValorations.length
                : 0;
            return { name: item.Nombre, averageRating };
        });
        return averageRatings;
    };

    // Abre el modal para ver comentarios de la valoración seleccionada
    const openModal = async () => {
        setIsModalOpen(true);
    };

    // Cierra el modal y limpia el estado de comentarios y elemento seleccionado
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setComments([]);
    };

    // Maneja la selección de un ítem en el modal, obteniendo los comentarios asociados
    const handleSelectItem = async (event) => {
        const selectedId = event.target.value;
        setSelectedItem(selectedId);

        const allValorations = await getAllValorations();
        const itemComments = allValorations.filter((val) =>
            type === 'room' ? val.idSala === parseInt(selectedId) : val.idCubiculo === parseInt(selectedId)
        );

        setComments(itemComments);
    };

    // Exporta la vista del dashboard a PDF utilizando html2canvas y jsPDF
    const exportToPDF = async () => {
        const dashboardElement = dashboardRef.current;

        // Oculta los elementos con clase no-print antes de la exportación
        const noPrintElements = document.querySelectorAll('.no-print');
        noPrintElements.forEach((el) => {
            el.style.display = 'none';
        });

        const canvas = await html2canvas(dashboardElement);
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`reporte_de_${type === 'room' ? 'Salas' : 'Cubículos'}.pdf`);

        // Restaura la visibilidad de los elementos ocultos después de la exportación
        noPrintElements.forEach((el) => {
            el.style.display = '';
        });
    };

    return (
        <div className="container mx-auto px-4 sm:px-10 py-6" ref={dashboardRef}>
            {/* Botón de regreso */}
            <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:block absolute no-print top-17 left-2 p-1 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>

            {/* Título */}
            <h1 className="text-center text-xl sm:text-2xl font-bold my-4">
                Reporte de {type === 'room' ? 'Salas' : 'Cubículos'}
            </h1>

            {/* Botón de exportar y filtros */}
            <div
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <button className="px-4 py-2 bg-pantone-blue text-white rounded-md no-print w-full sm:w-auto hover:bg-pantone-blue/80"
                        onClick={exportToPDF}>
                    Exportar a PDF
                </button>
                <div className="flex justify-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <button className="px-4 py-2 bg-pantone-blue text-white rounded-md w-full sm:w-auto hover:bg-pantone-blue/80"
                            onClick={() => setTimePeriod('week')}>
                        Semana
                    </button>
                    <button className="px-4 py-2 bg-pantone-blue text-white rounded-md w-full sm:w-auto hover:bg-pantone-blue/80"
                            onClick={() => setTimePeriod('month')}>
                        Mes
                    </button>
                    <button className="px-4 py-2 bg-pantone-blue text-white rounded-md w-full sm:w-auto hover:bg-pantone-blue/80"
                            onClick={() => setTimePeriod('year')}>
                        Año
                    </button>
                </div>
            </div>

            {/* Selectores de fecha */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                {timePeriod === 'week' && (
                    <>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha de inicio"
                            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha de fin"
                            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                        />
                    </>
                )}
                {timePeriod === 'month' && (
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Selecciona el mes"
                        className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                    />
                )}
                {timePeriod === 'year' && (
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        placeholderText="Selecciona el año"
                        className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                    />
                )}
            </div>

            {/* Gráficos */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">
                <div className="w-full sm:w-[45%] p-4 border border-gray-200 rounded-lg shadow-md">
                    <h2 className="text-center text-lg font-semibold mb-2">
                        Uso de {type === 'room' ? 'Salas' : 'Cubículos'} (Total de reservas: {totalReservations})
                    </h2>
                    <Line data={{
                        labels: reservationsData.map((res) => res.item),
                        datasets: [
                            {
                                label: `Uso de ${type === 'room' ? 'Salas' : 'Cubículos'}`,
                                data: reservationsData.map((res) => res.usage),
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                            },
                        ],
                    }}/>
                </div>

                <div className="w-full sm:w-[45%] p-4 border border-gray-200 rounded-lg shadow-md relative">
                    <h2 className="text-center text-lg font-semibold mb-4">
                        Valoración de {type === 'room' ? 'Salas' : 'Cubículos'}
                    </h2>
                    <button
                        className="absolute top-2 right-2 px-2 py-1 bg-pantone-blue text-white rounded-md no-print hover:bg-pantone-blue/80"
                        onClick={openModal}
                    >
                        Ver Comentarios
                    </button>
                    <Bar data={{
                        labels: valorationsData.map((val) => val.name),
                        datasets: [
                            {
                                label: 'Promedio de Valoración',
                                data: valorationsData.map((val) => val.averageRating),
                                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 2,
                            },
                        ],
                    }}/>
                </div>
            </div>

            {/* Modal de comentarios */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">Comentarios</h3>
                        <select
                            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                            onChange={handleSelectItem}
                            value={selectedItem || ""}
                        >
                            <option value="" disabled>Selecciona {type === 'room' ? 'Sala' : 'Cubículo'}</option>
                            {items.map((item) => (
                                <option key={item.id} value={type === 'room' ? item.idSala : item.idCubiculo}>
                                    {item.Nombre}
                                </option>
                            ))}
                        </select>
                        <div className="max-h-64 overflow-y-auto">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="border-b border-gray-200 py-2">
                                        <p>{comment.Observaciones || 'Sin comentarios'}</p>
                                        <ViewReviewStars rating={comment.Nota}/>
                                    </div>
                                ))
                            ) : (
                                <p>No hay comentarios disponibles.</p>
                            )}
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-pantone-red text-white rounded-md w-full hover:bg-pantone-red/80"
                            onClick={closeModal}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Dashboard;
