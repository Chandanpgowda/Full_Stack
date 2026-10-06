import React from 'react';
import { Users, Building2, TrendingUp, Sparkles } from 'lucide-react';

export const StatsGrid = ({ employees = [], totalCount = 0 }) => {
  // Compute department metrics
  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const activeDepartmentCount = Object.keys(departmentCounts).length;

  // Find top department
  let topDepartment = 'None';
  let maxCount = 0;
  Object.entries(departmentCounts).forEach(([dept, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topDepartment = dept;
    }
  });

  // Most recently added employee
  const latestEmployee = employees[0]?.name || 'No records';

  const stats = [
    {
      title: 'Total Workforce',
      value: totalCount,
      subtitle: `${totalCount === 1 ? '1 active profile' : `${totalCount} active profiles`}`,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Active Departments',
      value: activeDepartmentCount,
      subtitle: `${activeDepartmentCount} operational units`,
      icon: Building2,
      color: 'from-purple-600 to-pink-600',
      iconBg: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Largest Department',
      value: topDepartment,
      subtitle: maxCount > 0 ? `${maxCount} team members` : 'No data yet',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
      isText: true
    },
    {
      title: 'Latest Onboarding',
      value: latestEmployee,
      subtitle: employees[0]?.designation || 'Ready to add',
      icon: Sparkles,
      color: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-50 text-amber-600',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>
                <h3
                  className={`mt-2 font-bold text-slate-900 tracking-tight ${
                    stat.isText ? 'text-lg sm:text-xl truncate max-w-[180px]' : 'text-3xl'
                  }`}
                  title={typeof stat.value === 'string' ? stat.value : undefined}
                >
                  {stat.value}
                </h3>
              </div>

              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 truncate pt-3 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
