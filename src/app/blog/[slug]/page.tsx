import React from 'react';
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

async function getArticuloBlog(slug: string): Promise<ArticuloBlog> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch blog article');
  }
  return res.json();
}

export async function generateStaticParams() {
  console.log('Attempting to fetch blog articles for generateStaticParams...');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error(`Failed to fetch blog articles: ${res.status} ${res.statusText}`);
    // Consider returning an empty array or re-throwing if this is a critical failure
    return []; 
  }

  const articulos: ArticuloBlog[] = await res.json();
  console.log('Fetched articles for generateStaticParams:', articulos.length, 'articles');
  console.log('First article slug:', articulos.length > 0 ? articulos[0].slug : 'N/A');

  return articulos.map((articulo) => ({
    slug: articulo.slug,
  }));
}

const ArticuloBlogPage = async ({ params }: { params: { slug: string } }) => {
  const articulo = await getArticuloBlog(params.slug);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {articulo.imagen_destacada && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={articulo.imagen_destacada}
            alt={articulo.titulo}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-md"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">{articulo.titulo}</h1>
      <p className="text-gray-600 text-sm mb-4">Por {articulo.autor} el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: articulo.contenido }}></div>
    </div>
  );
};

export default ArticuloBlogPage;