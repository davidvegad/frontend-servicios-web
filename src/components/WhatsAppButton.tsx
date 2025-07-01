import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Importa el icono de WhatsApp de Font Awesome

const WhatsAppButton = () => {
  const phoneNumber = '51980413558';
  const message = 'Hola quisiera mas informacion sobre sus servicios y paquetes';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={32} /> {/* Usa el componente del icono de WhatsApp */}
    </a>
  );
};

export default WhatsAppButton;