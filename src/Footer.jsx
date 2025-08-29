// src/components/Footer.jsx
import React from "react";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-6 mt-10" >
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                {/* Contacto */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Contacto</h2>
                    <p className="flex items-center mb-2">
                        <Phone className="w-5 h-5 mr-2" /> +506 2222-2222
                    </p>
                    <p className="flex items-center mb-2">
                        <Mail className="w-5 h-5 mr-2" /> reservas@tec.ac.cr
                    </p>
                    <p className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" /> Alajuela, Costa Rica
                    </p>
                </div>

                {/* Links rápidos */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Enlaces</h2>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:underline">Inicio</a></li>
                        <li><a href="allRoomReservation" className="hover:underline">Salas</a></li>
                        <li><a href="reservationsCubicle" className="hover:underline">Cubículos</a></li>
                        <li><a href="categoryAssets" className="hover:underline">Activos</a></li>
                    </ul>

                    <div className="flex space-x-4 mt-4">
                        <a href="#" aria-label="Facebook">
                            <Facebook className="w-6 h-6 hover:text-blue-500" />
                        </a>
                        <a href="#" aria-label="Instagram">
                            <Instagram className="w-6 h-6 hover:text-pink-500" />
                        </a>
                    </div>
                </div>

                {/* Mapa */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2514.656692221593!2d-84.21612799241596!3d10.006255196508665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0f9b8106ae04b%3A0x95eeb17783362f9d!2sSede%20Central%20de%20la%20Universidad%20T%C3%A9cnica%20Nacional!5e1!3m2!1ses!2scr!4v1756179642007!5m2!1ses!2scr"
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Maps TEC"
                        />
                    </div>
                </div>


            </div>

            <div className="text-center text-gray-400 text-sm mt-10">
                © {new Date().getFullYear()} Sistema de Reservaciones CAA. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
