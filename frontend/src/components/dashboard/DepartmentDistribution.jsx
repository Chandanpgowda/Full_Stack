import React from 'react';
import { Building2, PieChart } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../utils/constants';

export const DepartmentDistribution = ({ employees = [], onSelectDepartment }) => {
  // Compute department distribution
  const counts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const total = employees.length;
  const sortedDepts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 tracking-tight">
              Department Distribution
            </h4>
            <p className="text-xs text-slate-500">Breakdown of workforce across units</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {sortedDepts.length} Units
        </span>
      </div>

      {sortedDepts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <PieChart className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm font-medium text-slate-600">No department data available</p>
          <p className="text-xs text-slate-400 mt-0.5">Add employees to see distribution</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1 justify-around">
          {sortedDepts.map(([dept, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colors = DEPARTMENT_COLORS[dept] || DEPARTMENT_COLORS.Default;

            return (
              <div
                key={dept}
                onClick={() => onSelectDepartment && onSelectDepartment(dept)}
                className="group cursor-pointer hover:bg-slate-50/80 p-2 -mx-2 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700 font-semibold group-hover:text-indigo-600 transition-colors">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    {dept}
                  </span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{count}</strong> ({percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
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
