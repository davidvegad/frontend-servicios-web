import React from 'react';

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error('Failed to fetch blog article');
  }
  return res.json();
}

export async function generateStaticParams() {
  console.log('Attempting to fetch blog articles for generateStaticParams...');
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL is not defined during generateStaticParams build!');
      return []; // Return empty array if API URL is missing
    }

    const res = await fetch(`${apiUrl}/blog/`, { cache: 'force-cache' });

    if (!res.ok) {
      console.error(`Failed to fetch blog articles: ${res.status} ${res.statusText}`);
      return []; // Return empty array if response is not OK
    }

    const articulos: ArticuloBlog[] = await res.json();
    console.log('Fetched articles for generateStaticParams:', articulos.length, 'articles');
    console.log('First article slug:', articulos.length > 0 ? articulos[0].slug : 'N/A');

    return articulos.map((articulo) => ({
      slug: articulo.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return []; // Crucially, return an empty array on any error to prevent build failure
  }
}

const ArticuloBlogPage = async ({ params }: { params: { slug: string } }) => {
  const articulo = await getArticuloBlog(params.slug);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {articulo.imagen_destacada && (
        <div className="relative w-full h-96 mb-6">
          <img
            src={articulo.imagen_destacada}
            alt={articulo.titulo}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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