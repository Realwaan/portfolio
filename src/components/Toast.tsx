import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';
import './Toast.css';


export interface ToastItem {
  id: string;
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>>;
}

interface ActiveToast extends ToastItem {
  exiting?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ toasts, setToasts }) => {
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);
  const timeoutsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // 1. Add any new toasts from props
    toasts.forEach((t) => {
      if (!activeToasts.some((a) => a.id === t.id)) {
        setActiveToasts((prev) => [...prev, t]);
        
        // Schedule auto-dismiss: mark exiting at 2200ms, delete at 2500ms
        const exitTimeout = window.setTimeout(() => {
          setActiveToasts((prev) => 
            prev.map((item) => item.id === t.id ? { ...item, exiting: true } : item)
          );
        }, 2200);

        const deleteTimeout = window.setTimeout(() => {
          // Remove from parent state
          setToasts((prev) => prev.filter((item) => item.id !== t.id));
        }, 2500);

        timeoutsRef.current[`exit-${t.id}`] = exitTimeout;
        timeoutsRef.current[`del-${t.id}`] = deleteTimeout;
      }
    });

    // 2. Handle toasts removed by parent (e.g. if parent trims the list to enforce max active counts)
    activeToasts.forEach((a) => {
      const existsInProps = toasts.some((t) => t.id === a.id);
      if (!existsInProps && !a.exiting) {
        // Mark as exiting immediately to trigger fade-out/blur animation
        setActiveToasts((prev) =>
          prev.map((item) => item.id === a.id ? { ...item, exiting: true } : item)
        );

        // Cancel previous timeouts
        if (timeoutsRef.current[`exit-${a.id}`]) {
          clearTimeout(timeoutsRef.current[`exit-${a.id}`]);
        }
        if (timeoutsRef.current[`del-${a.id}`]) {
          clearTimeout(timeoutsRef.current[`del-${a.id}`]);
        }

        // Schedule immediate deletion in 300ms (matching the CSS exit animation)
        const immediateDeleteTimeout = window.setTimeout(() => {
          setActiveToasts((prev) => prev.filter((item) => item.id !== a.id));
        }, 300);

        timeoutsRef.current[`del-${a.id}`] = immediateDeleteTimeout;
      }
    });

  }, [toasts, setToasts, activeToasts]);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach((t) => clearTimeout(t));
    };
  }, []);

  if (activeToasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {activeToasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast ${toast.exiting ? 'exiting' : ''}`}
        >
          <Check className="toast-success-icon" size={16} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
