import React from 'react';
import { UserPlus, Sparkles, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { DepartmentDistribution } from '../components/dashboard/DepartmentDistribution';
import { RecentEmployees } from '../components/dashboard/RecentEmployees';
import { Button } from '../components/common/Button';

export const DashboardPage = ({
  employees = [],
  totalCount = 0,
  onOpenAddModal,
  onViewEmployee,
  onEditEmployee,
  onNavigateToEmployees,
  onFilterByDepartment
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-modal">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-900/70 to-indigo-900/80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/30 via-transparent to-cyan-900/30" />

        {/* Orb decorations */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-600/15 blur-3xl" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-700/10 blur-3xl animate-spin-slow" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-violet-400/20 text-[11px] font-bold tracking-widest uppercase text-violet-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Real-Time Workforce Intelligence
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Employee Management
              <span className="block mt-1 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-300/80 leading-relaxed max-w-lg">
              Track workforce distribution, manage employee profiles, and maintain accurate departmental records with real-time MongoDB persistence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={onOpenAddModal}
              className="shadow-2xl shadow-violet-500/30"
            >
              Add Employee
            </Button>
            <Button
              variant="secondary"
              icon={ArrowRight}
              onClick={onNavigateToEmployees}
            >
              View All
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Stats ───────────────────────────────────────── */}
      <StatsGrid employees={employees} totalCount={totalCount} />

      {/* ── Analytics Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <DepartmentDistribution
            employees={employees}
            onSelectDepartment={(dept) => {
              onFilterByDepartment(dept);
              onNavigateToEmployees();
            }}
          />
        </div>
        <div className="lg:col-span-7">
          <RecentEmployees
            employees={employees}
            onViewEmployee={onViewEmployee}
            onEditEmployee={onEditEmployee}
            onViewAll={onNavigateToEmployees}
          />
        </div>
      </div>
    </div>
  );
};
