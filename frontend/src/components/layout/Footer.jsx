import React from 'react';
import { Heart, ShieldCheck, Database, Server } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Gupio Practical Assessment</span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-700">Employee Management System</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-indigo-500" />
            Express REST API
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            MongoDB
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Production Ready
          </span>
        </div>
      </div>
    </footer>
  );
};
