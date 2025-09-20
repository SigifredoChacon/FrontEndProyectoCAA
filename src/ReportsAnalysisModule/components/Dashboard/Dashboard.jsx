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
import ViewReviewStars from "./ViewReviewStars.jsx";
import './dashboard.css';
import {useNavigate} from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';
import autoTable from "jspdf-autotable";
import tecIMG from '../../../assets/tec.png';
import BackButton from "../../../utils/BackButton.jsx";


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
    const [reservationsRaw, setReservationsRaw] = useState([]);

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
        setReservationsRaw(reservations);
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
    const formatDate = (d) => {
        if (!d) return '';
        const date = new Date(d);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatRangeText = () => {
        if (timePeriod === 'year') {
            const y = startDate.getFullYear();
            return `Año ${y}`;
        }
        if (timePeriod === 'month') {
            const monthName = startDate.toLocaleString('es-ES', { month: 'long' });
            const y = startDate.getFullYear();
            return `Mes: ${monthName} ${y}`;
        }
        return `Desde ${formatDate(startDate)} hasta ${formatDate(endDate)}`;
    };

    const getMonthlyCounts = (reservations, tipo) => {
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const months = monthNames.map((name) => ({ month: name, count: 0 }));

        reservations.forEach((r) => {
            const d = new Date(r.Fecha);

                if (type === "room" && r.idCubiculo === null) {
                    months[d.getMonth()].count += 1;
                } else if (type === "cubicle" && r.idCubiculo !== null) {
                    months[d.getMonth()].count += 1;
                }

        });

        return months;
    };




    const getBusiestWeekday = (reservations) => {
        if (!reservations || reservations.length === 0) return { dayIndex: null, count: 0 };
        const counts = [0,0,0,0,0,0,0];
        reservations.forEach((r) => {
            if (type === "room" && r.idCubiculo !== null) return;
            if (type === "cubicle" && r.idCubiculo === null) return;
            const d = new Date(r.Fecha);
            const idx = d.getDay();
            counts[idx] += 1;
        });
        const maxCount = Math.max(...counts);
        const dayIndex = counts.indexOf(maxCount);
        const names = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        return { dayIndex, dayName: names[dayIndex], count: maxCount };
    };

    const getAverageReservationsPerItem = (usageData) => {
        if (!usageData || usageData.length === 0) return 0;
        const total = usageData.reduce((s, it) => s + it.usage, 0);
        return (total / usageData.length);
    };

    const getOverallAverageRating = (allValorations) => {
        if (!allValorations || allValorations.length === 0) return 0;
        const total = allValorations.reduce((s, v) => s + (v.Nota || 0), 0);
        return total / allValorations.length;
    };


    const generateReportPDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4'); // portrait
        const title = `Reporte de ${type === 'room' ? 'Salas' : 'Cubículos'} del sistema de reservas`;

        const barra = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdkAAABOCAYAAABsU2xNAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAqdEVYdENyZWF0aW9uIFRpbWUAc+FiIDIwIHNlcCAyMDI1IDAyOjEzOjAxIENTVLxTj9UAAAFSSURBVHic7dVBDcAgAMBAhhoMzb+UYYKGZLlT0F+fsd5vAADHzdsBAPBXJgsAEZMFgIjJAkDEZAEgYrIAEDFZAIiYLABETBYAIiYLABGTBYCIyQJAxGQBIGKyABAxWQCImCwAREwWACImCwARkwWAiMkCQMRkASBisgAQMVkAiJgsAERMFgAiJgsAEZMFgIjJAkDEZAEgYrIAEDFZAIiYLABETBYAIiYLABGTBYCIyQJAxGQBIGKyABAxWQCImCwAREwWACImCwARkwWAiMkCQMRkASBisgAQMVkAiJgsAERMFgAiJgsAEZMFgIjJAkDEZAEgYrIAEDFZAIiYLABETBYAIiYLABGTBYCIyQJAxGQBIGKyABAxWQCImCwAREwWACImCwARkwWAiMkCQMRkASBisgAQMVkAiJgsAERMFgAiJgsAEZMFgIjJAkDEZAEgsgFaTQIYXWegHwAAAABJRU5ErkJggg=='
        doc.addImage(barra, "PNG", 13,12, 100, 15);
        doc.addImage(tecIMG, "PNG", 118,12, 80, 15);


        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, 14, 37);
        doc.setFont('helvetica', 'normal');

        doc.setFontSize(11);
        doc.text(`Periodo: ${formatRangeText()}`, 14, 45);
        doc.text(`Fecha de generación: ${formatDate(new Date())}`, 14, 51);

        let y = 59;

        // 1) Tabla: uso por sala ordenado desc
        const usageSorted = [...reservationsData].sort((a,b) => b.usage - a.usage);
        const usageTableBody = usageSorted.map((u, idx) => [idx+1, u.item, String(u.usage)]);
        if (usageTableBody.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text(type === 'room'?'Desglose de reservas por sala (mayor a menor):': 'Desglose de reservas por cubículo (mayor a menor):', 14, y);
            doc.setFont('helvetica', 'normal');
            y += 4;
            autoTable(doc, {
                startY: y,
                head: [['#','Nombre','Reservas']],
                body: usageTableBody,
                styles: { fontSize: 9, textColor: 20 },
                headStyles: { fillColor: [0, 40, 85], textColor: 255},
                bodyStyles: { fillColor: [245, 249, 255] },
                alternateRowStyles: { fillColor: [235, 242, 255] },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 60;
        } else {
            doc.text('No hay reservas en el periodo seleccionado.', 14, y);
            y += 10;
        }

        // Promedio de reservas por sala
        const avgReservations = getAverageReservationsPerItem(reservationsData);
        doc.setFontSize(11);
        doc.text(`Promedio de reservas por ${type === 'room' ? 'sala' : 'cubículo'}: ${avgReservations.toFixed(2)}`, 14, y);
        y += 8;

        // Si es año -> reservas por mes
        if (timePeriod === 'year' && reservationsRaw.length > 0) {
            const months = getMonthlyCounts(reservationsRaw);
            const monthBody = months.map(m => [m.month, String(m.count)]);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Reservas por mes:', 14, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            y += 4;
            autoTable(doc,{
                startY: y,
                head: [['Mes','Reservas']],
                body: monthBody,
                styles: { fontSize: 9, textColor: 20 },
                headStyles: { fillColor: [0, 40, 85], textColor: 255},
                bodyStyles: { fillColor: [245, 249, 255] },
                alternateRowStyles: { fillColor: [235, 242, 255] },
                theme: 'grid',
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 60;

            // 📌 Agregar promedio mensual aquí
            const totalYear = months.reduce((sum, m) => sum + m.count, 0);
            const avgMonthly = totalYear / months.length;
            console.log(months.length);
            doc.setFontSize(11);
            doc.text(`Promedio de reservas por mes: ${avgMonthly.toFixed(2)}`, 14, y);
            y += 8;
        }

        // Día de la semana con más reservas
        const busiest = getBusiestWeekday(reservationsRaw);


        // Tabla: promedio de valoraciones por sala/cubículo
        const ratingsSorted = [...valorationsData].sort((a,b) => b.averageRating - a.averageRating);
        const ratingsBody = ratingsSorted.map((r, idx) => [idx+1, r.name, r.averageRating ? r.averageRating.toFixed(2) : '0.00']);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`Promedio de valoraciones por ${type === 'room'? 'sala' : 'cubículo'} (mayor a menor):`, 14, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        y += 4;
        if (ratingsBody.length > 0) {
            autoTable(doc,{
                startY: y,
                head: [['#','Nombre','Promedio valoración']],
                body: ratingsBody,
                styles: { fontSize: 9, textColor: 20 },
                headStyles: { fillColor: [0, 40, 85], textColor: 255},
                bodyStyles: { fillColor: [245, 249, 255] },
                alternateRowStyles: { fillColor: [235, 242, 255] },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 60;
        } else {
            doc.text('No hay valoraciones registradas.', 14, y);
            y += 12;
        }

        const avgOfAverages = (valorationsData.length > 0)
            ? (valorationsData.reduce((s, v) => s + (v.averageRating || 0), 0) / valorationsData.length)
            : 0;

        doc.text(`Promedio global de las valoraciones: ${avgOfAverages.toFixed(2)}`, 14, y);
        y += 10;

        doc.setFontSize(11);
        doc.text('Observaciones y recomendaciones:', 14, y);
        y += 6;

        const notes = [];

        // 1) Día con más reservas
        if (busiest && busiest.dayName) {
            notes.push(`El día con más actividad fue ${busiest.dayName} (${busiest.count} reservas).`);
        }

        // 2) Sala/cubículo con mayor uso relativo
        const totalReservations = reservationsRaw.length;
        if (usageSorted.length > 0 && totalReservations > 0) {
            const topUsed = usageSorted[0];
            const pct = (topUsed.usage / totalReservations * 100).toFixed(1);
            notes.push(`La ${type === 'room' ? 'sala' : 'cubículo'} más usada concentró el ${pct}% de las reservas (${topUsed.usage}).`);
        }

        // 3) Sala/cubículo mejor valorada considerando uso
        if (valorationsData.length > 0) {
            const weightedRatings = valorationsData.map(v => {
                const usage = usageSorted.find(u => u.item === v.name)?.usage || 0;
                return { ...v, usage };
            }).filter(v => v.usage > 0);

            if (weightedRatings.length > 0) {
                const best = weightedRatings.sort((a,b) => b.averageRating - a.averageRating)[0];
                notes.push(`La ${type === 'room' ? 'sala' : 'cubículo'} mejor valorada con uso significativo fue ${best.name} (promedio ${best.averageRating.toFixed(2)}).`);
            }
        }

        // 4) Ratio de valoraciones por reserva
        if (reservationsRaw.length > 0) {
            const ratio = (await getAllValorations()).length / reservationsRaw.length;
            notes.push(`El ${Math.round(ratio * 100)}% de las reservas recibieron una valoración.`);
        }

        // 5) Variabilidad mensual (desviación estándar)
        if (timePeriod === 'year' && reservationsRaw.length > 0) {
            const months = getMonthlyCounts(reservationsRaw);
            const counts = months.map(m => m.count);
            const avg = counts.reduce((s,c) => s+c,0) / counts.length;
            const variance = counts.reduce((s,c) => s + Math.pow(c-avg,2),0) / counts.length;
            const stddev = Math.sqrt(variance).toFixed(2);
            notes.push(`La variabilidad mensual en las reservas (desviación estándar) fue de ${stddev}, indicando ${stddev > avg/2 ? 'altas fluctuaciones.' : 'uso relativamente estable.'}`);
        }

        // imprimir notas
        let lineY = y;
        notes.forEach((n) => {
            doc.text(`- ${n}`, 16, lineY);
            lineY += 6;
            if (lineY > 280) {
                doc.addPage();
                lineY = 20;
            }
        });

        // Guardar
        const filename = `reporte_de_${type === 'room' ? 'salas' : 'cubiculos'}_${Date.now()}.pdf`;
        doc.save(filename);
    };


    return (
        <div className="container mx-auto px-4 sm:px-10 py-6" ref={dashboardRef}>
            {/* Botón de regreso */}
            <BackButton />

            {/* Título */}
            <h1 className="text-center text-xl sm:text-2xl font-bold my-4">
                Reporte de {type === 'room' ? 'Salas' : 'Cubículos'}
            </h1>

            {/* Botón de exportar y filtros */}
            <div
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <button className="px-4 py-2 bg-pantone-blue text-white rounded-md no-print w-full sm:w-auto hover:bg-pantone-blue/80"
                        onClick={generateReportPDF}>
                    Generar reporte PDF
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
