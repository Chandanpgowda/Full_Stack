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
    <div className="glass-card p-6 border border-white/10 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4
              className="text-base font-bold text-white tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Recently Added Employees
            </h4>
            <p className="text-xs text-slate-400">Latest workforce additions</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-500">
          <p className="text-sm font-medium text-slate-300">No employees added yet</p>
          <p className="text-xs text-slate-500 mt-0.5">Newly created profiles will show up here</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 flex-1">
          {recentList.map((employee) => {
            const avatarBg = getAvatarBg(employee.name);

            return (
              <div
                key={employee._id}
                className="flex items-center justify-between py-3 hover:bg-white/5 -mx-3 px-3 rounded-2xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${avatarBg} group-hover:scale-105 transition-transform`}
                  >
                    {getInitials(employee.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                      {employee.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{employee.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="hidden sm:block">
                    <DepartmentBadge department={employee.department} />
                  </div>
                  <span className="text-[11px] text-slate-500 hidden lg:block">
                    {formatDate(employee.createdAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewEmployee(employee)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all cursor-pointer"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditEmployee(employee)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all cursor-pointer"
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
