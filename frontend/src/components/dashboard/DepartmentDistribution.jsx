import React from 'react';
import { Building2, PieChart, ChevronRight } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../utils/constants';

export const DepartmentDistribution = ({ employees = [], onSelectDepartment }) => {
  const counts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const total = employees.length;
  const sortedDepts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-card p-6 border border-white/10 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4
              className="text-base font-bold text-white tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Department Distribution
            </h4>
            <p className="text-xs text-slate-400">Breakdown of workforce across units</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300">
          {sortedDepts.length} Units
        </span>
      </div>

      {sortedDepts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-500">
          <PieChart className="w-10 h-10 mb-2 opacity-40 text-violet-400 animate-pulse" />
          <p className="text-sm font-medium text-slate-300">No department data available</p>
          <p className="text-xs text-slate-500 mt-0.5">Add employees to see distribution</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 flex-1 justify-around">
          {sortedDepts.map(([dept, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colors = DEPARTMENT_COLORS[dept] || DEPARTMENT_COLORS.Default;

            return (
              <div
                key={dept}
                onClick={() => onSelectDepartment && onSelectDepartment(dept)}
                className="group cursor-pointer hover:bg-white/5 p-2.5 -mx-2 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/10"
              >
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span className="flex items-center gap-2 text-slate-200 font-semibold group-hover:text-white transition-colors">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    {dept}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      <strong className="text-white font-bold">{count}</strong> ({percentage}%)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${colors.bar} shadow-sm`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
