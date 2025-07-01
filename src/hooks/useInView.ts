import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
}

const useInView = ({ threshold = 0.1, rootMargin = '0px' }: UseInViewOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(`Elemento ${ref.current?.id || 'desconocido'} - isIntersecting: ${entry.isIntersecting}, isInView (estado actual): ${isInView}`);
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          console.log(`Elemento ${ref.current?.id || 'desconocido'} - ¡Ahora en vista!`);
        } else if (!entry.isIntersecting && isInView) {
          // Opcional: si quieres que la animación se repita cada vez que entra en vista
          // setIsInView(false);
          console.log(`Elemento ${ref.current?.id || 'desconocido'} - Salió de vista.`);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
      console.log(`Observando elemento: ${ref.current.id || 'desconocido'}`);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
        console.log(`Dejando de observar elemento: ${ref.current.id || 'desconocido'}`);
      }
    };
  }, [threshold, rootMargin, isInView]); // Dependencias del efecto

  return { ref, isInView };
};

export default useInView;