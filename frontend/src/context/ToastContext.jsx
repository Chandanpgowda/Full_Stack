import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-white border-slate-200 text-slate-800';
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-50/95 border-emerald-300 text-emerald-950';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          } else if (toast.type === 'error') {
            bgClass = 'bg-rose-50/95 border-rose-300 text-rose-950';
            icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-50/95 border-amber-300 text-amber-950';
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-blue-50/95 border-blue-300 text-blue-950';
            icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg shadow-slate-900/10 backdrop-blur-md transition-all duration-200 animate-slide-down ${bgClass}`}
            >
              <div className="mt-0.5">{icon}</div>
              <p className="text-sm font-medium flex-1 leading-snug break-words">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 -mr-1 -mt-1 rounded-md"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
