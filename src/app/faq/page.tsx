import React from 'react';

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
}

async function getPreguntasFrecuentes(): Promise<PreguntaFrecuente[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preguntas-frecuentes/`);
  if (!res.ok) {
    throw new Error('Failed to fetch preguntas frecuentes');
  }
  return res.json();
}

const FAQPage = async () => {
  const preguntas = await getPreguntasFrecuentes();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Preguntas Frecuentes</h1>
      <div className="space-y-6">
        {preguntas.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600">{item.pregunta}</h2>
            <p className="text-gray-700">{item.respuesta}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;