import React from 'react';
import { Users, Building2, TrendingUp, Sparkles } from 'lucide-react';

const STAT_CONFIG = [
  {
    title: 'Total Workforce',
    icon: Users,
    gradient: 'from-violet-600 to-purple-600',
    glow: 'glow-purple',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    textColor: 'text-violet-300',
    iconBg: 'bg-violet-500/20',
  },
  {
    title: 'Active Departments',
    icon: Building2,
    gradient: 'from-pink-600 to-rose-600',
    glow: 'glow-pink',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    textColor: 'text-pink-300',
    iconBg: 'bg-pink-500/20',
  },
  {
    title: 'Largest Department',
    icon: TrendingUp,
    gradient: 'from-cyan-600 to-blue-600',
    glow: 'glow-cyan',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    textColor: 'text-cyan-300',
    iconBg: 'bg-cyan-500/20',
    isText: true,
  },
  {
    title: 'Latest Onboarding',
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'glow-emerald',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    textColor: 'text-amber-300',
    iconBg: 'bg-amber-500/20',
    isText: true,
  },
];

export const StatsGrid = ({ employees = [], totalCount = 0 }) => {
  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const activeDepartmentCount = Object.keys(departmentCounts).length;

  let topDepartment = 'None';
  let maxCount = 0;
  Object.entries(departmentCounts).forEach(([dept, count]) => {
    if (count > maxCount) { maxCount = count; topDepartment = dept; }
  });

  const latestEmployee = employees[0]?.name || 'No records';

  const stats = [
    { ...STAT_CONFIG[0], value: totalCount, subtitle: `${totalCount} active profiles` },
    { ...STAT_CONFIG[1], value: activeDepartmentCount, subtitle: `${activeDepartmentCount} operational units` },
    { ...STAT_CONFIG[2], value: topDepartment, subtitle: maxCount > 0 ? `${maxCount} members` : 'No data yet' },
    { ...STAT_CONFIG[3], value: latestEmployee, subtitle: employees[0]?.designation || 'Add first employee' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-card p-5 border ${stat.border} relative overflow-hidden group stagger-${idx + 1} animate-slide-up`}
          >
            {/* Background gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500 rounded-[20px]`} />

            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.textColor} mb-2`}>
                  {stat.title}
                </p>
                <h3
                  className={`font-black text-white tracking-tight ${
                    stat.isText ? 'text-lg truncate max-w-[150px]' : 'text-3xl animate-count'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  title={typeof stat.value === 'string' ? stat.value : undefined}
                >
                  {stat.value}
                </h3>
              </div>

              <div className={`w-11 h-11 rounded-2xl ${stat.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>

            {/* Bottom subtitle */}
            <div className={`mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`} />
              <p className="text-[11px] text-slate-500 truncate">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
