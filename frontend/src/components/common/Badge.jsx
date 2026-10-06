import React from 'react';
import { DEPARTMENT_COLORS } from '../../utils/constants';

export const DepartmentBadge = ({ department, className = '' }) => {
  const color = DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.Default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all ${color.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
      {department}
    </span>
  );
};

export const Badge = ({ children, variant = 'slate', className = '' }) => {
  const styles = {
    slate: 'bg-white/10 text-slate-300 border-white/10',
    indigo: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border backdrop-blur-sm ${
        styles[variant] || styles.slate
      } ${className}`}
    >
      {children}
    </span>
  );
};
