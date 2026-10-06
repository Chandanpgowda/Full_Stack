import React from 'react';
import { Users, Search, UserPlus, Sparkles } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Users,
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
  isSearch = false
}) => {
  const DisplayIcon = isSearch ? Search : Icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card border border-white/10 shadow-2xl animate-modal relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -top-12 -right-12 animate-float" />
      
      <div className="relative w-16 h-16 rounded-3xl grad-purple-pink flex items-center justify-center text-white mb-5 shadow-lg glow-purple">
        <DisplayIcon className="w-8 h-8" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3
        className="text-lg font-bold text-white tracking-tight"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm mb-6 leading-relaxed">
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
