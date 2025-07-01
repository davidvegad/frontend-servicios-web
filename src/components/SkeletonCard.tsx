import React from 'react';

interface SkeletonCardProps {
  height?: string;
  width?: string;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = 'h-48', width = 'w-full', className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${height} ${width} ${className}`}>
      {/* Puedes añadir más elementos de esqueleto aquí si lo necesitas, como líneas para texto */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonCard;
