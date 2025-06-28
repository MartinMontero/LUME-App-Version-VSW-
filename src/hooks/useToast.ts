import { useState, useCallback } from 'react';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString();
    const toast: ToastItem = { ...options, id };
    
    setToasts(prev => [...prev, toast]);
    
    // Haptic feedback based on type
    if ('vibrate' in navigator) {
      switch (options.type) {
        case 'success':
          navigator.vibrate([50, 50, 50]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 100]);
          break;
        case 'warning':
          navigator.vibrate([75, 25, 75]);
          break;
        default:
          navigator.vibrate(50);
      }
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, title?: string) => {
    return addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    return addToast({ type: 'error', message, title });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    return addToast({ type: 'info', message, title });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    return addToast({ type: 'warning', message, title });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning
  };
};