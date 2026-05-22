import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>>;
}

export const Toast: React.FC<ToastProps> = ({ toasts, setToasts }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toasts, setToasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <Check className="toast-success-icon" size={16} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
