import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { getReservationByUserId, deleteReservation, shareReservation } from "../services/reservationService.jsx";
import { getNameRoomById } from "../services/roomService.jsx";
import { getCubicleById } from "../services/cubicleService.jsx";
import { useAuthContext } from "../../SecurityModule/hooks/useAuthContext.js";
import { usePersonalReservation } from "../hooks/usePersonalReservation.js";
import { getUserById } from "../../SecurityModule/services/userService.jsx";
import ReservationFormEdit from "../components/Reservations/ReservationFormEdit.jsx";
import ShareReservationModal from "../components/Reservations/ShareReservationModal.jsx";
import Swal from "sweetalert2";
import BackButton from "../../utils/BackButton.jsx";
import {
    PencilSquareIcon,
    TrashIcon,
    ShareIcon,
} from "@heroicons/react/24/outline";

function AllPersonalReservationPage() {
    const { user } = useAuthContext();
    const { selectedReservation, handleEditReservation, handleReservationUpdated } =
        usePersonalReservation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reservationToShare, setReservationToShare] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);


    const parseReservationDate = (reservation) => {
        const [hours, minutes] = reservation.HoraInicio.split(":").map(Number);
        const dateObj = new Date(reservation.Fecha);
        const year = dateObj.getUTCFullYear();
        const month = dateObj.getUTCMonth(); // 0-indexed
        const day = dateObj.getUTCDate();

        return new Date(year, month, day, hours, minutes, 0, 0); // hora local correcta
    };


    const fetchReservations = async (page = 1) => {
        try {
            const data = await getReservationByUserId(user, page, itemsPerPage);

            const reservationsWithDetails = await Promise.all(
                data.reservations.map(async (reservation) => {
                    let placeName = "";
                    if (reservation.idCubiculo) {
                        const cubicle = await getCubicleById(reservation.idCubiculo);
                        placeName = cubicle.Nombre;
                    } else if (reservation.idSala) {
                        const room = await getNameRoomById(reservation.idSala);
                        placeName = room.Nombre;
                    }
                    return { ...reservation, placeName };
                })
            );

            const now = new Date();

            const upcoming = reservationsWithDetails.filter(
                (r) => parseReservationDate(r) >= now
            );
            const past = reservationsWithDetails.filter(
                (r) => parseReservationDate(r) < now
            );

            upcoming.sort((a, b) => parseReservationDate(a) - parseReservationDate(b));
            past.sort((a, b) => parseReservationDate(b) - parseReservationDate(a));

            setReservations([...upcoming, ...past]);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error al obtener las reservaciones:", error);
        }
    };


    const handleEditPersonalReservation = (reservation) => {
        handleEditReservation(reservation);
        navigate(`/personalReservations/edit/${reservation.idReservacion}`);
    };

    const handleReservationCreated = () => {
        handleReservationUpdated();
        navigate("/personalReservations");
    };

    const handleDeleteReservation = async (idReservacion) => {
        Swal.fire({
            title: "¿Eliminar reserva?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#002855",
            cancelButtonColor: "#EF3340",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteReservation(idReservacion);
                    setReservations(
                        reservations.filter((r) => r.idReservacion !== idReservacion)
                    );
                    Swal.fire("Eliminada", "La reservación ha sido eliminada.", "success");
                } catch (error) {
                    console.error("Error al eliminar la reservación:", error);
                }
            }
        });
    };

    const handleOpenModal = (reservation) => {
        setReservationToShare(reservation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReservationToShare(null);
    };

    const handleShareReservation = async (emails) => {
        if (!reservationToShare) return;
        try {
            const userData = await getUserById(user);
            const userName = userData.Nombre;

            const reservationData = {
                correosDestinatarios: emails,
                nombreRemitente: userName,
                reservationDetails: reservationToShare,
                observaciones: reservationToShare.Observaciones,
                idSala: reservationToShare.idSala,
                idCubiculo: reservationToShare.idCubiculo,
                refrigerio: reservationToShare.Refrigerio,
            };

            await shareReservation(reservationData);

            Swal.fire("¡Compartida!", "La reservación se envió con éxito.", "success");
            handleCloseModal();
        } catch (error) {
            Swal.fire("Error", "No se ingresaron correos válidos.", "error");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchReservations(newPage);
        }
    };

    const location = useLocation();
    const isOnCreateOrEditPage = location.pathname.startsWith(
        "/personalReservations/edit/"
    );

    return (
        <>
            <BackButton />
            <div style={{maxWidth: '1800px', margin: '0 auto', padding: '0 20px'}}>
                {!isOnCreateOrEditPage && (
                    <>
                        <h1 className="text-center text-3xl font-bold mt-12 mb-12 text-gray-800">
                            Mis Reservaciones
                        </h1>

                        {/* Grid de tarjetas */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                            {reservations.map((reservation) => {
                                const isUpcoming =
                                    new Date(reservation.Fecha) > new Date() ||
                                    (new Date(reservation.Fecha).toDateString() ===
                                        new Date().toDateString() &&
                                        new Date().getHours() <
                                        parseInt(reservation.HoraInicio.split(":")[0]));

                                return (
                                    <div
                                        key={reservation.idReservacion}
                                        className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200 flex flex-col justify-between"
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold text-pantone-blue mb-2">
                                                {reservation.placeName}
                                            </h2>
                                            <p className="text-gray-600">
                                                📅{" "}
                                                {new Date(reservation.Fecha).toLocaleDateString("es-ES", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                🕒 {reservation.HoraInicio} - {reservation.HoraFin}
                                            </p>
                                            <p className="mt-2 text-sm text-gray-500">
                                                {reservation.idCubiculo
                                                    ? "Cubículo reservado"
                                                    : reservation.Observaciones || "Sin observaciones"}
                                            </p>
                                            {!reservation.idCubiculo && (
                                                <div className="mt-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">Refrigerio: </span>
                                                        {reservation.Refrigerio ? "Sí" : "No"}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Recursos: </span>
                                                        {reservation.recursos?.length > 0
                                                            ? reservation.recursos
                                                                .map((r) => r.NombreRecurso)
                                                                .join(", ")
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex justify-end gap-3 mt-4">
                                            {isUpcoming ? (
                                                <>
                                                    {reservation.idSala && (
                                                        <button
                                                            onClick={() => handleEditPersonalReservation(reservation)}
                                                            className="text-blue-600 hover:scale-150 transition-transform"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteReservation(reservation.idReservacion)}
                                                        className="text-red-600 hover:scale-150 transition-transform"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(reservation)}
                                                        className="text-green-600 hover:scale-150 transition-transform"
                                                    >
                                                        <ShareIcon className="h-5 w-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">
      Acciones no disponibles
    </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Paginación */}
                        <div className="flex justify-center items-center mt-8 space-x-2 mb-32">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === 1
                                        ? "bg-gray-300 text-gray-600"
                                        : "bg-pantone-blue text-white hover:bg-blue-800"
                                }`}
                            >
                                Anterior
                            </button>
                            <span className="text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === totalPages
                                        ? "bg-gray-300 text-gray-600"
                                        : "bg-pantone-blue text-white hover:bg-blue-800"
                                }`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}


                <Routes>
                    <Route
                        path="edit/:id"
                        element={
                            <ReservationFormEdit
                                selectedPersonalReservation={selectedReservation}
                                onReservationUpdated={handleReservationCreated}
                            />
                        }
                    />
                </Routes>

                <ShareReservationModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    handleShare={handleShareReservation}
                />
            </div>
        </>
    );
}

export default AllPersonalReservationPage;
