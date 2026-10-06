import React from 'react';
import { UserPlus, Sparkles } from 'lucide-react';
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-indigo-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Real-Time Workforce Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0">
              Employee Management Dashboard
            </h1>
            <p className="text-sm text-indigo-100/80 mt-2 leading-relaxed">
              Track organizational workforce distribution, manage employee profiles, and maintain accurate departmental records across your company.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              icon={UserPlus}
              onClick={onOpenAddModal}
              className="bg-white text-indigo-900 hover:bg-indigo-50 border-transparent shadow-md"
            >
              Add New Employee
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StatsGrid employees={employees} totalCount={totalCount} />

      {/* Analytics & Recent Activity Grid */}
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
