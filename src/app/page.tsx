"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SkeletonCard from '@/components/SkeletonCard';
import useInView from '@/hooks/useInView';

// Definiciones de interfaces (asegúrate de que coincidan con tus modelos de Django)
interface Servicio {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
}

interface Paquete {
  id: number;
  titulo: string;
  descripcion_corta: string;
  caracteristicas: string[];
  precio: number;
}

interface ArticuloBlog {
  id: number;
  titulo: string;
  slug: string;
  imagen_destacada: string;
  autor: string;
  fecha_publicacion: string;
  contenido: string;
}

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
}

// Funciones para obtener datos (ahora llamadas en el cliente)
async function getServicios(): Promise<Servicio[]> {
  const serviciosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios/`, { cache: 'force-cache' });
  if (!serviciosRes.ok) {
    throw new Error('Failed to fetch servicios');
  }
  return serviciosRes.json();
}

async function getPaquetes(): Promise<Paquete[]> {
  const paquetesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paquetes/`, { cache: 'force-cache' });
  if (!paquetesRes.ok) {
    throw new Error('Failed to fetch paquetes');
  }
  return paquetesRes.json();
}


async function getArticulosBlog(): Promise<ArticuloBlog[]> {
  const blogRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`, { cache: 'force-cache' });
  if (!blogRes.ok) {
    throw new Error('Failed to fetch blog articles');
  }
  return blogRes.json();
}

async function getPreguntasFrecuentes(): Promise<PreguntaFrecuente[]> {
  const faqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preguntas-frecuentes/`, { cache: 'force-cache' });
  if (!faqRes.ok) {
    throw new Error('Failed to fetch preguntas frecuentes');
  }
  return faqRes.json();
}

// Componentes de contenido para cada sección
const ServiciosContent = ({ servicios }: { servicios: Servicio[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {servicios.slice(0, 3).map((servicio) => (
      <div key={servicio.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
        <i className={`${servicio.icono} text-5xl text-indigo-600 mb-4`}></i>
        <h3 className="text-xl font-semibold mb-2">{servicio.nombre}</h3>
        <p className="text-gray-700 text-sm">{servicio.descripcion.substring(0, 100)}...</p>
        <Link href="/servicios" className="mt-4 inline-block text-indigo-500 hover:underline">
          Ver más
        </Link>
      </div>
    ))}
  </div>
);

const PaquetesContent = ({ paquetes }: { paquetes: Paquete[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {paquetes.slice(0, 2).map((paquete) => {
      const precioNumerico = Number(paquete.precio);
      return (
        <div key={paquete.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">{paquete.titulo}</h3>
          <p className="text-gray-600 mb-4">{paquete.descripcion_corta}</p>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            {paquete.caracteristicas.map((caracteristica, index) => (
              <li key={index}>{caracteristica}</li>
            ))}
          </ul>
          <p className="text-2xl font-bold text-right text-indigo-700">${precioNumerico.toFixed(2)}</p>
          <div className="text-center mt-4">
            <Link href="/paquetes" className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700">
              Ver Detalles
            </Link>
          </div>
        </div>
      );
    })}
  </div>
);

const BlogContent = ({ articulos }: { articulos: ArticuloBlog[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {articulos.slice(0, 3).map((articulo) => (
      <div key={articulo.id} className="bg-white p-6 rounded-lg shadow-sm">
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
        <h3 className="text-xl font-semibold mb-2 text-indigo-600">{articulo.titulo}</h3>
        <p className="text-gray-600 text-sm mb-2">Por {articulo.autor} el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
        <p className="text-gray-700 text-sm mb-4">{articulo.contenido.substring(0, 100)}...</p>
        <Link href={`/blog/${articulo.slug}`} className="text-indigo-500 hover:underline">
          Leer más
        </Link>
      </div>
    ))}
  </div>
);

const FAQContent = ({ preguntas }: { preguntas: PreguntaFrecuente[] }) => (
  <div className="space-y-4">
    {preguntas.slice(0, 3).map((item) => (
      <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-2 text-indigo-600">{item.pregunta}</h3>
        <p className="text-gray-700 text-sm">{item.respuesta.substring(0, 150)}...</p>
        <div className="text-right mt-2">
          <Link href="/faq" className="text-indigo-500 hover:underline">
            Ver todas las preguntas
          </Link>
        </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [articulos, setArticulos] = useState<ArticuloBlog[]>([]);
  const [preguntas, setPreguntas] = useState<PreguntaFrecuente[]>([]);

  const { ref: serviciosRef, isInView: serviciosInView } = useInView();
  const { ref: paquetesRef, isInView: paquetesInView } = useInView();
  const { ref: blogRef, isInView: blogInView } = useInView();
  const { ref: faqRef, isInView: faqInView } = useInView();

  useEffect(() => {
    if (serviciosInView && servicios.length === 0) {
      getServicios().then(setServicios);
    }
  }, [serviciosInView, servicios]);

  useEffect(() => {
    if (paquetesInView && paquetes.length === 0) {
      getPaquetes().then(setPaquetes);
    }
  }, [paquetesInView, paquetes]);

  useEffect(() => {
    if (blogInView && articulos.length === 0) {
      getArticulosBlog().then(setArticulos);
    }
  }, [blogInView, articulos]);

  useEffect(() => {
    if (faqInView && preguntas.length === 0) {
      getPreguntasFrecuentes().then(setPreguntas);
    }
  }, [faqInView, preguntas]);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white text-center p-8 rounded-lg shadow-md mb-8 animate-fade-up">
        <h1 className="text-5xl font-bold mb-4">Tu Presencia Online, Nuestra Pasión</h1>
        <p className="text-xl">Creamos soluciones web a medida para impulsar tu negocio.</p>
        <Link href="/contacto" className="mt-4 inline-block bg-white text-indigo-600 font-semibold py-2 px-6 rounded-md hover:bg-gray-100">
          Contáctanos
        </Link>
      </section>

      {/* Servicios Section */}
      <section ref={serviciosRef} className={`mb-8 ${serviciosInView ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">Nuestros Servicios</h2>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }>
          {servicios.length > 0 ? <ServiciosContent servicios={servicios} /> : null}
        </Suspense>
        <div className="text-center mt-8">
          <Link href="/servicios" className="text-indigo-600 font-semibold hover:underline text-lg">
            Ver todos los servicios
          </Link>
        </div>
      </section>

      {/* Paquetes Section */}
      <section ref={paquetesRef} className={`mb-8 ${paquetesInView ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">Nuestros Paquetes</h2>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }>
          {paquetes.length > 0 ? <PaquetesContent paquetes={paquetes} /> : null}
        </Suspense>
        <div className="text-center mt-8">
          <Link href="/paquetes" className="text-indigo-600 font-semibold hover:underline text-lg">
            Ver todos los paquetes
          </Link>
        </div>
      </section>

      {/* Blog Section */}
      <section ref={blogRef} className={`mb-8 ${blogInView ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">Últimos Artículos del Blog</h2>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }>
          {articulos.length > 0 ? <BlogContent articulos={articulos} /> : null}
        </Suspense>
        <div className="text-center mt-8">
          <Link href="/blog" className="text-indigo-600 font-semibold hover:underline text-lg">
            Ver todos los artículos
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className={`mb-8 ${faqInView ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">Preguntas Frecuentes</h2>
        <Suspense fallback={
          <div className="space-y-4 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }>
          {preguntas.length > 0 ? <FAQContent preguntas={preguntas} /> : null}
        </Suspense>
        <div className="text-center mt-8">
          <Link href="/faq" className="text-indigo-600 font-semibold hover:underline text-lg">
            Ver todas las preguntas
          </Link>
        </div>
      </section>
    </main>
  );
}
