import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ArticuloBlog {
  id: number;
  titulo: string;
  slug: string;
  imagen_destacada: string;
  autor: string;
  fecha_publicacion: string;
  contenido: string;
}

async function getArticulosBlog(): Promise<ArticuloBlog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch blog articles');
  }
  return res.json();
}

const BlogPage = async () => {
  const articulos = await getArticulosBlog();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestro Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articulos.map((articulo) => (
          <div key={articulo.id} className="bg-white p-6 rounded-lg shadow-md">
            {articulo.imagen_destacada && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={articulo.imagen_destacada}
                  alt={articulo.titulo}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 text-indigo-600">{articulo.titulo}</h2>
            <p className="text-gray-600 text-sm mb-2">Por {articulo.autor} el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-4">{articulo.contenido.substring(0, 150)}...</p>
            <Link href={`/blog/${articulo.slug}`} className="text-indigo-500 hover:underline">
              Leer más
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
