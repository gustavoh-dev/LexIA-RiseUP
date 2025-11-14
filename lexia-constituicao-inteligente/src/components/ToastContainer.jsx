import React from 'react';
import { TOAST_TYPES } from '../hooks/useToast';

const ToastContainer = ({ toasts, onRemove }) => {
  const getToastStyles = (type) => {
    const baseStyles = 'fixed top-4 right-4 z-50 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in';
    
    const typeStyles = {
      [TOAST_TYPES.SUCCESS]: 'bg-green-500 text-white',
      [TOAST_TYPES.ERROR]: 'bg-red-500 text-white',
      [TOAST_TYPES.INFO]: 'bg-blue-500 text-white',
      [TOAST_TYPES.WARNING]: 'bg-yellow-500 text-white',
    };

    return `${baseStyles} ${typeStyles[type] || typeStyles[TOAST_TYPES.INFO]}`;
  };

  const getIcon = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✓';
      case TOAST_TYPES.ERROR:
        return '✕';
      case TOAST_TYPES.WARNING:
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          role="alert"
          aria-live="polite"
        >
          <span className="font-bold text-lg flex-shrink-0">
            {getIcon(toast.type)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 text-white hover:text-gray-200 transition"
            aria-label="Fechar notificação"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

