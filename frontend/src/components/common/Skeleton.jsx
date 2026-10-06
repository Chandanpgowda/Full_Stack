import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`skeleton ${className}`} />
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full divide-y divide-white/5 glass-card border border-white/10 rounded-2xl overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <div className="w-10 h-10 rounded-2xl skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton rounded-lg w-1/4" />
            <div className="h-3 skeleton rounded-lg w-1/3 opacity-70" />
          </div>
          <div className="h-6 skeleton rounded-full w-24 hidden sm:block" />
          <div className="h-4 skeleton rounded-lg w-28 hidden md:block" />
          <div className="flex gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="w-8 h-8 rounded-xl skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};
