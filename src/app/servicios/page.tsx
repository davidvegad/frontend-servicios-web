import React from 'react';

interface Servicio {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
}

async function getServicios(): Promise<Servicio[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios/`);
  if (!res.ok) {
    throw new Error('Failed to fetch servicios');
  }
  return res.json();
}

const ServiciosPage = async () => {
  const servicios = await getServicios();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-gray-100 p-6 rounded-xl shadow-xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <i className={`${servicio.icono} text-5xl text-indigo-600 mb-4`}></i>
            <h2 className="text-xl font-semibold mb-2">{servicio.nombre}</h2>
            <p className="text-gray-600">{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiciosPage;