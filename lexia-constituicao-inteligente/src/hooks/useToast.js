import { useState, useCallback } from 'react';

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * Hook para gerenciar notificações toast
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    // Remove automaticamente após a duração
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.SUCCESS, duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.ERROR, duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.INFO, duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, TOAST_TYPES.WARNING, duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};

