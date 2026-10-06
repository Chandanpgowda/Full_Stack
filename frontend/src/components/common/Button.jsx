import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'grad-purple-pink text-white glow-purple border-0 hover:opacity-90',
  secondary: 'glass text-slate-200 hover:border-violet-400/50 border border-white/10',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white border-0 shadow-lg',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent',
  outline: 'bg-transparent border border-violet-500 text-violet-400 hover:bg-violet-500/10',
  cyan: 'grad-cyan-purple text-white glow-cyan border-0 hover:opacity-90',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3 text-base font-semibold rounded-2xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-1 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
