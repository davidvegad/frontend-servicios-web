'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getLinkClasses = (href: string) => {
    const baseClasses = "block md:inline-block mr-4 mb-2 md:mb-0 p-2 rounded";
    const activeClasses = pathname === href ? "bg-gray-700" : "";
    const hoverClasses = "hover:bg-gray-700";
    return `${baseClasses} ${activeClasses} ${hoverClasses}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Servicios Web</Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div className={`md:flex ${isOpen ? 'block' : 'hidden'} flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0`}>
          <Link href="/servicios" onClick={() => setIsOpen(false)} className={getLinkClasses("/servicios")}>Servicios</Link>
          <Link href="/paquetes" onClick={() => setIsOpen(false)} className={getLinkClasses("/paquetes")}>Paquetes</Link>
          <Link href="/nosotros" onClick={() => setIsOpen(false)} className={getLinkClasses("/nosotros")}>Sobre Nosotros</Link>
          <Link href="/faq" onClick={() => setIsOpen(false)} className={getLinkClasses("/faq")}>FAQ</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className={getLinkClasses("/blog")}>Blog</Link>
          <Link href="/contacto" onClick={() => setIsOpen(false)} className={getLinkClasses("/contacto")}>Contacto</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
