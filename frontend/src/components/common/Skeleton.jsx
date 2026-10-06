import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full divide-y divide-slate-100 bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-24 hidden sm:block" />
          <div className="h-4 bg-slate-200 rounded w-28 hidden md:block" />
          <div className="flex gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};
