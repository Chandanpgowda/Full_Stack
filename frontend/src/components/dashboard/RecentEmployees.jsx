import React from 'react';
import { UserCheck, ArrowRight, Eye, Edit2 } from 'lucide-react';
import { DepartmentBadge } from '../common/Badge';
import { formatDate, getInitials, getAvatarBg } from '../../utils/formatters';

export const RecentEmployees = ({
  employees = [],
  onViewEmployee,
  onEditEmployee,
  onViewAll
}) => {
  const recentList = employees.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 tracking-tight">
              Recently Added Employees
            </h4>
            <p className="text-xs text-slate-500">Latest workforce additions</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <p className="text-sm font-medium text-slate-600">No employees added yet</p>
          <p className="text-xs text-slate-400 mt-0.5">Newly created profiles will show up here</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 flex-1">
          {recentList.map((employee) => {
            const avatarBg = getAvatarBg(employee.name);

            return (
              <div
                key={employee._id}
                className="flex items-center justify-between py-3 hover:bg-slate-50/80 -mx-3 px-3 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${avatarBg}`}
                  >
                    {getInitials(employee.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {employee.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{employee.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="hidden sm:block">
                    <DepartmentBadge department={employee.department} />
                  </div>
                  <span className="text-[11px] text-slate-400 hidden lg:block">
                    {formatDate(employee.createdAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewEmployee(employee)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditEmployee(employee)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
