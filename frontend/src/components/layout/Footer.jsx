import React from 'react';
import { Heart, Server, Database, ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => (
  <footer className="mt-auto border-t border-white/5 glass-dark py-5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md grad-purple-pink flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
        <span className="text-slate-400 font-medium">EMS Portal</span>
        <span className="text-slate-600">·</span>
        <span>Gupio Campus Placement Assignment</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-slate-500 hover:text-violet-400 transition-colors">
          <Server className="w-3 h-3 text-violet-500" />
          Express API
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 transition-colors">
          <Database className="w-3 h-3 text-emerald-500" />
          MongoDB
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors">
          <ShieldCheck className="w-3 h-3 text-cyan-500" />
          Production Ready
        </span>
      </div>
    </div>
  </footer>
);
