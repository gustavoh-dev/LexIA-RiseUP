import React from 'react';

/**
 * 
 * @param {{ size: 'sm' | 'md' | 'lg' }} props
 */
const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4', 
    lg: 'w-16 h-16 border-4', 
  };

  return (
    <div 
      className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses['md']} border-blue-500 border-t-transparent`}
      role="status"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

/**
 * 
 * @param {{ message?: string }} props
 */
export const FullScreenSpinner = ({ message = "Carregando..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <Spinner size="lg" />
      <p className="mt-4 text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Spinner;