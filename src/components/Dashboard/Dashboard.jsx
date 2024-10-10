import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    getReservationsByYear,
    getReservationsByMonth,
    getReservationsByRange
} from '../../services/reservationService';
import { getRooms } from '../../services/roomService';
import { getCubicles } from '../../services/cubicleService';
import { getAllValorations } from '../../services/valorationService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'chart.js/auto';
import ViewReviewStars from "./ViewReviewStars.jsx";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './dashboard.css';
import {useNavigate} from "react-router-dom";


const Dashboard = ({ type }) => {
    const [reservationsData, setReservationsData] = useState([]);
    const [valorationsData, setValorationsData] = useState([]);
    const [timePeriod, setTimePeriod] = useState('week');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [items, setItems] = useState([]); // Salas o cubículos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [totalReservations, setTotalReservations] = useState(0); // Estado para el total de reservas
    const dashboardRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        loadItems();
    }, [type]);

    const loadItems = async () => {
        const data = type === 'room' ? await getRooms() : await getCubicles();
        setItems(data);
    };

    useEffect(() => {
        loadReservationsData();
        loadValorationsData();
    }, [timePeriod, startDate, endDate, items]);

    const loadReservationsData = async () => {
        let reservations;
        if (timePeriod === 'year') {
            reservations = await getReservationsByYear(startDate.getFullYear());
        } else if (timePeriod === 'month') {
            reservations = await getReservationsByMonth(startDate.getFullYear(), startDate.getMonth() + 1);
        } else {
            reservations = await getReservationsByRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        }
        const usageData = calculateUsage(reservations);


        const total = usageData.reduce((sum, item) => sum + item.usage, 0);
        setTotalReservations(total);

        setReservationsData(usageData);
    };

    const loadValorationsData = async () => {
        const allValorations = await getAllValorations();
        const averageRatings = calculateAverageRating(allValorations);
        setValorationsData(averageRatings);
    };

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

    const openModal = async () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setComments([]);
    };

    const handleSelectItem = async (event) => {
        const selectedId = event.target.value;
        setSelectedItem(selectedId);

        const allValorations = await getAllValorations();
        const itemComments = allValorations.filter((val) =>
            type === 'room' ? val.idSala === parseInt(selectedId) : val.idCubiculo === parseInt(selectedId)
        );

        setComments(itemComments);
    };

    const exportToPDF = async () => {
        const dashboardElement = dashboardRef.current;


        const noPrintElements = document.querySelectorAll('.no-print');
        noPrintElements.forEach((el) => {
            el.style.display = 'none';
        });

        // Genera la captura y el PDF
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

        // Restaura la visibilidad de los elementos no-print
        noPrintElements.forEach((el) => {
            el.style.display = '';
        });
    };

    return (
        <div className="container mx-auto px-10 py-6" ref={dashboardRef}>
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80px',
                    left: '10px',
                    padding: '5px',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" style={{width: '32px', height: '32px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>


            </button>
            <h1 className="text-center text-2xl font-bold my-4">Reporte
                de {type === 'room' ? 'Salas' : 'Cubículos'}</h1>

            <div className="flex justify-center items-center space-x-4 mb-6">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md no-print" onClick={exportToPDF}>
                    Exportar a PDF
                </button>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setTimePeriod('week')}>Semana
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setTimePeriod('month')}>Mes
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setTimePeriod('year')}>Año
                </button>
            </div>

            <div className="flex justify-center gap-4 mb-6">
                {timePeriod === 'week' && (
                    <>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha de inicio"
                            className="border border-gray-300 rounded-md p-2"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Fecha de fin"
                            className="border border-gray-300 rounded-md p-2"
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
                        className="border border-gray-300 rounded-md p-2"
                    />
                )}
                {timePeriod === 'year' && (
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        placeholderText="Selecciona el año"
                        className="border border-gray-300 rounded-md p-2"
                    />
                )}
            </div>

            <div className="flex justify-center gap-10 mb-6">
                <div className="w-[45%] p-4 border border-gray-200 rounded-lg shadow-md">
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

                <div className="w-[45%] p-4 border border-gray-200 rounded-lg shadow-md relative">
                    <h2 className="text-center text-lg font-semibold mb-4">Valoración
                        de {type === 'room' ? 'Salas' : 'Cubículos'}</h2>
                    <button
                        className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded-md no-print"
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
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md w-full"
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
