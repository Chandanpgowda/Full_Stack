import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
  accentColor = 'from-violet-600 to-purple-600'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} glass-dark rounded-3xl shadow-2xl border border-white/8 overflow-hidden z-10 animate-modal my-auto`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent gradient header bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${accentColor}`} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/6">
          <div>
            <h3
              className="text-lg font-bold text-white tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-white p-1.5 rounded-xl hover:bg-white/8 transition-colors -mr-1 mt-0.5"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 modal-scroll max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
