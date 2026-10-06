import React from 'react';
import { Users, Search, UserPlus } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Users,
  title = 'No employees found',
  description = 'Get started by creating your first employee profile.',
  actionText,
  onAction,
  isSearch = false
}) => {
  const DisplayIcon = isSearch ? Search : Icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
        <DisplayIcon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={isSearch ? undefined : UserPlus}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
