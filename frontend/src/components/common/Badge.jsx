import React from 'react';
import { DEPARTMENT_COLORS } from '../../utils/constants';

export const DepartmentBadge = ({ department, className = '' }) => {
  const color = DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.Default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
      {department}
    </span>
  );
};

export const Badge = ({ children, variant = 'slate', className = '' }) => {
  const styles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[variant] || styles.slate
      } ${className}`}
    >
      {children}
    </span>
  );
};
