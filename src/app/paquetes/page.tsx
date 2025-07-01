import React from 'react';

interface Paquete {
  id: number;
  titulo: string;
  descripcion_corta: string;
  caracteristicas: string[];
  precio: number;
}

async function getPaquetes(): Promise<Paquete[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paquetes/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch paquetes');
  }
  return res.json();
}

const PaquetesPage = async () => {
  const paquetes = await getPaquetes();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Paquetes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paquetes.map((paquete) => {
          const precioNumerico = Number(paquete.precio); // Convertir explícitamente a número
          return (
            <div key={paquete.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">{paquete.titulo}</h2>
              <p className="text-gray-600 mb-4">{paquete.descripcion_corta}</p>
              <ul className="list-disc list-inside mb-4">
                {paquete.caracteristicas.map((caracteristica, index) => (
                  <li key={index}>{caracteristica}</li>
                ))}
              </ul>
              <p className="text-2xl font-bold text-right">${precioNumerico.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaquetesPage;