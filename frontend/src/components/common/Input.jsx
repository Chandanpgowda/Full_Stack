import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  id,
  name,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1"
        >
          {label}
          {required && <span className="text-pink-400 text-sm">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`dark-input ${Icon ? 'pl-10' : ''} ${error ? 'error' : ''} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-400 animate-slide-down flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
